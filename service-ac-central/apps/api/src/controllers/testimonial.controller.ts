import { Request, Response } from "express";
import { Testimonial } from "../models/Testimonial";
import { createCrudController } from "../utils/crudFactory";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";

const base = createCrudController(Testimonial, { defaultSort: "-createdAt" });

// Override getAll: publik hanya lihat yang isPublished true, admin lihat semua
const getAllPublicAware = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.admin ? {} : { isPublished: true };
  const items = await Testimonial.find(filter).sort("-createdAt");
  return sendSuccess(res, items);
});

export const testimonialController = {
  ...base,
  getAll: getAllPublicAware,
};
