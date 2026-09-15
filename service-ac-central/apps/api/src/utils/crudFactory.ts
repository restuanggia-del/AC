import { Request, Response } from "express";
import { Model } from "mongoose";
import { asyncHandler } from "./asyncHandler";
import { sendSuccess, sendError } from "./apiResponse";

interface CrudOptions {
  /** Field yang boleh dipakai sebagai filter query publik, misal ["category"] */
  filterableFields?: string[];
  /** Field default untuk sorting, misal "order" atau "-createdAt" */
  defaultSort?: string;
  /** Jika true, endpoint publik hanya menampilkan dokumen isActive: true */
  restrictActiveForPublic?: boolean;
}

/**
 * Membuat 5 handler CRUD standar (getAll, getOne, create, update, remove)
 * untuk sebuah Mongoose model, supaya tidak menulis ulang logic yang sama
 * di setiap controller resource.
 */
export function createCrudController<T>(model: Model<any>, options: CrudOptions = {}) {
  const { filterableFields = [], defaultSort = "-createdAt", restrictActiveForPublic = false } = options;

  const getAll = asyncHandler(async (req: Request, res: Response) => {
    const query: Record<string, unknown> = {};

    for (const field of filterableFields) {
      const value = req.query[field];
      if (value !== undefined && value !== "") {
        query[field] = value;
      }
    }

    // Endpoint publik (tanpa req.admin) hanya melihat data aktif jika opsi diaktifkan
    if (restrictActiveForPublic && !req.admin) {
      query.isActive = true;
    } else if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === "true";
    }

    const sort = (req.query.sort as string) || defaultSort;
    const items = await model.find(query).sort(sort);
    return sendSuccess(res, items);
  });

  const getOne = asyncHandler(async (req: Request, res: Response) => {
    const item = await model.findById(req.params.id);
    if (!item) {
      return sendError(res, "Data tidak ditemukan", 404);
    }
    return sendSuccess(res, item);
  });

  const create = asyncHandler(async (req: Request, res: Response) => {
    const item = await model.create(req.body);
    return sendSuccess(res, item, "Data berhasil dibuat", 201);
  });

  const update = asyncHandler(async (req: Request, res: Response) => {
    const item = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return sendError(res, "Data tidak ditemukan", 404);
    }
    return sendSuccess(res, item, "Data berhasil diperbarui");
  });

  const remove = asyncHandler(async (req: Request, res: Response) => {
    const item = await model.findByIdAndDelete(req.params.id);
    if (!item) {
      return sendError(res, "Data tidak ditemukan", 404);
    }
    return sendSuccess(res, null, "Data berhasil dihapus");
  });

  return { getAll, getOne, create, update, remove };
}
