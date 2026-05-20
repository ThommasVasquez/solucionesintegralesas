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

interface WhatsAppMessage {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp: string; // ISO String
  direction: 'INBOUND' | 'OUTBOUND';
}

interface WhatsAppDashboardProps {
  userName: string;
}

export default function WhatsAppDashboard({ userName }: WhatsAppDashboardProps) {
  // Estado de mensajes
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'active' | 'disconnected'>('disconnected');
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [origin, setOrigin] = useState('http://localhost:3001');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Estados del parser de archivos manual
  const [parsedRawMessages, setParsedRawMessages] = useState<{ sender: string; content: string; timestamp: string }[]>([]);
  const [uniqueSenders, setUniqueSenders] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [agentName, setAgentName] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Tampermonkey script code
  const tampermonkeyScript = `// ==UserScript==
// @name         WhatsApp Web Real-Time Tracker for Soluciones AS
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Envía mensajes entrantes y salientes en tiempo real a tu dashboard de producción/local
// @author       Antigravity AI
// @match        https://web.whatsapp.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log('[AS WhatsApp Tracker] Script cargado. Iniciando monitoreo...');

    const API_URL = '${origin}/api/whatsapp/message';
    const sentMessageIds = new Set();

    // Función para obtener el nombre del cliente del chat actual
    function getActiveChatName() {
        const header = document.querySelector('header');
        if (!header) return null;
        
        // Buscar elementos con título en el encabezado
        const titleEl = header.querySelector('[title]');
        if (titleEl) {
            const title = titleEl.getAttribute('title');
            if (title && title.trim() !== '') return title.trim();
        }
        
        // Selector alternativo basado en spans principales
        const spanEl = header.querySelector('span[dir="auto"], .copyable-text span');
        if (spanEl) {
            const title = spanEl.textContent;
            if (title && title.trim() !== '') return title.trim();
        }
        return null;
    }

    // Procesar y enviar un mensaje
    function processMessage(el) {
        try {
            // Obtener el ID único del mensaje en el DOM
            let msgId = el.getAttribute('data-id');
            if (!msgId) {
                // Generar un hash alternativo si no hay data-id
                const text = el.innerText || '';
                msgId = 'hash-' + text.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '') + '-' + Date.now();
            }

            if (sentMessageIds.has(msgId)) return;

            const isOutbound = el.classList.contains('message-out') || el.className.includes('message-out');
            const isInbound = el.classList.contains('message-in') || el.className.includes('message-in');

            if (!isOutbound && !isInbound) return;

            // Extraer el texto usando selectores más robustos con comodines de clase
            const textContainer = el.querySelector('[class*="copyable-text"] span, [class*="selectable-text"] span, span');
            if (!textContainer) return;

            let content = textContainer.innerText || textContainer.textContent || '';
            content = content.trim();

            if (!content) return;

            const chatName = getActiveChatName() || 'Cliente Desconocido';
            const sender = isOutbound ? 'Yo' : chatName;
            const direction = isInbound ? 'INBOUND' : 'OUTBOUND';

            const payload = {
                id: msgId,
                chatId: chatName.toLowerCase().replace(/\\s+/g, '_'),
                sender: sender,
                content: content,
                timestamp: new Date().toISOString(),
                direction: direction
            };

            // Enviar al API
            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    sentMessageIds.add(msgId);
                    console.log(\`[AS Tracker] Mensaje enviado: "\${content.substring(0, 20)}..." de \${sender}\`);
                }
            })
            .catch(err => {
                console.error('[AS Tracker] Error enviando mensaje al servidor local:', err);
            });

        } catch (error) {
            console.error('[AS Tracker] Error al procesar mensaje:', error);
        }
    }

    // Configurar observador del DOM
    function initObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;

                        if (node.className && (node.className.includes('message-in') || node.className.includes('message-out'))) {
                            processMessage(node);
                        } else {
                            const msgs = node.querySelectorAll('[class*="message-in"], [class*="message-out"]');
                            msgs.forEach(processMessage);
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        console.log('[AS WhatsApp Tracker] MutationObserver activo. Escuchando chats...');
    }

    // Esperar a que la app cargue completamente
    const checkInterval = setInterval(() => {
        const app = document.getElementById('app') || document.querySelector('.app-wrapper-web');
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
  };

  // Función para obtener mensajes de la API
  const fetchMessagesFromAPI = async () => {
    try {
      const res = await fetch('/api/whatsapp/messages');
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
  }, []);

  // Función para vaciar los mensajes
  const handleClearData = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente todas las estadísticas en vivo de WhatsApp?')) {
      try {
        const res = await fetch('/api/whatsapp/messages', { method: 'DELETE' });
        if (res.ok) {
          setMessages([]);
          setLastMessageTime(null);
          setConnectionStatus('connected');
          alert('Historial de WhatsApp borrado del disco.');
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

    for (let d = 30; d >= 0; d--) {
      const currentDate = new Date(now);
      currentDate.setDate(now.getDate() - d);
      
      const dailyChatsCount = Math.floor(Math.random() * 4) + 1;

      for (let c = 0; c < dailyChatsCount; c++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const chatId = customer.toLowerCase().replace(/\s+/g, '_');
        
        const startHour = Math.floor(Math.random() * 12) + 9; // 9:00 a 21:00
        const startMinute = Math.floor(Math.random() * 60);
        
        const chatStartTime = new Date(currentDate);
        chatStartTime.setHours(startHour, startMinute, 0, 0);

        const customerMsgTime1 = new Date(chatStartTime);
        demoMessages.push({
          id: `demo-${d}-${c}-in-1-${Date.now()}`,
          chatId,
          sender: customer,
          content: 'Hola, buenas tardes, solicito mantenimiento de zonas húmedas.',
          timestamp: customerMsgTime1.toISOString(),
          direction: 'INBOUND',
        });

        const agentResponseTime = new Date(customerMsgTime1);
        const responseDelay = Math.floor(Math.random() * 25) + 2; // de 2 a 27 min
        agentResponseTime.setMinutes(customerMsgTime1.getMinutes() + responseDelay);
        
        demoMessages.push({
          id: `demo-${d}-${c}-out-1-${Date.now()}`,
          chatId,
          sender: agent,
          content: `Hola! Claro que sí, con gusto te agendamos con Ingenova. ¿Sería preventivo o correctivo?`,
          timestamp: agentResponseTime.toISOString(),
          direction: 'OUTBOUND',
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
    } catch (e) {
      alert('Error cargando los mensajes demo.');
    }
  };

  // Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.txt')) {
      alert('Por favor, sube únicamente archivos de texto (.txt) exportados de WhatsApp.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      const tempRaw: { sender: string; content: string; timestamp: string }[] = [];
      const sendersSet = new Set<string>();
      let currentMsg: { sender: string; content: string; timestamp: string } | null = null;

      const androidRegex = /^(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*(?:AM|PM|am|pm)?\s*-\s*([^:]+):\s*(.*)$/i;
      const iosRegex = /^\[?(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*(?:AM|PM|am|pm)?\]?\s*([^:]+):\s*(.*)$/i;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        let match = line.match(androidRegex) || line.match(iosRegex);

        if (match) {
          if (currentMsg) {
            tempRaw.push(currentMsg);
          }

          const day = parseInt(match[1]);
          const month = parseInt(match[2]) - 1;
          let year = parseInt(match[3]);
          if (year < 100) year += 2000;
          
          const hourStr = match[4];
          const min = parseInt(match[5]);
          let hour = parseInt(hourStr);

          const lowerLine = line.toLowerCase();
          if (lowerLine.includes('pm') && hour < 12) hour += 12;
          if (lowerLine.includes('am') && hour === 12) hour = 0;

          const date = new Date(year, month, day, hour, min);
          
          let finalDate = date;
          if (isNaN(date.getTime())) {
            finalDate = new Date(year, day - 1, month + 1, hour, min);
          }
          if (isNaN(finalDate.getTime())) {
            finalDate = new Date();
          }

          const sender = match[6].trim();
          const content = match[7].trim();

          if (sender && content && !sender.includes('cambió') && !sender.includes('creó') && !sender.includes('eliminó') && !content.includes('cifradas de extremo a extremo')) {
            sendersSet.add(sender);
            currentMsg = {
              sender,
              content,
              timestamp: finalDate.toISOString()
            };
          } else {
            currentMsg = null;
          }
        } else {
          if (currentMsg) {
            currentMsg.content += ' ' + line;
          }
        }
      }

      if (currentMsg) {
        tempRaw.push(currentMsg);
      }

      if (tempRaw.length === 0) {
        alert('No se pudieron encontrar mensajes válidos en este archivo.');
        return;
      }

      const senders = Array.from(sendersSet);
      setParsedRawMessages(tempRaw);
      setUniqueSenders(senders);
      
      const counts: Record<string, number> = {};
      tempRaw.forEach(m => { counts[m.sender] = (counts[m.sender] || 0) + 1; });
      
      const sortedSenders = [...senders].sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
      
      const suspectedAgent = sortedSenders.find(s => s.toLowerCase() === 'yo' || s.toLowerCase() === 'me' || s.toLowerCase().includes('soporte') || s.toLowerCase().includes('as')) || sortedSenders[0] || '';
      const suspectedCustomer = sortedSenders.find(s => s !== suspectedAgent) || sortedSenders[1] || '';

      setAgentName(suspectedAgent);
      setCustomerName(suspectedCustomer);
      setIsImporting(true);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (!customerName || !agentName) {
      alert('Debes definir quién es el cliente y quién es el agente.');
      return;
    }

    const chatId = customerName.toLowerCase().replace(/\s+/g, '_');

    const formatted: WhatsAppMessage[] = parsedRawMessages.map((msg, index) => {
      let direction: 'INBOUND' | 'OUTBOUND' = 'INBOUND';
      if (msg.sender === agentName) {
        direction = 'OUTBOUND';
      }
      
      return {
        id: `import-${Date.now()}-${index}`,
        chatId,
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
        direction,
      };
    });

    try {
      let uploadCount = 0;
      for (const msg of formatted) {
        const res = await fetch('/api/whatsapp/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg)
        });
        if (res.ok) uploadCount++;
      }
      
      setParsedRawMessages([]);
      setUniqueSenders([]);
      setIsImporting(false);
      fetchMessagesFromAPI();
      alert(`¡Chat importado con éxito! Se cargaron ${uploadCount} mensajes al disco.`);
    } catch (e) {
      alert('Error importando los mensajes al servidor.');
    }
  };

  const handleCancelImport = () => {
    setParsedRawMessages([]);
    setUniqueSenders([]);
    setIsImporting(false);
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
      return msgMs >= startMs && msgMs <= endMs;
    });
  }, [messages, period, customStartDate, customEndDate, isClient]);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    if (filteredMessages.length === 0) {
      return {
        totalReceived: 0,
        totalAnswered: 0,
        responseRate: 0,
        avgResponseTime: 0,
        groupedByDay: [] as { dayLabel: string; inbound: number; outbound: number }[],
        groupedByHour: Array(24).fill(0) as number[],
        topCustomers: [] as { name: string; count: number }[],
        avgResponseTimeByDay: [] as { dayLabel: string; avgTime: number }[],
      };
    }

    let inboundCount = 0;
    let outboundCount = 0;
    
    filteredMessages.forEach(m => {
      if (m.direction === 'INBOUND') inboundCount++;
      else outboundCount++;
    });

    const dayGroups: Record<string, { inbound: number; outbound: number }> = {};
    const dayResponseTimes: Record<string, number[]> = {};

    filteredMessages.forEach(m => {
      const dateObj = new Date(m.timestamp);
      const dayLabel = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!dayGroups[dayLabel]) {
        dayGroups[dayLabel] = { inbound: 0, outbound: 0 };
      }
      
      if (m.direction === 'INBOUND') {
        dayGroups[dayLabel].inbound++;
      } else {
        dayGroups[dayLabel].outbound++;
      }
    });

    const chats: Record<string, WhatsAppMessage[]> = {};
    filteredMessages.forEach(m => {
      if (!chats[m.chatId]) chats[m.chatId] = [];
      chats[m.chatId].push(m);
    });

    const responseTimes: number[] = [];
    let totalCustomerBlocks = 0;
    let answeredCustomerBlocks = 0;

    Object.entries(chats).forEach(([chatId, chatMsgs]) => {
      const sorted = [...chatMsgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      let firstInboundMs: number | null = null;
      let dayLabelForInbound = '';

      sorted.forEach(m => {
        if (m.direction === 'INBOUND') {
          if (firstInboundMs === null) {
            firstInboundMs = new Date(m.timestamp).getTime();
            const dateObj = new Date(m.timestamp);
            dayLabelForInbound = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
            totalCustomerBlocks++;
          }
        } else {
          if (firstInboundMs !== null) {
            const outMs = new Date(m.timestamp).getTime();
            const diffMin = Math.max(0, Math.floor((outMs - firstInboundMs) / 60000));
            
            if (diffMin < 2880) {
              responseTimes.push(diffMin);
              answeredCustomerBlocks++;
              
              if (!dayResponseTimes[dayLabelForInbound]) {
                dayResponseTimes[dayLabelForInbound] = [];
              }
              dayResponseTimes[dayLabelForInbound].push(diffMin);
            }
            
            firstInboundMs = null;
          }
        }
      });
    });

    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length 
      : 0;

    const responseRate = totalCustomerBlocks > 0 
      ? Math.round((answeredCustomerBlocks / totalCustomerBlocks) * 100) 
      : 0;

    const sortedDays = Object.keys(dayGroups).sort((a, b) => {
      const [dayA, monthA] = a.split('/').map(Number);
      const [dayB, monthB] = b.split('/').map(Number);
      return (monthA * 32 + dayA) - (monthB * 32 + dayB);
    });

    const groupedByDay = sortedDays.map(day => ({
      dayLabel: day,
      inbound: dayGroups[day].inbound,
      outbound: dayGroups[day].outbound,
    }));

    const avgResponseTimeByDay = sortedDays.map(day => {
      const times = dayResponseTimes[day] || [];
      const avg = times.length > 0 ? Math.round(times.reduce((s, t) => s + t, 0) / times.length) : 0;
      return {
        dayLabel: day,
        avgTime: avg
      };
    });

    const groupedByHour = Array(24).fill(0);
    filteredMessages.forEach(m => {
      if (m.direction === 'INBOUND') {
        const hour = new Date(m.timestamp).getHours();
        groupedByHour[hour]++;
      }
    });

    const customerCounts: Record<string, number> = {};
    filteredMessages.forEach(m => {
      if (m.direction === 'INBOUND' && m.sender !== 'Yo') {
        customerCounts[m.sender] = (customerCounts[m.sender] || 0) + 1;
      }
    });

    const topCustomers = Object.entries(customerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalReceived: inboundCount,
      totalAnswered: outboundCount,
      responseRate,
      avgResponseTime,
      groupedByDay,
      groupedByHour,
      topCustomers,
      avgResponseTimeByDay,
    };
  }, [filteredMessages]);

  const formatResponseTime = (mins: number) => {
    if (mins === 0) return 'N/A';
    if (mins < 60) return `${Math.round(mins)} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = Math.round(mins % 60);
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  // SVGs para gráficos
  const renderVolumeChart = () => {
    const data = stats.groupedByDay;
    if (data.length === 0) {
      return (
        <div className={styles.emptyChart}>
          <BarChart2 size={40} strokeWidth={1} style={{ opacity: 0.5 }} />
          <p>No hay datos disponibles para este periodo.</p>
        </div>
      );
    }

    const width = 500;
    const height = 240;
    const paddingLeft = 40;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 30;

    const maxVal = Math.max(...data.map(d => Math.max(d.inbound, d.outbound)), 5);
    const yMax = Math.ceil(maxVal * 1.15);

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const barWidth = Math.max(4, Math.floor(chartWidth / data.length) - 8);
    const stepX = chartWidth / data.length;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const val = Math.round(yMax * ratio);
          return (
            <g key={idx}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} className={styles.chartGridLine} />
              <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className={styles.chartText}>{val}</text>
            </g>
          );
        })}

        <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} className={styles.chartAxis} />

        {data.map((d, idx) => {
          const x = paddingLeft + (idx * stepX) + (stepX - barWidth) / 2;
          const inboundHeight = (d.inbound / yMax) * chartHeight;
          const outboundHeight = (d.outbound / yMax) * chartHeight;

          const yIn = height - paddingBottom - inboundHeight;
          const yOut = height - paddingBottom - outboundHeight;

          const singleBarWidth = barWidth / 2 - 2;

          return (
            <g key={idx}>
              <rect 
                x={x} 
                y={yIn} 
                width={singleBarWidth} 
                height={inboundHeight} 
                rx={2} 
                className={styles.chartBarInbound}
                onMouseEnter={(e) => setTooltip({
                  show: true,
                  x: e.clientX,
                  y: e.clientY - 40,
                  text: `${d.dayLabel}: ${d.inbound} entrantes`
                })}
                onMouseLeave={() => setTooltip(p => ({ ...p, show: false }))}
              />
              <rect 
                x={x + singleBarWidth + 2} 
                y={yOut} 
                width={singleBarWidth} 
                height={outboundHeight} 
                rx={2} 
                className={styles.chartBarOutbound}
                onMouseEnter={(e) => setTooltip({
                  show: true,
                  x: e.clientX,
                  y: e.clientY - 40,
                  text: `${d.dayLabel}: ${d.outbound} contestados`
                })}
                onMouseLeave={() => setTooltip(p => ({ ...p, show: false }))}
              />
              
              {(data.length <= 15 || idx % Math.ceil(data.length / 10) === 0) && (
                <text x={x + barWidth / 2} y={height - paddingBottom + 16} textAnchor="middle" className={styles.chartText} style={{ fontSize: '9px' }}>
                  {d.dayLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderResponseTimeChart = () => {
    const data = stats.avgResponseTimeByDay.filter(d => d.avgTime > 0);
    if (data.length === 0) {
      return (
        <div className={styles.emptyChart}>
          <Clock size={40} strokeWidth={1} style={{ opacity: 0.5 }} />
          <p>No hay tiempos de respuesta registrados.</p>
        </div>
      );
    }

    const width = 500;
    const height = 240;
    const paddingLeft = 45;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 30;

    const maxVal = Math.max(...data.map(d => d.avgTime), 10);
    const yMax = Math.ceil(maxVal * 1.15);

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const stepX = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

    const points = data.map((d, idx) => {
      const x = paddingLeft + idx * stepX;
      const y = height - paddingBottom - (d.avgTime / yMax) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const val = Math.round(yMax * ratio);
          return (
            <g key={idx}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} className={styles.chartGridLine} />
              <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className={styles.chartText}>{val}m</text>
            </g>
          );
        })}

        <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} className={styles.chartAxis} />

        {data.length > 1 && (
          <polyline points={points} className={styles.chartLine} />
        )}

        {data.map((d, idx) => {
          const x = paddingLeft + idx * stepX;
          const y = height - paddingBottom - (d.avgTime / yMax) * chartHeight;

          return (
            <g key={idx}>
              <circle 
                cx={x} 
                cy={y} 
                r={4} 
                className={styles.chartDot}
                onMouseEnter={(e) => setTooltip({
                  show: true,
                  x: e.clientX,
                  y: e.clientY - 40,
                  text: `${d.dayLabel}: promedio de ${formatResponseTime(d.avgTime)}`
                })}
                onMouseLeave={() => setTooltip(p => ({ ...p, show: false }))}
              />
              
              {(data.length <= 12 || idx % Math.ceil(data.length / 8) === 0) && (
                <text x={x} y={height - paddingBottom + 16} textAnchor="middle" className={styles.chartText} style={{ fontSize: '9px' }}>
                  {d.dayLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderHourlyChart = () => {
    const data = stats.groupedByHour;
    const maxVal = Math.max(...data, 1);
    const yMax = Math.ceil(maxVal * 1.1);

    const width = 500;
    const height = 180;
    const paddingLeft = 30;
    const paddingRight = 10;
    const paddingTop = 15;
    const paddingBottom = 25;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const stepX = chartWidth / 24;
    const barWidth = Math.max(2, stepX - 4);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart}>
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const val = Math.round(yMax * ratio);
          return (
            <g key={idx}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} className={styles.chartGridLine} />
              <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className={styles.chartText}>{val}</text>
            </g>
          );
        })}

        {data.map((count, hour) => {
          const x = paddingLeft + hour * stepX + (stepX - barWidth) / 2;
          const barHeight = (count / yMax) * chartHeight;
          const y = height - paddingBottom - barHeight;

          return (
            <g key={hour}>
              <rect 
                x={x} 
                y={y} 
                width={barWidth} 
                height={barHeight} 
                rx={1} 
                fill="#25d366" 
                opacity={count > 0 ? 0.8 : 0.2}
                onMouseEnter={(e) => setTooltip({
                  show: true,
                  x: e.clientX,
                  y: e.clientY - 40,
                  text: `${hour.toString().padStart(2, '0')}:00 hs: ${count} mensajes`
                })}
                onMouseLeave={() => setTooltip(p => ({ ...p, show: false }))}
              />
              
              {hour % 4 === 0 && (
                <text x={x + barWidth / 2} y={height - paddingBottom + 14} textAnchor="middle" className={styles.chartText}>
                  {`${hour.toString().padStart(2, '0')}:00`}
                </text>
              )}
            </g>
          );
        })}
      </svg>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', color: 'var(--text-muted)' }}>
              <ArrowLeft size={20} />
            </Link>
            <h1>WhatsApp en Tiempo Real</h1>
          </div>
          <p>Métricas actualizadas automáticamente al chatear en WhatsApp Web.</p>
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
        </div>
      </div>

      {/* Modal/Sección del script de Tampermonkey */}
      {showScriptModal && (
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

      {/* Zona de Carga Manual */}
      {!isImporting && messages.length === 0 && (
        <div 
          className={`${styles.uploadZone} ${dragActive ? styles.uploadActive : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className={styles.hiddenInput} 
            accept=".txt" 
            onChange={handleFileChange}
          />
          <Upload className={styles.uploadIcon} />
          <h4>¿Tienes un historial guardado? Cárgalo aquí</h4>
          <p>Arrastra aquí tu archivo `.txt` exportado de WhatsApp o haz clic para importarlo de inmediato al disco.</p>
        </div>
      )}

      {/* Asistente de Importación */}
      {isImporting && (
        <div className={styles.importAssistant}>
          <h3>
            <FileText size={20} style={{ color: '#25d366' }} />
            Asistente de Importación de Chat
          </h3>
          <p>Hemos encontrado <strong>{parsedRawMessages.length}</strong> mensajes. Elige quién es el cliente y quién eres tú para clasificar la dirección:</p>
          
          <div className={styles.assistantGrid}>
            <div className={styles.senderSelectBox}>
              <label>Cliente (Mensajes Recibidos)</label>
              <select value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={styles.selectInput}>
                <option value="">Selecciona...</option>
                {uniqueSenders.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className={styles.senderSelectBox}>
              <label>Tú / Negocio (Mensajes Contestados)</label>
              <select value={agentName} onChange={(e) => setAgentName(e.target.value)} className={styles.selectInput}>
                <option value="">Selecciona...</option>
                {uniqueSenders.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.assistantActions}>
            <button onClick={handleCancelImport} className={styles.btnSecundario}>Cancelar</button>
            <button onClick={handleConfirmImport} className={styles.btnSuccess}>Confirmar e Importar</button>
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

      {/* Tarjetas KPI de Resumen */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: '#25d36615', color: '#25d366' }}>
            <MessageSquare />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Recibidos (Clientes)</span>
            <span className={styles.kpiValue}>{stats.totalReceived}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: '#1a5d9115', color: '#1a5d91' }}>
            <MessageSquare />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Contestados (Tú)</span>
            <span className={styles.kpiValue}>{stats.totalAnswered}</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: '#ff9f4315', color: '#ff9f43' }}>
            <TrendingUp />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Tasa de Respuesta</span>
            <span className={styles.kpiValue}>{stats.responseRate}%</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ backgroundColor: '#f1c40f15', color: '#f1c40f' }}>
            <Clock />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Tiempo de Respuesta</span>
            <span className={styles.kpiValue}>{formatResponseTime(stats.avgResponseTime)}</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>
            <BarChart2 size={18} style={{ color: '#25d366' }} />
            Mensajes por Día (Entrantes vs Contestados)
          </h3>
          <div className={styles.chartContainer}>
            {renderVolumeChart()}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#25d366', display: 'inline-block', borderRadius: '2px' }} />
              Clientes (Entrantes)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', backgroundColor: '#1a5d91', display: 'inline-block', borderRadius: '2px' }} />
              Tú (Contestados)
            </span>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>
            <Clock size={18} style={{ color: '#ff9f43' }} />
            Velocidad de Respuesta Promedio
          </h3>
          <div className={styles.chartContainer}>
            {renderResponseTimeChart()}
          </div>
          <span className={styles.helpText} style={{ textAlign: 'center', marginTop: '10px' }}>
            Promedio de minutos transcurridos por día antes de dar respuesta al cliente.
          </span>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>
            <Clock size={18} style={{ color: '#25d366' }} />
            Horas Pico de Consulta (Mensajes Entrantes)
          </h3>
          <div className={styles.chartContainer}>
            {messages.length > 0 ? renderHourlyChart() : (
              <div className={styles.emptyChart}>
                <Clock size={40} strokeWidth={1} style={{ opacity: 0.5 }} />
                <p>Esperando datos de hora...</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>
            <User size={18} style={{ color: '#1a5d91' }} />
            Clientes más Activos
          </h3>
          <div className={styles.chartContainer} style={{ height: 'auto', minHeight: '180px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
            {stats.topCustomers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                {stats.topCustomers.map((cust, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 500 }}>
                      <span>{cust.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{cust.count} mensajes</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${(cust.count / stats.topCustomers[0].count) * 100}%`, 
                          height: '100%', 
                          backgroundColor: idx === 0 ? '#25d366' : idx === 1 ? '#1ebd5d' : '#1a5d91', 
                          borderRadius: '4px' 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyChart}>
                <User size={40} strokeWidth={1} style={{ opacity: 0.5 }} />
                <p>No hay contactos registrados todavía.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historial de últimos mensajes */}
      {filteredMessages.length > 0 && (
        <div className={styles.tableCard}>
          <h3>Historial Reciente de Mensajes en Vivo</h3>
          <table className={styles.msgTable}>
            <thead>
              <tr>
                <th>Fecha / Hora</th>
                <th>Conversación (Contacto)</th>
                <th>Remitente</th>
                <th>Dirección</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredMessages]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10)
                .map((msg) => {
                  const dateObj = new Date(msg.timestamp);
                  const dateStr = `${dateObj.getDate().toString().padStart(2,'0')}/${(dateObj.getMonth()+1).toString().padStart(2,'0')} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`;
                  
                  return (
                    <tr key={msg.id}>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{dateStr}</td>
                      <td style={{ fontWeight: 500, color: '#1a5d91' }}>{msg.chatId.replace(/_/g, ' ')}</td>
                      <td style={{ fontWeight: 600 }}>{msg.sender}</td>
                      <td>
                        <span className={`${styles.directionBadge} ${msg.direction === 'INBOUND' ? styles.inboundBadge : styles.outboundBadge}`}>
                          {msg.direction === 'INBOUND' ? 'Entrante (Cliente)' : 'Contestado (Yo)'}
                        </span>
                      </td>
                      <td style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.content}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
