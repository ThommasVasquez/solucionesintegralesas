import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const prismaClientSingleton = () => {
  console.log("[Prisma DB DEBUG] DATABASE_URL is defined:", !!process.env.DATABASE_URL);
  console.log("[Prisma DB DEBUG] NEXT_RUNTIME:", process.env.NEXT_RUNTIME);
  console.log("[Prisma DB DEBUG] DATABASE_URL includes neon.tech:", process.env.DATABASE_URL?.includes("neon.tech"));

  try {
    if (typeof window === 'undefined' && process.env.DATABASE_URL) {
      // Solo usamos el adaptador de Neon en el Edge Runtime de producción
      // si la base de datos es efectivamente de Neon (contiene neon.tech)
      if (process.env.NEXT_RUNTIME === 'edge' && process.env.DATABASE_URL.includes("neon.tech")) {
        console.log("[Prisma DB DEBUG] Initializing Prisma Client with Neon Serverless adapter...");
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaNeon(pool as any);
        return new PrismaClient({ adapter: adapter as any });
      }
    }
  } catch (e) {
    console.error("[Prisma DB] Error inicializando adaptador de Neon para Edge, usando cliente estándar:", e);
  }
  
  console.log("[Prisma DB DEBUG] Falling back to standard PrismaClient...");
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
