import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { sendPasswordResetEmail } from "@/lib/email/send-password-reset";
import { getSiteUrl } from "@/lib/site-url";

const schema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase().trim()),
});

const RESET_TOKEN_TTL_MINUTES = 30;

function genericResponse() {
  return NextResponse.json(
    {
      ok: true,
      message: "Jeśli konto istnieje, wysłaliśmy link do resetu hasła.",
    },
    { status: 200 },
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return genericResponse();
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return genericResponse();
  }

  const { email } = parsed.data;

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return genericResponse();
  }

  const rawToken = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000),
  });

  const resetUrl = `${getSiteUrl()}/odzyskaj-haslo/ustaw?token=${rawToken}`;

  try {
    await sendPasswordResetEmail({ to: email, resetUrl });
  } catch (err) {
    console.error("[forgot-password] email send failed:", err);
  }

  return genericResponse();
}
