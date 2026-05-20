export interface WhatsAppMessage {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp: string; // ISO String
  direction: 'INBOUND' | 'OUTBOUND';
}

// In-memory fallback for environments without fs support (like Edge Runtime)
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
      // Use dynamic string variables to prevent the Next.js bundler from trying to resolve/bundle
      // Node.js native modules in the browser/edge bundles.
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

// Escribir mensajes
export async function saveStoredMessages(messages: WhatsAppMessage[]): Promise<boolean> {
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
  const messages = await getStoredMessages();

  // Evitar duplicados
  const exists = messages.some(m => m.id === message.id);
  if (exists) {
    return { success: true, isDuplicate: true };
  }

  messages.push(message);
  const saved = await saveStoredMessages(messages);
  return { success: saved, isDuplicate: false };
}

// Limpiar todos los mensajes
export async function clearStoredMessages(): Promise<boolean> {
  return saveStoredMessages([]);
}


