import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          success: false,
          message: "Data yang dikirim tidak valid",
          errors: error.flatten().fieldErrors,
        });
      }
      next(error);
    }
  };
}
