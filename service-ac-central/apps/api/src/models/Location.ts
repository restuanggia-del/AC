import { Schema, model, Document } from "mongoose";

export interface ILocation extends Document {
  areaName: string;
  mapEmbedUrl: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    areaName: { type: String, required: true, trim: true },
    mapEmbedUrl: { type: String, required: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Location = model<ILocation>("Location", locationSchema);
