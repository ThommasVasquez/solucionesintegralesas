import fs from 'fs';
import path from 'path';

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp: string; // ISO String
  direction: 'INBOUND' | 'OUTBOUND';
}

// Ruta del archivo de persistencia en disco
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'whatsapp-messages.json');

// Asegurar que el directorio existe
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Leer mensajes del disco
export function getStoredMessages(): WhatsAppMessage[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as WhatsAppMessage[];
  } catch (e) {
    console.error('[WhatsApp Store] Error leyendo archivo:', e);
    return [];
  }
}

// Escribir mensajes al disco
export function saveStoredMessages(messages: WhatsAppMessage[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('[WhatsApp Store] Error escribiendo archivo:', e);
    return false;
  }
}

// Agregar un mensaje (con deduplicación)
export function addStoredMessage(message: WhatsAppMessage): { success: boolean; isDuplicate: boolean } {
  const messages = getStoredMessages();

  // Evitar duplicados
  const exists = messages.some(m => m.id === message.id);
  if (exists) {
    return { success: true, isDuplicate: true };
  }

  messages.push(message);
  const saved = saveStoredMessages(messages);
  return { success: saved, isDuplicate: false };
}

// Limpiar todos los mensajes
export function clearStoredMessages(): boolean {
  return saveStoredMessages([]);
}
