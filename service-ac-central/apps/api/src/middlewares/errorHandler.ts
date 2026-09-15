import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("[Error]", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Mongoose validation error
  if (err && typeof err === "object" && "name" in err && (err as any).name === "ValidationError") {
    return res.status(422).json({
      success: false,
      message: "Data yang dikirim tidak valid",
      errors: (err as any).errors,
    });
  }

  // Mongoose duplicate key error
  if (err && typeof err === "object" && "code" in err && (err as any).code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Data sudah ada (duplikat)",
      errors: (err as any).keyValue,
    });
  }

  const message = err instanceof Error ? err.message : "Terjadi kesalahan pada server";

  return res.status(500).json({
    success: false,
    message,
  });
}
