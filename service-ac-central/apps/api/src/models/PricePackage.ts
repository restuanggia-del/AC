import { Schema, model, Document } from "mongoose";

export interface IChecklistItem {
  item: string;
  included: boolean;
}

export interface IPricePackage extends Document {
  name: string;
  pkSize: string;
  price: number;
  checklist: IChecklistItem[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const checklistItemSchema = new Schema<IChecklistItem>(
  {
    item: { type: String, required: true, trim: true },
    included: { type: Boolean, default: true },
  },
  { _id: false }
);

const pricePackageSchema = new Schema<IPricePackage>(
  {
    name: { type: String, required: true, trim: true },
    pkSize: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    checklist: { type: [checklistItemSchema], default: [] },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PricePackage = model<IPricePackage>("PricePackage", pricePackageSchema);
