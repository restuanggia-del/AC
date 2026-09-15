import { Schema, model, Document } from "mongoose";

export type PortfolioCategory = "service" | "cuci" | "pasang";

export interface IPortfolio extends Document {
  title: string;
  category: PortfolioCategory;
  imageUrl: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ["service", "cuci", "pasang"], required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Portfolio = model<IPortfolio>("Portfolio", portfolioSchema);
