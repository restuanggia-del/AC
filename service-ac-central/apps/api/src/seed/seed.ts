import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import { env } from "../config/env";
import { Admin } from "../models/Admin";
import { Service } from "../models/Service";
import { SiteSettings } from "../models/SiteSettings";
import { Location } from "../models/Location";
import { FAQ } from "../models/FAQ";
import mongoose from "mongoose";

async function seed() {
  await connectDB();

  // 1. Admin default
  const existingAdmin = await Admin.findOne({ email: env.seedAdminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(env.seedAdminPassword, 10);
    await Admin.create({
      name: env.seedAdminName,
      email: env.seedAdminEmail,
      passwordHash,
      role: "superadmin",
    });
    console.log(`[Seed] Admin default dibuat: ${env.seedAdminEmail} / ${env.seedAdminPassword}`);
  } else {
    console.log("[Seed] Admin default sudah ada, dilewati.");
  }

  // 2. Site settings default
  const existingSettings = await SiteSettings.findOne();
  if (!existingSettings) {
    await SiteSettings.create({
      companyName: "Service AC Central",
      tagline: "Teknisi Ahli & Profesional",
      whatsappNumber: "6281234567890",
      phoneNumber: "081234567890",
      email: "info@serviceaccentral.com",
      address: "Jl. Contoh Alamat No. 123, Jakarta",
      operationalHours: "Setiap Hari, 08.00 - 20.00",
      heroTitle: "Service AC Central",
      heroSubtitle: "Teknisi Ahli & Profesional, Siap Membantu AC Anda Kembali Dingin",
      stats: [
        { label: "Klien Puas", value: 5000 },
        { label: "Teknisi Berpengalaman", value: 25 },
        { label: "Kota Terjangkau", value: 10 },
        { label: "Tahun Pengalaman", value: 8 },
      ],
    });
    console.log("[Seed] Site settings default dibuat.");
  } else {
    console.log("[Seed] Site settings sudah ada, dilewati.");
  }

  // 3. Contoh layanan
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        name: "Cuci AC",
        category: "cuci",
        pkSize: "0.5 - 1 PK",
        price: 75000,
        description: "Pembersihan menyeluruh unit indoor & outdoor AC Anda.",
        order: 1,
      },
      {
        name: "Cuci AC",
        category: "cuci",
        pkSize: "1.5 - 2 PK",
        price: 85000,
        description: "Pembersihan menyeluruh unit indoor & outdoor AC Anda.",
        order: 2,
      },
      {
        name: "Pasang AC Baru",
        category: "pasang",
        pkSize: "0.5 - 1 PK",
        price: 400000,
        description: "Instalasi AC baru lengkap dengan indoor & outdoor.",
        order: 3,
      },
      {
        name: "Isi Freon",
        category: "freon",
        pkSize: "0.5 - 1 PK",
        price: 375000,
        description: "Pengisian freon untuk AC yang kurang dingin.",
        order: 4,
      },
    ]);
    console.log("[Seed] Contoh data layanan dibuat.");
  } else {
    console.log("[Seed] Data layanan sudah ada, dilewati.");
  }

  // 4. Contoh lokasi
  const locationCount = await Location.countDocuments();
  if (locationCount === 0) {
    await Location.insertMany([
      {
        areaName: "Jakarta Selatan",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=example-jakarta-selatan",
        order: 1,
      },
      {
        areaName: "Tangerang",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=example-tangerang",
        order: 2,
      },
    ]);
    console.log("[Seed] Contoh data lokasi dibuat.");
  } else {
    console.log("[Seed] Data lokasi sudah ada, dilewati.");
  }

  // 5. Contoh FAQ
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    await FAQ.insertMany([
      {
        question: "Berapa lama proses service AC berlangsung?",
        answer: "Rata-rata proses cuci AC memakan waktu 30-45 menit per unit, tergantung kondisi AC.",
        order: 1,
      },
      {
        question: "Apakah ada garansi untuk layanan yang diberikan?",
        answer: "Ya, kami memberikan garansi hingga 1 bulan untuk setiap layanan yang kami kerjakan.",
        order: 2,
      },
      {
        question: "Bagaimana cara memesan layanan?",
        answer: "Anda cukup klik tombol WhatsApp di website ini, lalu sampaikan keluhan AC Anda kepada CS kami.",
        order: 3,
      },
    ]);
    console.log("[Seed] Contoh data FAQ dibuat.");
  } else {
    console.log("[Seed] Data FAQ sudah ada, dilewati.");
  }

  console.log("[Seed] Selesai.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("[Seed] Gagal menjalankan seed:", error);
  process.exit(1);
});
