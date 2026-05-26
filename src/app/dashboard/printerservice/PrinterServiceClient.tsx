'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import WhatsAppDashboard from "../whatsapp/WhatsAppDashboard";
import styles from "./printerservice.module.css";

interface PrinterServiceClientProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  isSergio: boolean;
}

export default function PrinterServiceClient({ user, isSergio }: PrinterServiceClientProps) {
  // Sergio sólo puede ver WhatsApp. Los demás ven Excel por defecto pero pueden alternar.
  const [activeTab, setActiveTab] = useState<'excel' | 'whatsapp'>(isSergio ? 'whatsapp' : 'excel');

  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1dRd9YiMJpycg28KdZVvtDtNaSKb0YA6UZdibk1CQzLk/edit?usp=sharing";

  return (
    <main className={`${styles.main} ${activeTab === 'whatsapp' ? styles.scrollable : styles.hiddenScroll} ${isSergio ? styles.isSergioActive : ''}`}>
      <Navbar />
      
      {/* Selector de pestañas, oculto para Sergio */}
      {!isSergio && (
        <div className={styles.tabContainer}>
          <div className={styles.tabBar}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'excel' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('excel')}
            >
              📄 Planilla Excel
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'whatsapp' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('whatsapp')}
            >
              💬 Reportes WhatsApp
            </button>
          </div>
        </div>
      )}

      {activeTab === 'excel' && !isSergio && (
        <div className={styles.iframeWrapper}>
          <iframe 
            src={SHEET_URL}
            className={styles.iframe}
            title="Gestión PrinterService"
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
