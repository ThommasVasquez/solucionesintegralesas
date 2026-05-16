'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
// Removed UserRole import from prisma
interface SheetViewerProps {
  sheetName: string;
  role: string;
  initialData?: any[][];
  apiUrl?: string;
}

export function SheetViewer({ sheetName, role, initialData = [], apiUrl }: SheetViewerProps) {
  const fetchUrl = apiUrl || `/api/sheets/${encodeURIComponent(sheetName)}`;
  const saveUrl = apiUrl ? `${apiUrl}/edit` : `/api/sheets/${encodeURIComponent(sheetName)}/edit`;
  const hotRef = useRef<any>(null);
  const [data, setData] = useState<any[][]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);

  const canEdit = role === 'PATRON' || role === 'ADMIN' || role === 'AGENDADOR';

  useEffect(() => {
    if (!initialData.length) {
      fetchData();
    }
  }, [sheetName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error('Failed to fetch sheet data');
      const json = await res.json();
      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!hotRef.current) return;
    
    const hotInstance = (hotRef.current as any).hotInstance;
    if (!hotInstance) return;

    const currentData = hotInstance.getData();
    
    try {
      setLoading(true);
      const res = await fetch(saveUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: currentData, range: 'A1' }) 
      });
      
      if (!res.ok) throw new Error('Failed to save data');
      alert('Changes saved successfully');
    } catch (err: any) {
      setError(err.message);
      alert('Error saving: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-red-500 p-4 border border-red-500 rounded">{error}</div>;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Sheet: {sheetName}</h2>
        {canEdit && (
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="flex-grow bg-white rounded shadow overflow-hidden relative">
        {loading && <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center text-black font-bold">Loading...</div>}
        <HotTable
          ref={hotRef}
          data={data.length > 0 ? data : [['']]}
          rowHeaders={true}
          colHeaders={true}
          height="100%"
          width="100%"
          readOnly={!canEdit}
          licenseKey="non-commercial-and-evaluation" // for evaluation
        />
      </div>
    </div>
  );
}
