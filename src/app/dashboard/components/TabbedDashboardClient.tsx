'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import WhatsAppDashboard from "../whatsapp/WhatsAppDashboard";
import styles from "./TabbedDashboardClient.module.css";

interface TabbedDashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  isSergio: boolean;
  sheetUrl: string;
  title: string;
  brandColor: string;
  hideExcelForSergio?: boolean;
}

export default function TabbedDashboardClient({
  user,
  isSergio,
  sheetUrl,
  title,
  brandColor,
  hideExcelForSergio = false
}: TabbedDashboardClientProps) {
  // Ocultar planilla si es Sergio y la bandera está encendida.
  const shouldHideExcel = isSergio && hideExcelForSergio;

  const [activeTab, setActiveTab] = useState<'excel' | 'whatsapp'>(shouldHideExcel ? 'whatsapp' : 'excel');

  return (
    <main className={`${styles.main} ${activeTab === 'whatsapp' ? styles.scrollable : styles.hiddenScroll} ${shouldHideExcel ? styles.isSergioActive : ''}`}>
      <Navbar />
      
      {/* Selector de pestañas, oculto si se debe ocultar el Excel */}
      {!shouldHideExcel && (
        <div className={styles.tabContainer}>
          <div className={styles.tabBar}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'excel' ? styles.tabBtnActive : ''}`}
              style={activeTab === 'excel' ? { backgroundColor: brandColor, boxShadow: `0 4px 12px ${brandColor}4D` } : {}}
              onClick={() => setActiveTab('excel')}
            >
              📄 Planilla Excel
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'whatsapp' ? styles.tabBtnActive : ''}`}
              style={activeTab === 'whatsapp' ? { backgroundColor: brandColor, boxShadow: `0 4px 12px ${brandColor}4D` } : {}}
              onClick={() => setActiveTab('whatsapp')}
            >
              💬 Reportes WhatsApp
            </button>
          </div>
        </div>
      )}

      {activeTab === 'excel' && !shouldHideExcel && (
        <div className={styles.iframeWrapper}>
          <iframe 
            src={sheetUrl}
            className={styles.iframe}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      )}

      {activeTab === 'whatsapp' && (
        <div className={styles.whatsappWrapper}>
          <WhatsAppDashboard userName={user.name || "Usuario"} />
        </div>
      )}
    </main>
  );
}
