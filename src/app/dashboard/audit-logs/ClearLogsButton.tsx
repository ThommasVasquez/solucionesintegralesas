'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './audit-logs.module.css';

export default function ClearLogsButton() {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    if (!confirm('¿Estás seguro de que deseas vaciar todo el registro de auditoría? Esta acción es permanente.')) {
      return;
    }

    setIsClearing(true);
    try {
      const res = await fetch('/api/audit-log/clear', {
        method: 'POST',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('No se pudo vaciar la bitácora.');
      }
    } catch (e) {
      alert('Error de red al vaciar la bitácora.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <button 
      onClick={handleClear}
      disabled={isClearing}
      className={styles.clearBtn}
    >
      {isClearing ? 'Vaciando...' : 'Vaciar Bitácora 🗑️'}
    </button>
  );
}
