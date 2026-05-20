import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const prismaClientSingleton = () => {
  try {
    if (typeof window === 'undefined' && process.env.DATABASE_URL) {
      // Solo usamos el adaptador de Neon en el Edge Runtime de producción
      // si la base de datos es efectivamente de Neon (contiene neon.tech)
      if (process.env.NEXT_RUNTIME === 'edge' && process.env.DATABASE_URL.includes("neon.tech")) {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaNeon(pool as any);
        return new PrismaClient({ adapter: adapter as any });
      }
    }
  } catch (e) {
    console.error("[Prisma DB] Error inicializando adaptador de Neon para Edge, usando cliente estándar:", e);
  }
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
