import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongoUri);
    console.log(`[MongoDB] Terhubung ke database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("[MongoDB] Gagal terhubung ke database:", error);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Koneksi terputus.");
  });
}
