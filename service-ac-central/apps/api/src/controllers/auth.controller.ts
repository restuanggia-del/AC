import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Admin } from "../models/Admin";
import { asyncHandler } from "../utils/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

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
