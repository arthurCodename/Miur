import { NextResponse } from "next/server";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt, isNull } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";

const schema = z.object({
  token: z.string().min(1, "Token jest wymagany"),
  password: z
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .max(72, "Hasło może mieć maksymalnie 72 znaki"),
});

const GENERIC_ERROR = "Link wygasł lub został już użyty.";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy format żądania" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane" },
      { status: 400 },
    );
  }

  const { token, password } = parsed.data;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const [row] = await db
    .select({
      id: passwordResetTokens.id,
      userId: passwordResetTokens.userId,
    })
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        gt(passwordResetTokens.expiresAt, new Date()),
        isNull(passwordResetTokens.consumedAt),
      ),
    )
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

 // Update password first. If this fails, no token is consumed, so the user can retry.
await db
  .update(users)
  .set({ passwordHash, updatedAt: new Date() })
  .where(eq(users.id, row.userId));

// Mark all of this user's unconsumed tokens (including the one we just used) as consumed.
// This single statement covers both "consume the current token" AND "invalidate sibling tokens"
// — the WHERE matches every unconsumed token for this user.
await db
  .update(passwordResetTokens)
  .set({ consumedAt: new Date() })
  .where(
    and(
      eq(passwordResetTokens.userId, row.userId),
      isNull(passwordResetTokens.consumedAt),
    ),
  );

  return NextResponse.json({ ok: true }, { status: 200 });
}
