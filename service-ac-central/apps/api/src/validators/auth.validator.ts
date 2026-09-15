import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token wajib diisi"),
});

export const updateProfileSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter").optional(),
  })
  .refine((data) => !data.newPassword || !!data.currentPassword, {
    message: "Password saat ini wajib diisi untuk mengganti password",
    path: ["currentPassword"],
  });

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  registrationCode: z.string().min(1, "Kode registrasi wajib diisi"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token tidak valid"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
});
