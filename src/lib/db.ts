import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const prismaClientSingleton = () => {
  const isEdge = typeof window === 'undefined' && (
    process.env.NEXT_RUNTIME === 'edge' ||
    typeof (globalThis as any).EdgeRuntime !== 'undefined' ||
    !(process as any).versions?.node
  );

  console.log("[Prisma DB DEBUG] isEdge:", isEdge);
  console.log("[Prisma DB DEBUG] DATABASE_URL is defined:", !!process.env.DATABASE_URL);

  if (isEdge) {
    try {
      if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("neon.tech")) {
        console.log("[Prisma DB DEBUG] Initializing Prisma Client with Neon Serverless adapter...");
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaNeon(pool as any);
        return new PrismaClient({ adapter: adapter as any });
      } else {
        console.warn("[Prisma DB] DATABASE_URL is missing or does not include neon.tech in Edge.");
      }
    } catch (e) {
      console.error("[Prisma DB] Error inicializando adaptador de Neon para Edge:", e);
    }
    
    console.warn("[Prisma DB] Returning recursive Proxy mock for PrismaClient to prevent Edge startup crash...");
    return new Proxy({} as any, {
      get: (target, prop) => {
        if (prop === 'then' || prop === 'constructor' || typeof prop !== 'string') return undefined;
        return new Proxy(() => {}, {
          get: (subTarget, subProp) => {
            if (subProp === 'then' || typeof subProp !== 'string') return undefined;
            return () => {
              throw new Error(`Prisma Client no inicializado en Edge: ${prop}.${subProp}`);
            };
          },
          apply: () => {
            throw new Error(`Prisma Client no inicializado en Edge: ${prop}`);
          }
        });
      }
    });
  }

  // Node.js (Local/Dev)
  try {
    console.log("[Prisma DB DEBUG] Node.js environment detected. Falling back to standard PrismaClient...");
    return new PrismaClient();
  } catch (nodeError) {
    console.error("[Prisma DB] Error instantiating standard PrismaClient under Node.js:", nodeError);
    throw nodeError;
  }
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
