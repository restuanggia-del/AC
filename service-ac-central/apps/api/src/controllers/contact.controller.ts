import { Request, Response } from "express";
import { ContactMessage } from "../models/ContactMessage";
import { asyncHandler } from "../utils/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  const contact = await ContactMessage.create({ name, email, phone, message });
  return sendSuccess(res, contact, "Pesan berhasil dikirim, kami akan segera menghubungi Anda", 201);
});

export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const contacts = await ContactMessage.find(filter).sort("-createdAt");
  return sendSuccess(res, contacts);
});

export const updateContactStatus = asyncHandler(async (req: Request, res: Response) => {
  const contact = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!contact) {
    return sendError(res, "Pesan tidak ditemukan", 404);
  }
  return sendSuccess(res, contact, "Status pesan berhasil diperbarui");
});

export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!contact) {
    return sendError(res, "Pesan tidak ditemukan", 404);
  }
  return sendSuccess(res, null, "Pesan berhasil dihapus");
});
