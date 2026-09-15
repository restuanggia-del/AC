import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Token akses tidak ditemukan. Silakan login kembali.", 401);
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret) as AuthPayload;
    req.admin = decoded;
    next();
  } catch (error) {
    throw new AppError("Token akses tidak valid atau sudah kedaluwarsa.", 401);
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      throw new AppError("Anda tidak memiliki akses untuk aksi ini.", 403);
    }
    next();
  };
}
