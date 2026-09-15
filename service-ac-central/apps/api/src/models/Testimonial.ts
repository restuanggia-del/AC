import { Schema, model, Document } from "mongoose";

export interface ITestimonial extends Document {
  customerName: string;
  photoUrl?: string;
  rating: number;
  message: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    customerName: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Testimonial = model<ITestimonial>("Testimonial", testimonialSchema);
