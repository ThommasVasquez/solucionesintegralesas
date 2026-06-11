'use client';
import { useEffect, useState } from 'react';

type Message = {
  id: string;
  brandId: string;
  chatId: string;
  sender: string;
  content: string;
  direction: string;
  timestamp: string;
};

export default function WhatsAppDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [brandFilter, setBrandFilter] = useState('');

  async function fetchMessages() {
    const url = `/api/whatsapp/messages?limit=100${brandFilter ? `&brandId=${brandFilter}` : ''}`;
    const res  = await fetch(url);
    const json = await res.json();
    if (json.success) setMessages(json.data);
  }

  // Polling cada 5 segundos
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [brandFilter]);

  const brands = [...new Set(messages.map(m => m.brandId))];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <style dangerouslySetInnerHTML={{ __html: `
        .p-6 { padding: 1.5rem; }
        .max-w-4xl { max-width: 56rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .font-bold { font-weight: 700; }
        .mb-4 { margin-bottom: 1rem; }
        .flex { display: flex; }
        .gap-2 { gap: 0.5rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .flex-wrap { flex-wrap: wrap; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .rounded-full { border-radius: 9999px; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .border { border: 1px solid #e5e7eb; }
        .bg-black { background-color: #000; color: #fff; }
        .text-white { color: #fff; }
        .bg-white { background-color: #fff; }
        .space-y-3 > * + * { margin-top: 0.75rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .p-4 { padding: 1rem; }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .mb-1 { margin-bottom: 0.25rem; }
        .font-semibold { font-weight: 600; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .py-0.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
        .bg-green-100 { background-color: #d1fae5; }
        .text-green-700 { color: #047857; }
        .bg-blue-100 { background-color: #dbeafe; }
        .text-blue-700 { color: #1d4ed8; }
        .text-gray-700 { color: #374151; }
        .text-gray-400 { color: #9ca3af; }
        .mt-1 { margin-top: 0.25rem; }
        .text-center { text-align: center; }
        .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
        button { cursor: pointer; transition: all 0.2s ease; }
        button:hover { opacity: 0.8; }
      `}} />

      <h1 className="text-2xl font-bold mb-4">📲 Mensajes WhatsApp en tiempo real</h1>

      {/* Filtro por marca */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setBrandFilter('')}
          className={`px-3 py-1 rounded-full text-sm border ${!brandFilter ? 'bg-black text-white' : 'bg-white'}`}
        >
          Todas
        </button>
        {brands.map(b => (
          <button
            key={b}
            onClick={() => setBrandFilter(b)}
            className={`px-3 py-1 rounded-full text-sm border ${brandFilter === b ? 'bg-black text-white' : 'bg-white'}`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Lista de mensajes */}
      <div className="space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">{msg.sender}</span>
              <div className="flex gap-2 items-center">
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{msg.brandId}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${msg.direction === 'INBOUND' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {msg.direction}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-700">{msg.content}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(msg.timestamp).toLocaleString('es-CO')} · {msg.chatId}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-400 py-12">Sin mensajes aún. Esperando...</p>
        )}
      </div>
    </div>
  );
}
