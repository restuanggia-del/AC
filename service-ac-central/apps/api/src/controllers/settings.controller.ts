import { Request, Response } from "express";
import { SiteSettings } from "../models/SiteSettings";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";

/**
 * SiteSettings adalah dokumen tunggal (singleton).
 * Jika belum ada, otomatis dibuat dengan nilai default saat pertama kali diakses.
 */
async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getOrCreateSettings();
  return sendSuccess(res, settings);
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await getOrCreateSettings();
  Object.assign(settings, req.body);
  await settings.save();
  return sendSuccess(res, settings, "Pengaturan berhasil diperbarui");
});
