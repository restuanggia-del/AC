import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function bootstrap() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`[Server] Berjalan di http://localhost:${env.port}`);
    console.log(`[Server] Environment: ${env.nodeEnv}`);
  });
}

bootstrap().catch((error) => {
  console.error("[Server] Gagal memulai server:", error);
  process.exit(1);
});
