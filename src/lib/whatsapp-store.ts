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

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'whatsapp_messages.json');

// Asegura que el directorio exista
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

export function getStoredMessages(): WhatsAppMessage[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(content) as WhatsAppMessage[];
  } catch (error) {
    console.error('Error leyendo whatsapp_messages.json:', error);
    return [];
  }
}

export function saveStoredMessages(messages: WhatsAppMessage[]): boolean {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error escribiendo whatsapp_messages.json:', error);
    return false;
  }
}

export function addStoredMessage(message: WhatsAppMessage): { success: boolean; isDuplicate: boolean } {
  try {
    ensureDataFile();
    const messages = getStoredMessages();
    
    // Evitar guardar duplicados basados en el id único enviado
    const exists = messages.some(m => m.id === message.id);
    if (exists) {
      return { success: true, isDuplicate: true };
    }

    messages.push(message);
    const success = saveStoredMessages(messages);
    return { success, isDuplicate: false };
  } catch (error) {
    console.error('Error agregando mensaje:', error);
    return { success: false, isDuplicate: false };
  }
}

export function clearStoredMessages(): boolean {
  return saveStoredMessages([]);
}
