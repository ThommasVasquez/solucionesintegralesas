import { db } from './db';

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp: string; // ISO String
  direction: 'INBOUND' | 'OUTBOUND';
}

// In-memory fallback for environments without fs support (like Edge Runtime) and no DB
const globalStore = globalThis as unknown as {
  whatsappMessages?: WhatsAppMessage[];
};

if (!globalStore.whatsappMessages) {
  globalStore.whatsappMessages = [];
}

// Dynamically check if we can use the filesystem (Node.js environment)
async function getNodeFs() {
  if (typeof window === 'undefined' && process.env.NEXT_RUNTIME !== 'edge') {
    try {
      const fsName = 'fs';
      const pathName = 'path';
      const fs = await import(fsName);
      const path = await import(pathName);
      return { fs: fs.default || fs, path: path.default || path };
    } catch {
      return null;
    }
  }
  return null;
}

// Leer mensajes
export async function getStoredMessages(): Promise<WhatsAppMessage[]> {
  if (process.env.DATABASE_URL) {
    try {
      const messages = await db.whatsAppMessage.findMany({
        orderBy: { timestamp: 'asc' },
      });
      return messages.map((m: any) => ({
        id: m.id,
        chatId: m.chatId,
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
        direction: m.direction as 'INBOUND' | 'OUTBOUND',
      }));
    } catch (e) {
      console.warn('[WhatsApp Store] Error leyendo de la base de datos, usando fallback:', e);
    }
  }

  // Fallback a archivos
  const nodeFs = await getNodeFs();
  if (nodeFs) {
    const { fs, path } = nodeFs;
    const cwd = (globalThis as any).process?.cwd?.() || '';
    const DATA_DIR = path.join(cwd, 'data');
    const DATA_FILE = path.join(DATA_DIR, 'whatsapp-messages.json');
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(DATA_FILE)) {
        return [];
      }
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw) as WhatsAppMessage[];
    } catch (e) {
      console.error('[WhatsApp Store] Error leyendo archivo:', e);
      return [];
    }
  } else {
    return globalStore.whatsappMessages || [];
  }
}

// Escribir/Guardar mensajes masivos (usado para demo e importación)
export async function saveStoredMessages(messages: WhatsAppMessage[]): Promise<boolean> {
  if (process.env.DATABASE_URL) {
    try {
      // Eliminar existentes y guardar los nuevos para sincronizar
      await db.$transaction([
        db.whatsAppMessage.deleteMany(),
        db.whatsAppMessage.createMany({
          data: messages.map((m) => ({
            id: m.id,
            chatId: m.chatId,
            sender: m.sender,
            content: m.content,
            timestamp: new Date(m.timestamp),
            direction: m.direction,
          })),
        }),
      ]);
      return true;
    } catch (e) {
      console.warn('[WhatsApp Store] Error guardando en la base de datos, usando fallback:', e);
    }
  }

  // Fallback a archivos
  const nodeFs = await getNodeFs();
  if (nodeFs) {
    const { fs, path } = nodeFs;
    const cwd = (globalThis as any).process?.cwd?.() || '';
    const DATA_DIR = path.join(cwd, 'data');
    const DATA_FILE = path.join(DATA_DIR, 'whatsapp-messages.json');
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('[WhatsApp Store] Error escribiendo archivo:', e);
      return false;
    }
  } else {
    globalStore.whatsappMessages = messages;
    return true;
  }
}

// Agregar un mensaje (con deduplicación)
export async function addStoredMessage(message: WhatsAppMessage): Promise<{ success: boolean; isDuplicate: boolean }> {
  if (process.env.DATABASE_URL) {
    try {
      const exists = await db.whatsAppMessage.findUnique({
        where: { id: message.id },
      });
      if (exists) {
        const existingTime = new Date(exists.timestamp).getTime();
        const newTime = new Date(message.timestamp).getTime();
        
        // Si el timestamp guardado difiere del nuevo (ej: antes se guardó con fecha actual por error)
        if (Math.abs(existingTime - newTime) > 1000) {
          await db.whatsAppMessage.update({
            where: { id: message.id },
            data: {
              timestamp: new Date(message.timestamp),
            },
          });
          return { success: true, isDuplicate: false };
        }
        return { success: true, isDuplicate: true };
      }
      await db.whatsAppMessage.create({
        data: {
          id: message.id,
          chatId: message.chatId,
          sender: message.sender,
          content: message.content,
          timestamp: new Date(message.timestamp),
          direction: message.direction,
        },
      });
      return { success: true, isDuplicate: false };
    } catch (e) {
      console.warn('[WhatsApp Store] Error agregando a la base de datos, usando fallback:', e);
    }
  }

  // Fallback a archivos
  const messages = await getStoredMessages();
  const index = messages.findIndex((m) => m.id === message.id);
  if (index !== -1) {
    const existingTime = new Date(messages[index].timestamp).getTime();
    const newTime = new Date(message.timestamp).getTime();
    if (Math.abs(existingTime - newTime) > 1000) {
      messages[index].timestamp = message.timestamp;
      await saveStoredMessages(messages);
      return { success: true, isDuplicate: false };
    }
    return { success: true, isDuplicate: true };
  }

  messages.push(message);
  const saved = await saveStoredMessages(messages);
  return { success: saved, isDuplicate: false };
}

// Limpiar todos los mensajes
export async function clearStoredMessages(): Promise<boolean> {
  if (process.env.DATABASE_URL) {
    try {
      await db.whatsAppMessage.deleteMany();
      return true;
    } catch (e) {
      console.warn('[WhatsApp Store] Error limpiando base de datos, usando fallback:', e);
    }
  }
  return saveStoredMessages([]);
}
