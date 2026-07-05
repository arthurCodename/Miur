import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPasswordResetEmailParams {
  to: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<void> {
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to,
    subject: "Resetowanie hasła — Miur",
    text:
      `Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w Miur.\n\n` +
      `Aby ustawić nowe hasło, otwórz ten link:\n${resetUrl}\n\n` +
      `Link wygasa za 30 minut. Jeśli to nie Ty prosiłeś o reset, zignoruj tę wiadomość.\n\n` +
      `— Miur`,
    html:
      `<p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w Miur.</p>` +
      `<p>Aby ustawić nowe hasło, kliknij ten link:</p>` +
      `<p><a href="${resetUrl}">${resetUrl}</a></p>` +
      `<p style="color:#666;font-size:13px">Link wygasa za 30 minut. Jeśli to nie Ty prosiłeś o reset, zignoruj tę wiadomość.</p>` +
      `<p>— Miur</p>`,
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}
