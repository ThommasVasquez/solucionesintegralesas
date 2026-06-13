'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Upload, 
  Calendar, 
  MessageSquare, 
  Clock, 
  ArrowLeft, 
  Trash2, 
  User, 
  TrendingUp, 
  BarChart2, 
  Database,
  CheckCircle,
  FileText,
  Copy,
  Terminal,
  Activity,
  AlertCircle
} from 'lucide-react';
import { Link } from 'next-view-transitions';
import styles from './whatsapp.module.css';
import { logAction } from '@/lib/audit-client';

interface WhatsAppMessage {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp: string; // ISO String
  direction: 'INBOUND' | 'OUTBOUND';
  brandId?: string;
}


interface WhatsAppDashboardProps {
  userName: string;
  userEmail: string;
  brandId?: string;
}

const BRAND_INFO: Record<string, { name: string; logoUrl: string; emoji?: string }> = {
  viva_calentadores: {
    name: "Viva Calentadores",
    logoUrl: "/viva-calentadores-logo.jpg",
  },
  ingenova: {
    name: "Ingenova",
    logoUrl: "/ingenova-logo.jpg",
  },
  printer_service: {
    name: "PrinterService",
    logoUrl: "/printerservice-logo.png",
  },
  pro_mascotas: {
    name: "ProMascotas",
    logoUrl: "/promascotas-logo.png",
  }
};

const FALLBACK_BRAND = {
  name: "Soluciones AS",
  logoUrl: "/logo.png",
  emoji: "📲"
};

