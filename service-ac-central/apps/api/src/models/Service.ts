import { Schema, model, Document } from "mongoose";

export type ServiceCategory =
  | "cuci"
  | "service"
  | "pasang"
  | "bongkar"
  | "freon"
  | "sparepart"
  | "lainnya";

export interface IService extends Document {
  name: string;
  category: ServiceCategory;
  pkSize: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["cuci", "service", "pasang", "bongkar", "freon", "sparepart", "lainnya"],
      required: true,
    },
    pkSize: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = model<IService>("Service", serviceSchema);
