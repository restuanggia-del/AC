import nodemailer from "nodemailer";
import { env } from "../config/env";

const isSmtpConfigured = Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

const transporter = isSmtpConfigured
    ? nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpPort === 465,
        auth: { user: env.smtpUser, pass: env.smtpPass },
    })
    : null;

interface SendResetPasswordEmailParams {
    to: string;
    name: string;
    resetLink: string;
}

export async function sendResetPasswordEmail({ to, name, resetLink }: SendResetPasswordEmailParams) {
    const subject = "Reset Password - Service AC Central Admin Panel";
    const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Halo, ${name}</h2>
      <p>Kami menerima permintaan reset password untuk akun admin kamu.</p>
      <p>Klik tombol di bawah untuk membuat password baru (link berlaku 1 jam):</p>
      <p>
        <a href="${resetLink}" style="display:inline-block;background:#1361ea;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Reset Password
        </a>
      </p>
      <p>Kalau kamu tidak merasa meminta reset password, abaikan saja email ini.</p>
    </div>
  `;

    if (!transporter) {
        console.log("\n=== [DEV MODE] SMTP belum dikonfigurasi ===");
        console.log(`Link reset password untuk ${to}:`);
        console.log(resetLink);
        console.log("============================================\n");
        return;
    }

    await transporter.sendMail({
        from: env.smtpFrom,
        to,
        subject,
        html,
    });
}