export default function WhatsAppDashboard({ userName, userEmail, brandId }: WhatsAppDashboardProps) {
  const isSuperUser = userEmail.toLowerCase() === 'thommyenergy@superuser.com';
  const currentBrand = (brandId && BRAND_INFO[brandId]) || FALLBACK_BRAND;

  // Estado de mensajes
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'active' | 'disconnected'>('disconnected');
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [activeAuditSlot, setActiveAuditSlot] = useState<'all' | 'slot1' | 'slot2' | 'slot3' | 'slot4'>('all');
  const [origin, setOrigin] = useState('http://localhost:3001');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Estados de filtros de fecha
  const [period, setPeriod] = useState<'today' | 'yesterday' | '7days' | '30days' | 'custom'>('30days');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Tooltip del gráfico
  const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number; text: string }>({
    show: false,
    x: 0,
    y: 0,
    text: '',
  });

  const tampermonkeyScript = `// ==UserScript==
// @name         WhatsApp Web Real-Time Tracker for Soluciones AS
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Envía mensajes entrantes y salientes de WhatsApp Web en tiempo real a la API local
// @match        https://web.whatsapp.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    if (window.asTrackerLoaded) {
        console.log('[AS WhatsApp Tracker] Ya hay un rastreador activo. Cancelando duplicado para evitar cruce de marcas.');
        return;
    }
    window.asTrackerLoaded = true;

    console.log('[AS WhatsApp Tracker] Script cargado. Iniciando monitoreo...');

    const API_URL = '${origin}/api/whatsapp/message';
    const sentMessageIds = new Set();
    window.asTrackerSentIds = sentMessageIds;
    if (!window.asTrackerSentUnread) {
        window.asTrackerSentUnread = new Set();
    }
    let currentChatName = null;

    const ACTIVE_BRAND = '${brandId || "printer_service"}';

    // Función para obtener el nombre del cliente del chat actual
    function getActiveChatName() {
        const header = document.querySelector('[data-testid="conversation-header"]') || 
                       document.querySelector('#main header') ||
                       document.querySelector('[data-testid="conversation-panel-wrapper"] header');
        if (!header) return null;
        
        const titleSpan = header.querySelector('[data-testid="conversation-info-details"] span[title]') ||
                          header.querySelector('span[title]') || 
                          header.querySelector('span[dir="auto"]') || 
                          header.querySelector('div[dir="auto"]');
        if (titleSpan) {
            const titleAttr = titleSpan.getAttribute('title');
            if (titleAttr && titleAttr.trim() !== '') return titleAttr.trim();
            const text = titleSpan.textContent;
            if (text && text.trim() !== '' && !text.includes('Comunidades') && !text.includes('Chats')) return text.trim();
        }
        return null;
    }

    // Función para parsear la fecha y hora de la celda de chat de WhatsApp Web
    function parseWhatsAppDate(dateStr) {
        try {
            if (!dateStr) return new Date().toISOString();
            const now = new Date();
            const str = dateStr.trim().toLowerCase();

            // 1. Formato de hora hoy (ej. "10:24", "10:24 a. m.", "10:24 pm", "10:24 p.m.")
            const timeMatch = str.match(/^(\\d{1,2})[.:](\\d{2})\\s*([ap]\\.?\\s*m\\.?)?$/i);
            if (timeMatch) {
                let hours = parseInt(timeMatch[1], 10);
                const minutes = parseInt(timeMatch[2], 10);
                const ampm = timeMatch[3];
                if (ampm) {
                    const ampmLower = ampm.replace(/\\s/g, '').replace(/\\./g, '');
                    if (ampmLower.includes('p') && hours < 12) {
                        hours += 12;
                    } else if (ampmLower.includes('a') && hours === 12) {
                        hours = 0;
                    }
                }
                const parsedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate.toISOString();
                }
            }

            // 2. Ayer / Yesterday
            if (str === 'ayer' || str === 'yesterday') {
                const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);
                yesterday.setHours(12, 0, 0, 0); // Hora por defecto a mitad del día
                return yesterday.toISOString();
            }

            // 3. Días de la semana
            const daysEn = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const daysEs = ['domingo', 'lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado'];
            
            let dayIndex = daysEn.indexOf(str);
            if (dayIndex === -1) {
                const esIndex = daysEs.indexOf(str);
                if (esIndex !== -1) {
                    if (esIndex === 0) dayIndex = 0;
                    else if (esIndex === 1) dayIndex = 1;
                    else if (esIndex === 2) dayIndex = 2;
                    else if (esIndex === 3 || esIndex === 4) dayIndex = 3;
                    else if (esIndex === 5) dayIndex = 4;
                    else if (esIndex === 6) dayIndex = 5;
                    else if (esIndex === 7 || esIndex === 8) dayIndex = 6;
                }
            }

            if (dayIndex !== -1) {
                const resultDate = new Date();
                const currentDay = now.getDay();
                let diff = currentDay - dayIndex;
                if (diff <= 0) {
                    diff += 7;
                }
                resultDate.setDate(now.getDate() - diff);
                resultDate.setHours(12, 0, 0, 0);
                return resultDate.toISOString();
            }

            // 4. Formatos de fecha DD/MM/AAAA, DD.MM.AA, etc.
            const dateMatch = str.match(/^(\\d{1,2})[\\/\\.\\-](\\d{1,2})[\\/\\.\\-](\\d{2,4})$/);
            if (dateMatch) {
                const val1 = parseInt(dateMatch[1], 10);
                const val2 = parseInt(dateMatch[2], 10);
                let year = parseInt(dateMatch[3], 10);
                if (year < 100) year += 2000;

                let day, month;
                if (val2 > 12) {
                    day = val2;
                    month = val1 - 1;
                } else {
                    day = val1;
                    month = val2 - 1;
                }
                const parsedDate = new Date(year, month, day, 12, 0, 0);
                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate.toISOString();
                }
            }
        } catch (e) {
            console.error('[AS Tracker] Error parsing date:', e);
        }
        return new Date().toISOString();
    }

    // Función para obtener el timestamp real del mensaje desde el DOM de WhatsApp
    function getMessageTimestamp(el) {
        try {
            const copyable = el.querySelector('[data-pre-plain-text]') || el.closest('[data-pre-plain-text]');
            if (copyable) {
                const preText = copyable.getAttribute('data-pre-plain-text');
                if (preText) {
                    const bracketMatch = preText.match(/^\\[(.*?)\\]/);
                    if (bracketMatch && bracketMatch[1]) {
                        const dateTimeStr = bracketMatch[1];
                        
                        const timeMatch = dateTimeStr.match(/(\\d{1,2}):(\\d{2})\\s*([ap]\\.?\\s*m\\.?)?/i);
                        const dateMatch = dateTimeStr.match(/(\\d{1,2})[\\/\\.\\-](\\d{1,2})[\\/\\.\\-](\\d{2,4})/);
                        
                        if (timeMatch && dateMatch) {
                            let hours = parseInt(timeMatch[1], 10);
                            const minutes = parseInt(timeMatch[2], 10);
                            const ampm = timeMatch[3];
                            
                            if (ampm) {
                                const ampmLower = ampm.toLowerCase().replace(/\\s/g, '').replace(/\\./g, '');
                                if (ampmLower.includes('p') && hours < 12) {
                                    hours += 12;
                                } else if (ampmLower.includes('a') && hours === 12) {
                                    hours = 0;
                                }
                            }
                            
                            const val1 = parseInt(dateMatch[1], 10);
                            const val2 = parseInt(dateMatch[2], 10);
                            let year = parseInt(dateMatch[3], 10);
                            if (year < 100) year += 2000;
                            
                            let day, month;
                            if (val2 > 12) {
                                day = val2;
                                month = val1 - 1;
                            } else {
                                day = val1;
                                month = val2 - 1;
                            }
                            
                            const parsedDate = new Date(year, month, day, hours, minutes);
                            if (!isNaN(parsedDate.getTime())) {
                                return parsedDate.toISOString();
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error('[AS Tracker] Error parseando timestamp del DOM:', e);
        }
        
        try {
            const timeEl = el.querySelector('[class*="time"], span[class*="time"]');
            if (timeEl && timeEl.textContent) {
                const timeStr = timeEl.textContent.trim();
                const timeMatch = timeStr.match(/(\\d{1,2}):(\\d{2})\\s*([ap]\\.?\\s*m\\.?)?/i);
                if (timeMatch) {
                    let hours = parseInt(timeMatch[1], 10);
                    const minutes = parseInt(timeMatch[2], 10);
                    const ampm = timeMatch[3];
                    if (ampm) {
                        const ampmLower = ampm.toLowerCase().replace(/\\s/g, '').replace(/\\./g, '');
                        if (ampmLower.includes('p') && hours < 12) {
                            hours += 12;
                        } else if (ampmLower.includes('a') && hours === 12) {
                            hours = 0;
                        }
                    }
                    const now = new Date();
                    const parsedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
                    if (!isNaN(parsedDate.getTime())) {
                        return parsedDate.toISOString();
                    }
                }
            }
        } catch (e) {
            console.error('[AS Tracker] Error de fallback para el tiempo:', e);
        }
        
        return new Date().toISOString();
    }

    // Escanear periódicamente la lista de chats en el sidebar para capturar chats entrantes en segundo plano
    function scanSidebarChats() {
        try {
            const chatCells = document.querySelectorAll('div[data-testid="cell-frame-container"], div[role="listitem"], [data-testid="chat-cell"], [class*="chat-cell"]');
            if (!chatCells || chatCells.length === 0) return;

            chatCells.forEach(cell => {
                // Obtener el nombre del contacto
                const titleEl = cell.querySelector('span[title]') || 
                                cell.querySelector('[data-testid="chat-title"] span') || 
                                cell.querySelector('div[dir="auto"]');
                if (!titleEl) return;
                
                const chatName = (titleEl.getAttribute('title') || titleEl.textContent || '').trim();
                if (!chatName || chatName === 'Yo' || chatName === 'Tú' || chatName.includes('grupo') || chatName.includes('Group') || chatName.includes('WhatsApp')) return;

                // 1. Encontrar el texto de fecha/hora en la celda
                let timeText = '';
                const divsAndSpans = cell.querySelectorAll('div, span');
                const daysOfWeek = ['lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado', 'domingo',
                                    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                
                for (let el of divsAndSpans) {
                    const txt = el.textContent ? el.textContent.trim() : '';
                    if (txt.match(/^\\d{1,2}[.:]\\d{2}\\s*(?:[ap]\\.?\\s*m\\.?)?$/i) || 
                        txt.toLowerCase() === 'ayer' || 
                        txt.toLowerCase() === 'yesterday' ||
                        daysOfWeek.includes(txt.toLowerCase()) ||
                        txt.match(/^\\d{1,2}[\\/\\.\\-]\\d{1,2}[\\/\\.\\-]\\d{2,4}$/)) {
                        timeText = txt;
                        break;
                    }
                }

                if (!timeText) return; // Si no hay indicación de tiempo válida, saltar

                // 2. Detectar si el último mensaje tiene insignia de no leído
                const unreadEl = cell.querySelector('[data-testid="unread-count"], span[aria-label*="unread"], span[aria-label*="leído"], span[class*="badge"], div[class*="unread"]');
                const hasUnreadBadge = !!unreadEl || !!cell.querySelector('span[class*="badge"]') || !!cell.querySelector('div[class*="badge"]') || !!cell.querySelector('[class*="unread"]');

                // 3. Determinar la dirección del último mensaje (si tiene checkmark, es OUTBOUND)
                const hasCheckmark = cell.querySelector('[data-testid="msg-status-check"], [data-testid="msg-status-doublecheck"], [data-icon*="check"], [class*="status-check"]');
                
                // Si tiene badge de no leído, definitivamente el cliente nos escribió y no hemos leído
                const direction = hasUnreadBadge ? 'INBOUND' : (hasCheckmark ? 'OUTBOUND' : 'INBOUND');

                const chatId = chatName.toLowerCase().replace(/\\s+/g, '_');
                const cleanTimeText = timeText.toLowerCase().replace(/[^a-z0-9]/g, '');
                
                // ID único determinista para el estado del chat en este momento exacto
                const msgId = \`sb_\${chatId}_\${direction}_\${cleanTimeText}\`;

                if (!sentMessageIds.has(msgId)) {
                    const parsedTimestamp = parseWhatsAppDate(timeText);
                    const payload = {
                        id: msgId,
                        brandId: ACTIVE_BRAND,
                        chatId: chatId,
                        sender: chatName,
                        content: hasUnreadBadge 
                            ? \`[Contacto entrante en sidebar - sin leer]\` 
                            : \`[Contacto detectado en sidebar - último: \${timeText}]\`,
                        timestamp: parsedTimestamp,
                        direction: direction
                    };

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: API_URL,
                        headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify(payload),
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.success) {
                                    sentMessageIds.add(msgId);
                                    console.log(\`[AS Tracker] Sidebar chat registrado: \${chatName} (\${direction}) a las \${timeText}\`);
                                }
                            } catch(e) {
                                console.error('[AS Tracker] Error parseando respuesta:', e);
                            }
                        },
                        onerror: function(err) {
                            console.error('[AS Tracker] Error en GM_xmlhttpRequest:', err);
                        }
                    });
                }
            });
        } catch (e) {
            console.error('[AS Tracker] Error escaneando sidebar:', e);
        }
    }

    // Procesar y enviar un mensaje
    function processMessage(el) {
        try {
            if (!el) return;
            
            // Obtener el ID único del mensaje en el DOM
            const msgId = el.getAttribute('data-id') || el.closest('[data-id]')?.getAttribute('data-id') || '';
            if (!msgId) return;

            // Filtrar mensajes de sistema (notificaciones de seguridad, cambios de grupo, etc.)
            const isSystemMsg = !!(el.querySelector('[data-testid="system_message"]') || 
                                   el.querySelector('[data-testid="msg-notification-container"]') ||
                                   el.querySelector('.msg-system'));
            if (isSystemMsg) return;

            // Verificar que tiene contenido real o multimedia
            const hasContent = !!(el.querySelector('[class*="copyable-text"]') || 
                                   el.querySelector('[class*="selectable-text"]') || 
                                   el.querySelector('img') || 
                                   el.querySelector('video') || 
                                   el.querySelector('[data-icon]') || 
                                   el.querySelector('[data-testid="msg-copyable-text"]') ||
                                   el.querySelector('[data-testid="msg-container"]'));
            if (!hasContent) return;

            if (sentMessageIds.has(msgId)) return;

            // Detectar dirección del mensaje usando el prefijo data-id (true_ = OUTBOUND / false_ = INBOUND)
            let isOutbound = false;
            if (msgId.startsWith('true_')) {
                isOutbound = true;
            } else if (msgId.startsWith('false_')) {
                isOutbound = false;
            } else {
                // Fallbacks si la estructura del ID cambia
                const isOutboundClass = !!(el.querySelector('.message-out') || el.classList.contains('message-out') || el.closest('.message-out'));
                const isOutboundTail = !!el.querySelector('[data-testid="tail-out"]');
                isOutbound = isOutboundClass || isOutboundTail;
            }
            const isInbound = !isOutbound;

            // Extraer el texto del mensaje
            const textContainer = el.querySelector('[class*="copyable-text"], [class*="selectable-text"]') || 
                                  el.querySelector('span.selectable-text') ||
                                  el.querySelector('[data-testid="msg-copyable-text"]');
            let content = '';
            
            if (textContainer) {
                const clone = textContainer.cloneNode(true);
                const timeEl = clone.querySelector('[class*="time"], span[class*="time"]');
                if (timeEl) timeEl.remove();
                content = clone.innerText || clone.textContent || '';
            } else {
                // Fallback: buscar texto en spans válidos
                const msgContainer = el.querySelector('[data-testid="msg-container"]') || el;
                if (msgContainer) {
                    const spans = Array.from(msgContainer.querySelectorAll('span'));
                    const textSpan = spans.find(s => {
                        const hasText = s.innerText && s.innerText.trim().length > 0;
                        const isTime = s.querySelector('[class*="time"]') || s.className.includes('time') || s.innerText.match(/^\\d{1,2}:\\d{2}\\s*(?:[ap]\\.?\\s*m\\.?)?$/i);
                        return hasText && !isTime;
                    });
                    if (textSpan) {
                        content = textSpan.innerText || textSpan.textContent || '';
                    }
                }
            }
            
            content = content.trim();

            // Detectar mensajes multimedia o de sistema
            if (!content) {
                if (el.querySelector('[data-icon*="audio"], [class*="audio"]')) {
                    content = '[Nota de voz / Audio]';
                } else if (el.querySelector('img[src^="blob:"], video, [class*="image"], [class*="video"]')) {
                    content = '[Imagen / Video]';
                } else if (el.querySelector('[data-icon*="document"], [class*="document"]')) {
                    content = '[Documento / Archivo]';
                } else if (el.querySelector('[class*="sticker"]')) {
                    content = '[Sticker]';
                } else {
                    content = '[Mensaje multimedia o sistema]';
                }
            }

            const chatName = getActiveChatName() || 'Cliente Desconocido';
            const sender = isOutbound ? 'Yo' : chatName;
            const direction = isInbound ? 'INBOUND' : 'OUTBOUND';

            const payload = {
                id: msgId,
                brandId: ACTIVE_BRAND,
                chatId: chatName.toLowerCase().replace(/\\s+/g, '_'),
                sender: sender,
                content: content,
                timestamp: getMessageTimestamp(el),
                direction: direction
            };

            // Enviar al API usando GM_xmlhttpRequest para saltarse CSP (Content Security Policy)
            GM_xmlhttpRequest({
                method: 'POST',
                url: API_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(payload),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            sentMessageIds.add(msgId);
                            console.log(\`[AS Tracker] Mensaje enviado: "\${content.substring(0, 20)}..." de \${sender}\`);
                        }
                    } catch(e) {
                        console.error('[AS Tracker] Error parseando respuesta de la API:', e);
                    }
                },
                onerror: function(err) {
                    console.error('[AS Tracker] Error en GM_xmlhttpRequest:', err);
                }
            });

        } catch (error) {
            console.error('[AS Tracker] Error al procesar mensaje:', error);
        }
    }

    // Comprobar si se ha cambiado de chat para capturar el historial
    function checkChatSwitch() {
        const activeChat = getActiveChatName();
        if (activeChat && activeChat !== currentChatName) {
            currentChatName = activeChat;
            console.log(\`[AS WhatsApp Tracker] Chat cambiado a: \${activeChat}. Procesando historial...\`);
            
            // Esperar un momento a que rendericen los mensajes en el DOM
            setTimeout(() => {
                const chatContainer = document.querySelector('#main') || 
                                      document.querySelector('[data-testid="conversation-panel-wrapper"]') ||
                                      document.querySelector('[role="application"]') ||
                                      document.body;
                const msgs = chatContainer.querySelectorAll('[data-id], [data-testid="msg-container"]');
                console.log(\`[AS WhatsApp Tracker] Procesando \${msgs.length} mensajes visibles actuales.\`);
                msgs.forEach(processMessage);
            }, 1200);
        }
    }

    // Configurar observador del DOM
    function initObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            checkChatSwitch(); // Verificar si cambió de chat
            
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;

                        // Si el nodo mismo es un mensaje
                        const isMessage = node.getAttribute('data-id') || 
                                          node.getAttribute('data-testid') === 'msg-container';
                        if (isMessage) {
                            processMessage(node);
                        } else {
                            // Si contiene mensajes adentro
                            const msgs = node.querySelectorAll('[data-id], [data-testid="msg-container"]');
                            msgs.forEach(processMessage);
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        console.log('[AS WhatsApp Tracker] MutationObserver activo. Escuchando chats...');
        
        // Iniciar escaneo periódico de chats en el sidebar cada 2 segundos
        setInterval(scanSidebarChats, 2000);
        
        // Primera ejecución al cargar
        checkChatSwitch();
    }

    // Esperar a que la app cargue completamente
    const checkInterval = setInterval(() => {
        const app = document.getElementById('app') || 
                    document.querySelector('.app-wrapper-web') || 
                    document.querySelector('[data-testid="app-wrapper"]') ||
                    document.querySelector('body');
        if (app) {
            clearInterval(checkInterval);
            setTimeout(initObserver, 5000);
        }
    }, 2000);

})();`;

  // Copiar script al portapapeles
  const handleCopyScript = () => {
    navigator.clipboard.writeText(tampermonkeyScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
    logAction({
      userEmail,
      userName,
      action: 'COPY_WHATSAPP_SCRIPT',
      resource: 'WhatsApp',
      details: { message: 'Copió el script de Tampermonkey para WhatsApp Web' }
    });
  };



  // Función para obtener mensajes de la API
  const fetchMessagesFromAPI = async () => {
    try {
      const url = `/api/whatsapp/messages?limit=5000${brandId ? `&brandId=${brandId}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const apiMessages = data.messages || [];
        setMessages(apiMessages);
        
        // Determinar estado de conexión
        if (apiMessages.length > 0) {
          const sorted = [...apiMessages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          const latest = new Date(sorted[0].timestamp);
          setLastMessageTime(latest);
          
          const secondsDiff = (new Date().getTime() - latest.getTime()) / 1000;
          if (secondsDiff < 15) {
            setConnectionStatus('active');
          } else {
            setConnectionStatus('connected');
          }
        } else {
          setConnectionStatus('connected');
        }
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (e) {
      console.error('Error haciendo polling de mensajes:', e);
      setConnectionStatus('disconnected');
    }
  };

  // Polling cada 3 segundos
  useEffect(() => {
    setIsClient(true);
    fetchMessagesFromAPI(); // Primera consulta
    
    const interval = setInterval(fetchMessagesFromAPI, 3000);
    return () => clearInterval(interval);
  }, [brandId]);

  // Función para vaciar los mensajes
  const handleClearData = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente todas las estadísticas en vivo de WhatsApp?')) {
      try {
        const url = `/api/whatsapp/messages${brandId ? `?brandId=${brandId}` : ''}`;
        const res = await fetch(url, { method: 'DELETE' });
        if (res.ok) {
          setMessages([]);
          setLastMessageTime(null);
          setConnectionStatus('connected');
          alert('Historial de WhatsApp borrado del disco.');
          logAction({
            userEmail,
            userName,
            action: 'CLEAR_WHATSAPP_DATA',
            resource: 'WhatsApp',
            details: { message: 'Vació las estadísticas de mensajes de WhatsApp del servidor' }
          });
        } else {
          alert('No se pudo borrar el historial del disco.');
        }
      } catch (e) {
        alert('Error al conectar con la API.');
      }
    }
  };

  // Generar datos demo (guardando a la API para persistencia en disco)
  const handleGenerateDemoData = async () => {
    const demoMessages: WhatsAppMessage[] = [];
    const now = new Date();
    const customers = ['Juan Pérez', 'María Gómez', 'Carlos Ruiz', 'Clínica Sabana', 'Estación Chía', 'Diana Torres'];
    const agent = 'Yo'; // El agente por defecto en tiempo real es 'Yo'

    // Textos de demo dinámicos por marca
    let clientText = 'Hola, buenas tardes, solicito mantenimiento de zonas húmedas.';
    let agentText = 'Hola! Claro que sí, con gusto te agendamos con Ingenova. ¿Sería preventivo o correctivo?';

    if (brandId === 'viva_calentadores') {
      clientText = 'Hola, buenas tardes, solicito revisión técnica para mi calentador de agua.';
      agentText = 'Hola! Claro que sí, con gusto te agendamos con Viva Calentadores. ¿El calentador es a gas o eléctrico?';
    } else if (brandId === 'pro_mascotas') {
      clientText = 'Hola, buenas tardes, solicito una cita de profilaxis dental para mi perrito.';
      agentText = 'Hola! Claro que sí, con gusto te agendamos con ProMascotas. ¿Qué edad tiene tu perrito?';
    } else if (brandId === 'printer_service') {
      clientText = 'Hola, buenas tardes, solicito servicio de mantenimiento para una multifuncional Kyocera.';
      agentText = 'Hola! Claro que sí, con gusto te agendamos con Printer Service. ¿Presenta algún código de error en la pantalla?';
    }

    for (let d = 30; d >= 0; d--) {
      const currentDate = new Date(now);
      currentDate.setDate(now.getDate() - d);
      
      const dailyChatsCount = Math.floor(Math.random() * 4) + 1;

      for (let c = 0; c < dailyChatsCount; c++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const chatId = customer.toLowerCase().replace(/\s+/g, '_');
        
        const startHour = Math.floor(Math.random() * 24); // 0 a 23
        const startMinute = Math.floor(Math.random() * 60);
        
        const chatStartTime = new Date(currentDate);
        chatStartTime.setHours(startHour, startMinute, 0, 0);

        const customerMsgTime1 = new Date(chatStartTime);
        demoMessages.push({
          id: `demo-${d}-${c}-in-1-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          chatId,
          sender: customer,
          content: clientText,
          timestamp: customerMsgTime1.toISOString(),
          direction: 'INBOUND',
          brandId: brandId,
        });

        const agentResponseTime = new Date(customerMsgTime1);
        const responseDelay = Math.floor(Math.random() * 25) + 2; // de 2 a 27 min
        agentResponseTime.setMinutes(customerMsgTime1.getMinutes() + responseDelay);
        
        demoMessages.push({
          id: `demo-${d}-${c}-out-1-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          chatId,
          sender: agent,
          content: agentText,
          timestamp: agentResponseTime.toISOString(),
          direction: 'OUTBOUND',
          brandId: brandId,
        });
      }
    }


    // Subir cada uno a la API
    try {
      let uploadCount = 0;
      for (const msg of demoMessages) {
        const res = await fetch('/api/whatsapp/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg)
        });
        if (res.ok) uploadCount++;
      }
      fetchMessagesFromAPI();
      alert(`¡Se han cargado con éxito ${uploadCount} mensajes demo en la base de datos!`);
      logAction({
        userEmail,
        userName,
        action: 'GENERATE_DEMO_DATA',
        resource: 'WhatsApp',
        details: { message: 'Generó datos demo para simulación de WhatsApp' }
      });
    } catch (e) {
      alert('Error cargando los mensajes demo.');
    }
  };

  // Filtrado de mensajes según fechas
  const filteredMessages = useMemo(() => {
    if (!isClient) return [];

    let start = new Date();
    let end = new Date();
    
    if (period === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (period === 'yesterday') {
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
    } else if (period === '7days') {
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else if (period === '30days') {
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    } else if (period === 'custom' && customStartDate && customEndDate) {
      start = new Date(customStartDate + 'T00:00:00');
      end = new Date(customEndDate + 'T23:59:59');
    } else {
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    }

    const startMs = start.getTime();
    const endMs = end.getTime();

    return messages.filter(msg => {
      const msgMs = new Date(msg.timestamp).getTime();
      const matchesStart = msgMs >= startMs;
      const matchesEnd = (period === 'yesterday' || period === 'custom') ? msgMs <= endMs : true;
      return matchesStart && matchesEnd;
    });
  }, [messages, period, customStartDate, customEndDate, isClient]);

  // Estadísticas calculadas
  // Helper to format timestamps for client lists
  const formatMsgDate = (timestamp: string) => {
    const dateObj = new Date(timestamp);
    const today = new Date();
    const isToday = dateObj.getDate() === today.getDate() &&
                    dateObj.getMonth() === today.getMonth() &&
                    dateObj.getFullYear() === today.getFullYear();
    const timeStr = dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (isToday) {
      return timeStr;
    } else {
      const dateStr = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
      return `${dateStr} ${timeStr}`;
    }
  };

  // Estadísticas calculadas
  const stats = useMemo(() => {
    interface SlotChat {
      sender: string;
      lastTime: string;
      inboundCount: number;
      outboundCount: number;
      msgCount: number;
      chatId: string;
      timestampMs: number;
    }

    if (filteredMessages.length === 0) {
      return {
        totalReceived: 0,
        totalAnswered: 0,
        uniqueClientsCount: 0,
        slots: {
          all: { id: 'all' as const, label: 'Todos los Turnos', range: 'Resumen Completo', active: true, count: 0, msgCount: 0, chats: [] as SlotChat[] },
          slot1: { id: 'slot1' as const, label: 'Tiempo Muerto Mañana', range: '12:00 AM - 8:00 AM', active: false, count: 0, msgCount: 0, chats: [] as SlotChat[] },
          slot2: { id: 'slot2' as const, label: 'Agente Diurno', range: '8:00 AM - 2:00 PM', active: true, count: 0, msgCount: 0, chats: [] as SlotChat[] },
          slot3: { id: 'slot3' as const, label: 'Agente de la Tarde', range: '2:00 PM - 8:00 PM', active: true, count: 0, msgCount: 0, chats: [] as SlotChat[] },
          slot4: { id: 'slot4' as const, label: 'Tiempo Muerto Noche', range: '8:00 PM - 11:59 PM', active: false, count: 0, msgCount: 0, chats: [] as SlotChat[] }
        }
      };
    }

    let inboundCount = 0;
    let outboundCount = 0;
    
    filteredMessages.forEach(m => {
      if (m.direction === 'INBOUND') inboundCount++;
      else outboundCount++;
    });

    const slot1Chats: Record<string, SlotChat> = {};
    const slot2Chats: Record<string, SlotChat> = {};
    const slot3Chats: Record<string, SlotChat> = {};
    const slot4Chats: Record<string, SlotChat> = {};

    filteredMessages.forEach(m => {
      // Contamos cualquier chat con actividad del cliente (en base de datos el sender es 'Cliente')
      if (m.sender !== 'Yo') {
        const dateObj = new Date(m.timestamp);
        const hour = dateObj.getHours();
        const timestampMs = dateObj.getTime();
        const formattedTime = formatMsgDate(m.timestamp);
        
        let targetSlot: Record<string, SlotChat>;
        if (hour >= 0 && hour < 8) {
          targetSlot = slot1Chats;
        } else if (hour >= 8 && hour < 14) {
          targetSlot = slot2Chats;
        } else if (hour >= 14 && hour < 20) {
          targetSlot = slot3Chats;
        } else {
          targetSlot = slot4Chats;
        }

        if (!targetSlot[m.chatId]) {
          targetSlot[m.chatId] = { 
            sender: m.sender || m.chatId, 
            lastTime: formattedTime, 
            inboundCount: 0, 
            outboundCount: 0, 
            msgCount: 0, 
            timestampMs, 
            chatId: m.chatId 
          };
        }
        
        targetSlot[m.chatId].msgCount++;
        if (m.direction === 'INBOUND') {
          targetSlot[m.chatId].inboundCount++;
        } else {
          targetSlot[m.chatId].outboundCount++;
        }

        if (timestampMs > targetSlot[m.chatId].timestampMs) {
          targetSlot[m.chatId].lastTime = formattedTime;
          targetSlot[m.chatId].timestampMs = timestampMs;
        }
      }
    });

    const sortChats = (chatsMap: Record<string, SlotChat>) => {
      return Object.values(chatsMap)
        .sort((a, b) => b.timestampMs - a.timestampMs)
        .map(({ timestampMs, ...rest }) => rest);
    };

    const uniqueClientsCount = new Set(
      filteredMessages
        .filter(m => m.sender !== 'Yo')
        .map(m => m.chatId)
    ).size;

    return {
      totalReceived: inboundCount,
      totalAnswered: outboundCount,
      uniqueClientsCount,
      slots: {
        all: {
          id: 'all' as const,
          label: 'Todos los Turnos',
          range: 'Resumen Completo',
          active: true,
          count: uniqueClientsCount,
          msgCount: inboundCount,
          chats: [
            ...Object.values(slot1Chats),
            ...Object.values(slot2Chats),
            ...Object.values(slot3Chats),
            ...Object.values(slot4Chats)
          ].reduce((acc, chat) => {
            const existing = acc.find(c => c.chatId === chat.chatId);
            if (existing) {
              existing.msgCount += chat.msgCount;
              existing.inboundCount += chat.inboundCount;
              existing.outboundCount += chat.outboundCount;
              if (chat.timestampMs > existing.timestampMs) {
                existing.lastTime = chat.lastTime;
                existing.timestampMs = chat.timestampMs;
              }
            } else {
              acc.push({ ...chat });
            }
            return acc;
          }, [] as SlotChat[])
          .sort((a, b) => b.timestampMs - a.timestampMs)
          .map(({ timestampMs, ...rest }) => rest)
        },
        slot1: {
          id: 'slot1' as const,
          label: 'Tiempo Muerto Mañana',
          range: '12:00 AM - 8:00 AM',
          active: false,
          count: Object.keys(slot1Chats).length,
          msgCount: Object.values(slot1Chats).reduce((sum, c) => sum + c.inboundCount, 0),
          chats: sortChats(slot1Chats)
        },
        slot2: {
          id: 'slot2' as const,
          label: 'Agente Diurno',
          range: '8:00 AM - 2:00 PM',
          active: true,
          count: Object.keys(slot2Chats).length,
          msgCount: Object.values(slot2Chats).reduce((sum, c) => sum + c.inboundCount, 0),
          chats: sortChats(slot2Chats)
        },
        slot3: {
          id: 'slot3' as const,
          label: 'Agente de la Tarde',
          range: '2:00 PM - 8:00 PM',
          active: true,
          count: Object.keys(slot3Chats).length,
          msgCount: Object.values(slot3Chats).reduce((sum, c) => sum + c.inboundCount, 0),
          chats: sortChats(slot3Chats)
        },
        slot4: {
          id: 'slot4' as const,
          label: 'Tiempo Muerto Noche',
          range: '8:00 PM - 11:59 PM',
          active: false,
          count: Object.keys(slot4Chats).length,
          msgCount: Object.values(slot4Chats).reduce((sum, c) => sum + c.inboundCount, 0),
          chats: sortChats(slot4Chats)
        }
      }
    };
  }, [filteredMessages]);

  const formatResponseTime = (mins: number | null) => {
    if (mins === null || isNaN(mins)) return 'N/A';
    if (mins === 0) return '< 1 min';
    if (mins < 1) {
      const secs = Math.round(mins * 60);
      return `${secs} seg`;
    }
    if (mins < 60) return `${Math.round(mins)} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = Math.round(mins % 60);
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  // SVGs para gráficos
  const renderSlotsChart = () => {
    const totalClients = stats.slots.slot1.count + stats.slots.slot2.count + stats.slots.slot3.count + stats.slots.slot4.count;
    const getPercent = (count: number) => {
      if (totalClients === 0) return 0;
      return Math.round((count / totalClients) * 100);
    };

    const slotsList = [stats.slots.slot1, stats.slots.slot2, stats.slots.slot3, stats.slots.slot4];

    return (
      <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '4px' }}>
          <BarChart2 size={18} style={{ color: '#25d366', marginRight: '8px', verticalAlign: 'middle' }} />
          Distribución de Clientes por Franjas Horarias
        </h3>
        <p className={styles.chartSubtext}>
          Proporción de clientes únicos que enviaron mensajes en cada franja horaria. Total acumulado de contactos: <strong>{totalClients}</strong>.
        </p>
        <div className={styles.slotsChartContainer}>
          {slotsList.map((slot) => {
            const percent = getPercent(slot.count);
            const barColor = slot.id === 'slot1' ? '#64748b' : slot.id === 'slot2' ? '#3b82f6' : slot.id === 'slot3' ? '#f59e0b' : '#475569';
            
            return (
              <div key={slot.id} className={styles.slotChartRow}>
                <div className={styles.slotChartInfo}>
                  <span className={styles.slotChartLabel}>{slot.label}</span>
                  <span className={styles.slotChartRange}>{slot.range}</span>
                </div>
                
                <div className={styles.slotChartBarBg}>
                  <div 
                    className={styles.slotChartBarFill} 
                    style={{ 
                      width: `${percent}%`, 
                      backgroundColor: barColor 
                    }} 
                  />
                </div>
                
                <div className={styles.slotChartValue}>
                  <span className={styles.slotChartCount}>{slot.count} {slot.count === 1 ? 'cliente' : 'clientes'}</span>
                  <span className={styles.slotChartPercent}>{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSlotsAudit = () => {
    const selectedSlot = stats.slots[activeAuditSlot];
    
    return (
      <div className={styles.auditCard} style={{ marginTop: '20px', gridColumn: '1 / -1' }}>
        <div className={styles.auditHeader}>
          <div className={styles.auditTitle}>
            <User size={18} style={{ color: activeAuditSlot === 'all' ? '#25d366' : activeAuditSlot === 'slot1' ? '#64748b' : activeAuditSlot === 'slot2' ? '#3b82f6' : activeAuditSlot === 'slot3' ? '#f59e0b' : '#475569', marginRight: '8px' }} />
            <h3>Auditoría de Chats: {selectedSlot.label} ({selectedSlot.range})</h3>
          </div>
          <span className={`${styles.auditBadge} ${selectedSlot.id === 'all' ? styles.badgeActive : selectedSlot.active ? styles.badgeActive : styles.badgeDead}`}>
            {selectedSlot.id === 'all' ? '📊 Resumen General del Periodo' : selectedSlot.active ? '🟢 Agente Activo en Turno' : '🔴 Tiempo Muerto (Sin Agente)'}
          </span>
        </div>
        
        <div className={styles.auditTableContainer}>
          {selectedSlot.chats.length === 0 ? (
            <div className={styles.noAuditData}>
              No se registraron mensajes entrantes de clientes en esta franja horaria durante el periodo seleccionado.
            </div>
          ) : (
            <table className={styles.auditTable}>
              <thead>
                <tr>
                  <th>Cliente (Nombre / Número)</th>
                  <th>ID del Chat</th>
                  <th>Mensajes</th>
                  <th>Última Actividad</th>
                </tr>
              </thead>
              <tbody>
                {selectedSlot.chats.map((chat) => (
                  <tr key={chat.chatId}>
                    <td className={styles.auditClientName}>
                      <User size={14} className={styles.clientIcon} />
                      {chat.sender}
                    </td>
                    <td className={styles.auditChatId}>{chat.chatId}</td>
                    <td className={styles.auditMsgCount}>
                      {chat.msgCount} ({chat.inboundCount} Recibidos / {chat.outboundCount} Enviados)
                    </td>
                    <td className={styles.auditTime}>{chat.lastTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  if (!isClient) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Cargando panel...</div>;
  }

  return (
    <div className={styles.panel}>
      
      {/* Tooltip flotante */}
      {tooltip.show && (
        <div 
          className={styles.tooltip} 
          style={{ 
            display: 'block', 
            left: `${tooltip.x}px`, 
            top: `${tooltip.y}px`,
            position: 'fixed'
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Cabecera del Panel */}
      <div className={styles.header}>
        <div className={styles.welcome}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', color: 'var(--text-muted)' }} prefetch={false}>
              <ArrowLeft size={20} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {currentBrand.logoUrl && (
                <img 
                  src={currentBrand.logoUrl} 
                  alt={`${currentBrand.name} Logo`} 
                  style={{ 
                    height: '48px', 
                    width: 'auto', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    objectFit: 'contain',
                    backgroundColor: '#fff',
                    padding: '2px'
                  }} 
                />
              )}
              <div>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.8rem', margin: 0 }}>
                  {currentBrand.emoji && <span>{currentBrand.emoji}</span>}
                  {currentBrand.name}
                </h1>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Reportes de WhatsApp en Tiempo Real
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          {/* Conexión Status Indicator */}
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '6px 12px', 
              borderRadius: '999px', 
              fontSize: '0.8rem',
              fontWeight: 500,
              backgroundColor: connectionStatus === 'active' ? 'rgba(37, 211, 102, 0.1)' : connectionStatus === 'connected' ? 'rgba(26, 93, 145, 0.1)' : 'rgba(255, 77, 77, 0.1)',
              color: connectionStatus === 'active' ? '#25d366' : connectionStatus === 'connected' ? '#1a5d91' : '#ff4d4d',
              border: `1px solid ${connectionStatus === 'active' ? '#25d36630' : connectionStatus === 'connected' ? '#1a5d9130' : '#ff4d4d30'}`
            }}
          >
            <Activity size={12} className={connectionStatus === 'active' ? 'animate-pulse' : ''} />
            {connectionStatus === 'active' ? '🟢 Activo en vivo' : connectionStatus === 'connected' ? '🔵 Esperando chats...' : '🔴 Desconectado'}
          </div>

          {isSuperUser && (
            <>
              <button 
                onClick={() => setShowScriptModal(!showScriptModal)} 
                className={styles.btnSuccess}
              >
                <Terminal size={16} />
                Conectar WhatsApp Web
              </button>

              <button 
                onClick={handleGenerateDemoData} 
                className={styles.btnSecundario}
              >
                <Database size={16} />
                Generar Demo
              </button>
              
              {messages.length > 0 && (
                <button onClick={handleClearData} className={styles.btnDanger}>
                  <Trash2 size={16} />
                  Limpiar
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal/Sección del script de Tampermonkey */}
      {showScriptModal && isSuperUser && (
        <div 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.03)', 
            border: '2px solid #25d366', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '24px' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={20} style={{ color: '#25d366' }} />
              Instrucciones para Conexión en Tiempo Real (Chrome)
            </h3>
            <button 
              onClick={handleCopyScript} 
              className={styles.btnSecundario}
              style={{ backgroundColor: 'white' }}
            >
              {copiedScript ? <CheckCircle size={16} style={{ color: '#25d366' }} /> : <Copy size={16} />}
              {copiedScript ? 'Copiado' : 'Copiar Script'}
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
              <ol style={{ paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Instala la extensión **Tampermonkey** o **Violentmonkey** desde la Chrome Web Store.</li>
                <li style={{ marginBottom: '8px' }}>Haz clic en el icono de la extensión y selecciona **Crear un nuevo script**.</li>
                <li style={{ marginBottom: '8px' }}>Borra el código inicial por defecto, pega el script que copiaste con el botón de arriba y presiona **Guardar (Ctrl+S / Cmd+S)**.</li>
                <li style={{ marginBottom: '8px' }}>Abre **WhatsApp Web** (`web.whatsapp.com`) en tu navegador Chrome.</li>
                <li style={{ marginBottom: '8px' }}>¡Listo! El script detectará cuando envíes/recibas mensajes y los mandará a esta web. Verás cambiar el estado a **🟢 Activo en vivo** arriba.</li>
              </ol>
            </div>
            <div>
              <textarea 
                readOnly 
                value={tampermonkeyScript}
                style={{ 
                  width: '100%', 
                  height: '130px', 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem', 
                  padding: '8px', 
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#f8f9fa',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      )}



      {/* Controles de Filtros */}
      <div className={styles.filtersRow}>
        <div className={styles.periodButtons}>
          {['today', 'yesterday', '7days', '30days', 'custom'].map((p) => (
            <button 
              key={p}
              className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
              onClick={() => setPeriod(p as any)}
            >
              {p === 'today' ? 'Hoy' : p === 'yesterday' ? 'Ayer' : p === '7days' ? 'Últimos 7 días' : p === '30days' ? 'Últimos 30 días' : 'Personalizado'}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <div className={styles.customRange}>
            <label>Desde:</label>
            <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className={styles.dateInput} />
            <label>Hasta:</label>
            <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className={styles.dateInput} />
          </div>
        )}
      </div>

      {/* Tarjetas KPI de Franjas Horarias */}
      <div className={styles.kpiGrid}>
        {(Object.values(stats.slots) as any[]).map((slot) => {
          const isSelected = activeAuditSlot === slot.id;
          const activeColor = slot.id === 'all' ? '#25d366' : slot.id === 'slot1' ? '#64748b' : slot.id === 'slot2' ? '#3b82f6' : slot.id === 'slot3' ? '#f59e0b' : '#475569';
          
          return (
            <div 
              key={slot.id} 
              className={`${styles.kpiCard} ${styles.kpiCardClickable} ${isSelected ? styles.kpiCardActive : ''}`}
              style={{
                '--kpi-active-color': activeColor,
                '--kpi-active-color-alpha': activeColor + '15',
                borderColor: isSelected ? activeColor : undefined
              } as any}
              onClick={() => setActiveAuditSlot(slot.id)}
            >
              <div 
                className={styles.kpiIcon} 
                style={{ 
                  backgroundColor: slot.id === 'all' ? 'rgba(37, 211, 102, 0.1)' : slot.active ? 'rgba(37, 211, 102, 0.1)' : 'rgba(148, 163, 184, 0.1)', 
                  color: slot.id === 'all' ? '#25d366' : slot.active ? '#25d366' : '#64748b' 
                }}
              >
                {slot.id === 'all' ? <MessageSquare /> : <Clock />}
              </div>
              <div className={styles.kpiInfo} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.kpiLabel} style={{ fontSize: '0.75rem' }}>{slot.label}</span>
                  <span 
                    style={{ 
                      fontSize: '9px', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: slot.id === 'all' ? 'rgba(37, 211, 102, 0.1)' : slot.active ? 'rgba(37, 211, 102, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      color: slot.id === 'all' ? '#25d366' : slot.active ? '#25d366' : '#64748b',
                      fontWeight: 600
                    }}
                  >
                    {slot.id === 'all' ? 'General' : slot.active ? 'Turno' : 'Cerrado'}
                  </span>
                </div>
                <span className={styles.kpiValue} style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                  {slot.count}
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>chats</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>
                    ({slot.msgCount} {slot.msgCount === 1 ? 'msj' : 'msjs'})
                  </span>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{slot.range}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos de Turnos y Tabla de Auditoría */}
      <div className={styles.chartsGrid}>
        {renderSlotsChart()}
        {renderSlotsAudit()}
      </div>

      {/* Estado vacío cuando no hay mensajes */}
      {messages.length === 0 && (
        <div className={styles.uploadZone} style={{ cursor: 'default', borderStyle: 'solid', padding: '60px 20px' }}>
          <Activity size={48} className={styles.uploadIcon} style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', margin: '0 auto 16px', color: '#25d366' }} />
          <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Esperando tráfico de WhatsApp en vivo...</h4>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            No hay estadísticas registradas todavía. Usa el botón <strong>"Conectar WhatsApp Web"</strong> para obtener las instrucciones de instalación del script en tu navegador Chrome. Una vez activo, el tráfico entrante y saliente se registrará y actualizará aquí de inmediato.
          </p>
        </div>
      )}
    </div>
  );
}
