export interface WhatsAppMessage {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp: string; // ISO String
  direction: 'INBOUND' | 'OUTBOUND';
}

// Almacenamiento en memoria global (compatible con entornos Edge y Cloudflare Workers)
const globalForWhatsApp = globalThis as unknown as {
  whatsappMessages: WhatsAppMessage[];
};

if (!globalForWhatsApp.whatsappMessages) {
  globalForWhatsApp.whatsappMessages = [];
}

export function getStoredMessages(): WhatsAppMessage[] {
  return globalForWhatsApp.whatsappMessages;
}

export function saveStoredMessages(messages: WhatsAppMessage[]): boolean {
  globalForWhatsApp.whatsappMessages = messages;
  return true;
}

export function addStoredMessage(message: WhatsAppMessage): { success: boolean; isDuplicate: boolean } {
  const messages = getStoredMessages();
  
  // Evitar duplicados
  const exists = messages.some(m => m.id === message.id);
  if (exists) {
    return { success: true, isDuplicate: true };
  }

  messages.push(message);
  return { success: true, isDuplicate: false };
}

export function clearStoredMessages(): boolean {
  globalForWhatsApp.whatsappMessages = [];
  return true;
}
