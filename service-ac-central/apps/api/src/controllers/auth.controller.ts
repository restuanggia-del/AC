import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Admin } from "../models/Admin";
import { asyncHandler } from "../utils/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";
import { sendResetPasswordEmail } from "../utils/mailer";

function generateTokens(payload: { id: string; email: string; role: string }) {
  const accessToken = jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpires,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpires,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    return sendError(res, "Email atau password salah", 401);
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return sendError(res, "Email atau password salah", 401);
  }

  const payload = { id: admin.id, email: admin.email, role: admin.role };
  const { accessToken, refreshToken } = generateTokens(payload);

  return sendSuccess(res, {
    accessToken,
    refreshToken,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  }, "Login berhasil");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret) as {
      id: string;
      email: string;
      role: string;
    };

    const { accessToken } = generateTokens({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    return sendSuccess(res, { accessToken });
  } catch (error) {
    throw new AppError("Refresh token tidak valid atau sudah kedaluwarsa", 401);
  }
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  return sendSuccess(res, null, "Logout berhasil");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const admin = await Admin.findById(req.admin?.id).select("-passwordHash");
  if (!admin) {
    return sendError(res, "Admin tidak ditemukan", 404);
  }
  return sendSuccess(res, admin);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin?.id);
  if (!admin) {
    return sendError(res, "Admin tidak ditemukan", 404);
  }

  if (newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return sendError(res, "Password saat ini salah", 401);
    }
    admin.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  // Kalau email diganti, pastikan belum dipakai admin lain
  const normalizedEmail = email.toLowerCase();
  if (normalizedEmail !== admin.email) {
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return sendError(res, "Email sudah digunakan oleh admin lain", 409);
    }
  }

  admin.name = name;
  admin.email = normalizedEmail;
  await admin.save();

  return sendSuccess(
    res,
    { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    "Profil berhasil diperbarui"
  );
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, registrationCode } = req.body;

  if (!env.adminRegistrationCode || registrationCode !== env.adminRegistrationCode) {
    return sendError(res, "Kode registrasi tidak valid.", 403);
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await Admin.findOne({ email: normalizedEmail });
  if (existing) {
    return sendError(res, "Email sudah terdaftar, silakan login.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email: normalizedEmail, passwordHash, role: "editor" });

  const payload = { id: admin.id, email: admin.email, role: admin.role };
  const { accessToken, refreshToken } = generateTokens(payload);

  return sendSuccess(
    res,
    {
      accessToken,
      refreshToken,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    },
    "Registrasi berhasil",
    201
  );
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();

  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    return sendSuccess(res, null, "Kalau email terdaftar, link reset password sudah dikirim.");
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  admin.resetPasswordTokenHash = tokenHash;
  admin.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam
  await admin.save();

  const resetLink = `${env.adminPanelUrl}/reset-password?token=${rawToken}`;

  await sendResetPasswordEmail({ to: admin.email, name: admin.name, resetLink });

  return sendSuccess(res, null, "Kalau email terdaftar, link reset password sudah dikirim.");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const admin = await Admin.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordTokenHash +resetPasswordExpires");

  if (!admin) {
    return sendError(res, "Link reset password tidak valid atau sudah kedaluwarsa.", 400);
  }

  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  admin.resetPasswordTokenHash = undefined;
  admin.resetPasswordExpires = undefined;
  await admin.save();

  return sendSuccess(res, null, "Password berhasil direset. Silakan login dengan password baru.");
});
