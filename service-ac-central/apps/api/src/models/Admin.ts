import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "superadmin" | "editor";
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "editor"], default: "editor" },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const Admin = model<IAdmin>("Admin", adminSchema);
