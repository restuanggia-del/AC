import { Schema, model, Document } from "mongoose";

export type ContactStatus = "new" | "read" | "archived";

export interface IContactMessage extends Document {
  name: string;
  email?: string;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "archived"], default: "new" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ContactMessage = model<IContactMessage>("ContactMessage", contactMessageSchema);
