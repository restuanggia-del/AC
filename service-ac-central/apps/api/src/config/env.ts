import dotenv from "dotenv";

dotenv.config();

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? "5000", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",

  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/service-ac-central"),

  jwtAccessSecret: required("JWT_ACCESS_SECRET", "dev_access_secret"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET", "dev_refresh_secret"),
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? "15m",
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES ?? "7d",

  corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:5173,http://localhost:5174").split(","),

  seedAdminName: process.env.SEED_ADMIN_NAME ?? "Super Admin",
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL ?? "solusiaccentral@gmail.com",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!",

  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  maxUploadSizeMb: parseInt(process.env.MAX_UPLOAD_SIZE_MB ?? "5", 10),

  adminRegistrationCode: process.env.ADMIN_REGISTRATION_CODE ?? "",

  adminPanelUrl: process.env.ADMIN_PANEL_URL ?? "http://localhost:5174",

  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: parseInt(process.env.SMTP_PORT ?? "587", 10),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  smtpFrom: process.env.SMTP_FROM ?? "Service AC Central <no-reply@serviceaccentral.com>",
};
