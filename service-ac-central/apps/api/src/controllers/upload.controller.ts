import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return sendError(res, "Tidak ada file yang diunggah", 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return sendSuccess(res, { url: fileUrl, filename: req.file.filename }, "File berhasil diunggah", 201);
});
