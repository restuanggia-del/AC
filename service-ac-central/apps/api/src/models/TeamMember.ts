import { Schema, model, Document } from "mongoose";

export interface ISocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  whatsapp?: string;
}

export interface ITeamMember extends Document {
  name: string;
  position: string;
  photoUrl?: string;
  description?: string;
  socialLinks?: ISocialLinks;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const socialLinksSchema = new Schema<ISocialLinks>(
  {
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
  },
  { _id: false }
);

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    socialLinks: { type: socialLinksSchema, default: {} },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TeamMember = model<ITeamMember>("TeamMember", teamMemberSchema);
