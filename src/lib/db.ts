import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const prismaClientSingleton = () => {
  if (typeof window === 'undefined' && process.env.DATABASE_URL) {
    // Si estamos en Cloudflare Workers / Edge Runtime, usamos el adaptador Neon HTTP/Websockets
    if (process.env.NEXT_RUNTIME === 'edge') {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const adapter = new PrismaNeon(pool as any);
      return new PrismaClient({ adapter: adapter as any });
    }
  }
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
