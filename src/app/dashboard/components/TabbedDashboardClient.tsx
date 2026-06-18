'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import WhatsAppDashboard from "../whatsapp/WhatsAppDashboard";
import { logAction } from '@/lib/audit-client';
import { 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  Search, 
  Upload, 
  Download, 
  ExternalLink, 
  FolderOpen,
  Trash2,
  Loader2,
  Eye
} from 'lucide-react';
import styles from "./TabbedDashboardClient.module.css";

export interface DriveFile {
  id?: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'img';
  size: string;
  date: string;
  category: string;
}

interface ExcelWorkbookState {
  fileName: string;
  sheetNames: string[];
  activeSheet: string;
  sheetsData: Record<string, any[][]>;
}

export interface AdminSheet {
  name: string;
  url: string;
}

interface TabbedDashboardClientProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  isSergio?: boolean;
  sheetUrl: string;
  title: string;
  brandColor: string;
  driveUrl: string;
  initialFiles: DriveFile[];
  hideExcelForSergio?: boolean;
  brandId?: string;
  adminSheets?: AdminSheet[];
}

export default function TabbedDashboardClient({
  user: passedUser,
  isSergio: passedIsSergio,
  sheetUrl: passedSheetUrl,
  title,
  brandColor,
  driveUrl,
  initialFiles,
  hideExcelForSergio = false,
  brandId,
  adminSheets
}: TabbedDashboardClientProps) {
  const { data: session } = useSession();
  const sessionUser = session?.user;

  const user = passedUser?.email ? passedUser : { name: sessionUser?.name, email: sessionUser?.email };
  const isSergio = passedIsSergio !== undefined ? passedIsSergio : (sessionUser?.email === "sergio@ingenova.com.co");
  const rawSheetUrl = (isSergio && title === "Gestión de Visitas ProMascotas")
    ? "https://docs.google.com/spreadsheets/d/1d0yCW0dVJjlhk4X4rQVVs_G62K8QEhEIgZQZHzltaqI/edit?usp=sharing"
    : passedSheetUrl;

  const allowedAdmins = [
    "sebastian@ingenova.com.co",
    "jessyca@ingenova.com.co",
    "adrian@ingenova.com.co",
    "thommyenergy@superuser.com"
  ];
  const isUserAdmin = !!user?.email && (
    allowedAdmins.includes(user.email.toLowerCase()) || 
    (sessionUser as any)?.role === 'BOSS'
  );
  const isSuperUser = !!user?.email && user.email.toLowerCase() === "thommyenergy@superuser.com";


  const getEmbedUrl = (url: string) => {
    // Retornamos la URL original para permitir la edición en Google Sheets
    return url;
  };
  const sheetUrl = getEmbedUrl(rawSheetUrl);

  // Ocultar planilla si es Sergio y la bandera está encendida.
  const shouldHideExcel = isSergio && hideExcelForSergio;

  const defaultAdminSheets = [
    { name: "archivo1", url: "https://docs.google.com/spreadsheets/d/1pmNkiCfvW6KICOwHEggRfzgUyBGqU6x22WT8yDG1pKo/edit?usp=sharing" },
    { name: "archivo2", url: "https://docs.google.com/spreadsheets/d/1hLseTl6VfGFoVG8rIND5vDiwbX36xNiaOeMYDxVTl54/edit?usp=sharing" },
    { name: "archivo3", url: "https://docs.google.com/spreadsheets/d/1joniM23XA3LxWo6ernD-w5bOppVsGFN38iCmhATC6Fs/edit?usp=sharing" },
    { name: "archivo4", url: "https://docs.google.com/spreadsheets/d/1dRd9YiMJpycg28KdZVvtDtNaSKb0YA6UZdibk1CQzLk/edit?usp=sharing" },
  ];

  const [sheetsList, setSheetsList] = useState<AdminSheet[]>(adminSheets || defaultAdminSheets);
  const [isCustomConfig, setIsCustomConfig] = useState(false);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configSheets, setConfigSheets] = useState<AdminSheet[]>([]);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Fetch configured sheets from DB on mount/brandId change
  useEffect(() => {
    const fetchAdminSheets = async () => {
      if (!brandId) return;
      setIsLoadingSheets(true);
      try {
        const res = await fetch(`/api/admin-sheets?brandId=${brandId}`);
        const data = await res.json();
        if (data.success && data.sheets && data.sheets.length > 0) {
          setSheetsList(data.sheets);
          setIsCustomConfig(!!data.isCustom);
        }
      } catch (e) {
        console.error("Error fetching admin sheets:", e);
      } finally {
        setIsLoadingSheets(false);
      }
    };

    if (!adminSheets) {
      fetchAdminSheets();
    }
  }, [brandId, adminSheets]);



  const [activeTab, setActiveTab] = useState<'excel' | 'whatsapp' | 'drive' | 'stats'>('whatsapp');

  useEffect(() => {
    if (!shouldHideExcel) {
      setActiveTab('excel');
    } else if (isSergio || isSuperUser) {
      setActiveTab('stats');
    } else {
      setActiveTab('whatsapp');
    }
  }, [shouldHideExcel, isSergio, isSuperUser]);

  // Log panel view on load
  useEffect(() => {
    if (user?.email) {
      logAction({
        userEmail: user.email,
        userName: user.name,
        action: 'VIEW_DASHBOARD',
        resource: title,
        details: { message: `Ingresó al panel ${title}` }
      });
    }
  }, [user, title]);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentSheetUrl, setCurrentSheetUrl] = useState(sheetUrl);
  const adminDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentSheetUrl(sheetUrl);
  }, [sheetUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setIsAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTabChange = (tab: 'excel' | 'whatsapp' | 'drive' | 'stats') => {
    setActiveTab(tab);
    setExcelWorkbook(null);
    setViewingFile(null);
    setSelectedFileIds([]);
    setIsAdminOpen(false);
    if (tab !== 'excel') {
      setCurrentSheetUrl(sheetUrl);
    }
    logAction({
      userEmail: user?.email || '',
      userName: user?.name || '',
      action: 'SWITCH_TAB',
      resource: title,
      details: { tab, message: `Cambió a la pestaña "${tab === 'excel' ? 'Planilla Excel' : tab === 'whatsapp' ? 'Reportes WhatsApp' : tab === 'stats' ? 'Estadísticas' : 'Carpeta Drive'}" en el panel ${title}` }
    });
  };

  const handleAdminSelect = (name: string, url: string) => {
    setCurrentSheetUrl(url);
    setIsAdminOpen(false);
    setActiveTab('excel');
    logAction({
      userEmail: user.email,
      userName: user.name,
      action: 'SWITCH_TAB',
      resource: title,
      details: { tab: `excel-${name}`, message: `Visualizó el archivo administrativo "${name}" en el panel ${title}` }
    });
  };

  // Estados del Explorador de Archivos (Drive)
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');
  const [excelWorkbook, setExcelWorkbook] = useState<ExcelWorkbookState | null>(null);
  const [viewingFile, setViewingFile] = useState<DriveFile | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  // Categorías de carpetas
  const categories = ['Todos', ...Array.from(new Set(files.map(f => f.category)))];

  // Cargar archivos desde base de datos
  const loadFiles = async () => {
    if (!brandId) return;
    setIsLoadingFiles(true);
    try {
      const res = await fetch(`/api/drive/files?brandId=${brandId}`);
      const data = await res.json();
      if (data.success && data.files) {
        setFiles(data.files);
        setSelectedFileIds([]);
      }
    } catch (e) {
      console.error("Error loading files:", e);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'drive') {
      loadFiles();
    }
  }, [activeTab, brandId]);

  // Helper para deducir tipo de archivo por extensión
  const getFileType = (fileName: string): 'pdf' | 'doc' | 'xls' | 'img' => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'xls';
    return 'img';
  };

  // Crear Carpeta guardando un archivo dummy en base de datos
  const handleCreateFolder = async () => {
    const folderName = prompt("Ingrese el nombre de la nueva carpeta:");
    if (folderName && folderName.trim()) {
      const trimmed = folderName.trim();
      if (categories.includes(trimmed)) {
        alert("Ya existe una carpeta con ese nombre.");
        return;
      }
      
      setIsUploading(true);
      setUploadingFileName(`Creando carpeta "${trimmed}"`);
      setUploadProgress(50);
      
      try {
        const res = await fetch('/api/drive/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandId,
            name: `.folder`,
            type: 'pdf',
            size: '0 KB',
            category: trimmed,
            content: 'Rk9MREVS' // base64 para 'FOLDER'
          })
        });
        const data = await res.json();
        if (data.success) {
          setUploadProgress(100);
          await loadFiles();
          setSelectedCategory(trimmed);
          logAction({
            userEmail: user.email,
            userName: user.name,
            action: 'CREATE_FOLDER',
            resource: title,
            details: { folderName: trimmed, message: `Creó la carpeta "${trimmed}" en el panel ${title}` }
          });
        } else {
          alert("Error al crear la carpeta en la base de datos.");
        }
      } catch (err) {
        console.error(err);
        alert("Error de conexión al crear carpeta.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  // Subir Archivos Reales a Base de Datos (soporte múltiple)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      const tooLargeFiles = selectedFiles.filter(f => f.size > 4 * 1024 * 1024);
      if (tooLargeFiles.length > 0) {
        alert(`Los siguientes archivos superan el límite de 4 MB y no serán subidos:\n${tooLargeFiles.map(f => `- ${f.name}`).join('\n')}`);
      }

      const validFiles = selectedFiles.filter(f => f.size <= 4 * 1024 * 1024);
      if (validFiles.length === 0) {
        return;
      }

      setIsUploading(true);
      let uploadedCount = 0;

      for (const file of validFiles) {
        setUploadingFileName(file.name);
        setUploadProgress(Math.round((uploadedCount / validFiles.length) * 100));

        try {
          const base64Content = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const res = await fetch('/api/drive/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              brandId,
              name: file.name,
              type: getFileType(file.name),
              size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
              category: selectedCategory === 'Todos' ? 'General' : selectedCategory,
              content: base64Content
            })
          });

          const data = await res.json();
          if (data.success) {
            uploadedCount++;
            logAction({
              userEmail: user.email,
              userName: user.name,
              action: 'UPLOAD_FILE',
              resource: title,
              details: { fileName: file.name, size: file.size, message: `Subió el archivo ${file.name} en el panel ${title}` }
            });
          } else {
            console.error("Error al guardar archivo:", file.name, data.error);
          }
        } catch (err) {
          console.error("Error al procesar archivo:", file.name, err);
        }
      }

      setUploadProgress(100);
      setTimeout(async () => {
        await loadFiles();
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    }
  };

  // Subir Carpeta Real a Base de Datos
  const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const folderFiles = Array.from(e.target.files);
      
      const validFiles = folderFiles.filter(f => f.size <= 4 * 1024 * 1024);
      if (validFiles.length === 0) {
        alert("No hay archivos válidos menores a 4 MB para subir.");
        return;
      }

      const firstFile = validFiles[0];
      const folderName = firstFile.webkitRelativePath.split('/')[0] || 'Carpeta Subida';
      
      setIsUploading(true);
      setUploadingFileName(`Carpeta "${folderName}" (${validFiles.length} archivos)`);
      
      let uploadedCount = 0;
      
      for (const file of validFiles) {
        try {
          const base64Content = await new Promise<string>((resolve, reject) => {
             const reader = new FileReader();
             reader.onload = () => resolve((reader.result as string).split(',')[1]);
             reader.onerror = reject;
             reader.readAsDataURL(file);
          });
          
          await fetch('/api/drive/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              brandId,
              name: file.name,
              type: getFileType(file.name),
              size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
              category: folderName,
              content: base64Content
            })
          });
          
          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / validFiles.length) * 100));
        } catch (err) {
          console.error(`Error uploading ${file.name}:`, err);
        }
      }
      
      setTimeout(async () => {
        await loadFiles();
        setIsUploading(false);
        logAction({
          userEmail: user.email,
          userName: user.name,
          action: 'UPLOAD_FOLDER',
          resource: title,
          details: { folderName, fileCount: uploadedCount, message: `Subió la carpeta "${folderName}" con ${uploadedCount} archivos en el panel ${title}` }
        });
      }, 300);
    }
  };

  const getMimeType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'application/pdf';
    if (ext === 'png') return 'image/png';
    if (['jpg', 'jpeg'].includes(ext || '')) return 'image/jpeg';
    if (ext === 'gif') return 'image/gif';
    if (ext === 'svg') return 'image/svg+xml';
    if (ext === 'webp') return 'image/webp';
    if (['xls', 'xlsx'].includes(ext || '')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (['doc', 'docx'].includes(ext || '')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    return 'application/octet-stream';
  };

  // Ver Archivo Real en Línea (Nativo del Navegador o Visor Integrado)
  const handleViewFile = async (file: DriveFile) => {
    if (!file.id) return;
    
    if (file.type === 'doc') {
      alert(`Este tipo de archivo (${file.type.toUpperCase()}) no se puede visualizar directamente en el navegador. Se descargará automáticamente.`);
      handleDownloadFile(file);
      return;
    }

    if (file.type === 'xls') {
      setIsLoadingFiles(true);
      try {
        const res = await fetch(`/api/drive/download?id=${file.id}`);
        const data = await res.json();
        if (data.success && data.content) {
          // Load SheetJS dynamically from CDN
          const XLSX = await new Promise<any>((resolve) => {
            if ((window as any).XLSX) {
              resolve((window as any).XLSX);
              return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
            script.onload = () => resolve((window as any).XLSX);
            document.body.appendChild(script);
          });

          const workbook = XLSX.read(data.content, { type: 'base64' });
          const sheets: Record<string, any[][]> = {};
          workbook.SheetNames.forEach((sheetName: string) => {
            const worksheet = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
            sheets[sheetName] = rawData;
          });

          setExcelWorkbook({
            fileName: file.name,
            sheetNames: workbook.SheetNames,
            activeSheet: workbook.SheetNames[0],
            sheetsData: sheets
          });
          setViewingFile(file);

          logAction({
            userEmail: user.email,
            userName: user.name,
            action: 'VIEW_EXCEL_ONLINE',
            resource: title,
            details: { fileName: file.name, message: `Visualizó en línea la hoja de cálculo ${file.name} en el panel ${title}` }
          });
        } else {
          alert("Error al abrir el archivo de la base de datos.");
        }
      } catch (err) {
        console.error("Error viewing Excel:", err);
        alert("Error de conexión al cargar la vista de Excel.");
      } finally {
        setIsLoadingFiles(false);
      }
      return;
    }

    // For PDFs and images, display them inline using setViewingFile
    if (file.type === 'pdf' || file.type === 'img') {
      setViewingFile(file);
      
      logAction({
        userEmail: user.email,
        userName: user.name,
        action: 'VIEW_FILE_ONLINE',
        resource: title,
        details: { fileName: file.name, message: `Visualizó en línea el archivo ${file.name} en el panel ${title}` }
      });
      return;
    }
  };

  // Descargar Archivo Real desde Base de Datos
  const handleDownloadFile = async (file: DriveFile) => {
    if (!file.id) return;
    try {
      const res = await fetch(`/api/drive/download?id=${file.id}`);
      const data = await res.json();
      if (data.success && data.content) {
        const byteCharacters = atob(data.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = data.name || file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        logAction({
          userEmail: user.email,
          userName: user.name,
          action: 'DOWNLOAD_FILE',
          resource: title,
          details: { fileName: file.name, message: `Descargó el archivo ${file.name} en el panel ${title}` }
        });
      } else {
        alert("Error al descargar el archivo de la base de datos.");
      }
    } catch (err) {
      console.error("Error downloading file:", err);
      alert("Error de conexión al descargar el archivo.");
    }
  };

  // Eliminar Archivo Real de la Base de Datos
  const handleDeleteFile = async (file: DriveFile) => {
    if (!file.id) return;
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el archivo "${file.name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/drive/delete?id=${file.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        await loadFiles();
        logAction({
          userEmail: user.email,
          userName: user.name,
          action: 'DELETE_FILE',
          resource: title,
          details: { fileName: file.name, message: `Eliminó el archivo ${file.name} en el panel ${title}` }
        });
      } else {
        alert("Error al eliminar el archivo.");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Error de conexión al eliminar el archivo.");
    }
  };

  // Filtrado de archivos (ocultando archivos de control de carpetas vacías ".folder")
  const filteredFiles = files.filter(file => {
    const isNotDummyFolder = file.name !== '.folder';
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || file.category === selectedCategory;
    return isNotDummyFolder && matchesSearch && matchesCategory;
  });

  const allFilteredSelected = filteredFiles.length > 0 && filteredFiles.every(f => f.id && selectedFileIds.includes(f.id));
  const someFilteredSelected = filteredFiles.some(f => f.id && selectedFileIds.includes(f.id)) && !allFilteredSelected;

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = filteredFiles.map(f => f.id).filter(Boolean) as string[];
      setSelectedFileIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      const filteredIds = filteredFiles.map(f => f.id).filter(Boolean) as string[];
      setSelectedFileIds(prev => {
        const unique = new Set([...prev, ...filteredIds]);
        return Array.from(unique);
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFileIds.length === 0) return;
    
    const count = selectedFileIds.length;
    const confirmMessage = count === 1 
      ? `¿Estás seguro de que deseas eliminar permanentemente el archivo seleccionado?`
      : `¿Estás seguro de que deseas eliminar permanentemente los ${count} archivos seleccionados?`;
      
    if (!confirm(confirmMessage)) {
      return;
    }
    
    setIsDeletingBulk(true);
    try {
      const filesToDelete = files.filter(f => f.id && selectedFileIds.includes(f.id));
      const fileNames = filesToDelete.map(f => f.name).join(', ');

      const deletePromises = selectedFileIds.map(id =>
        fetch(`/api/drive/delete?id=${id}`, { method: 'DELETE' }).then(res => res.json())
      );
      
      const results = await Promise.all(deletePromises);
      const failures = results.filter(r => !r.success);
      
      if (failures.length > 0) {
        alert(`Se eliminaron algunos archivos, pero ocurrió un error con ${failures.length} de ellos.`);
      }
      
      await loadFiles();
      setSelectedFileIds([]);
      
      logAction({
        userEmail: user.email,
        userName: user.name,
        action: 'BULK_DELETE_FILES',
        resource: title,
        details: { 
          count, 
          fileNames,
          message: `Eliminó de forma masiva ${count} archivos (${fileNames}) en el panel ${title}` 
        }
      });
      
    } catch (err) {
      console.error("Error in bulk delete:", err);
      alert("Ocurrió un error de conexión al eliminar los archivos.");
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const renderFileIcon = (type: 'pdf' | 'doc' | 'xls' | 'img') => {
    switch (type) {
      case 'pdf':
        return <FileText className={styles.iconPdf} size={28} />;
      case 'doc':
        return <FileText className={styles.iconDoc} size={28} />;
      case 'xls':
        return <FileSpreadsheet className={styles.iconXls} size={28} />;
      case 'img':
        return <FileImage className={styles.iconImg} size={28} />;
    }
  };

  return (
    <main className={`${styles.main} ${(activeTab !== 'excel' && activeTab !== 'stats') ? styles.scrollable : styles.hiddenScroll} ${(shouldHideExcel && activeTab !== 'stats') ? styles.isSergioActive : ''}`}>
      <Navbar />
      
      {/* Selector de pestañas */}
      <div className={styles.tabContainer}>
        <div className={styles.tabBar}>
          {!shouldHideExcel && isUserAdmin && (
            <div className={styles.dropdownContainer} ref={adminDropdownRef}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'excel' && currentSheetUrl !== sheetUrl ? styles.tabBtnActive : ''}`}
                style={activeTab === 'excel' && currentSheetUrl !== sheetUrl ? { backgroundColor: brandColor, boxShadow: `0 4px 12px ${brandColor}4D` } : {}}
                onClick={() => setIsAdminOpen(!isAdminOpen)}
              >
                💼 Administrativo ▾
              </button>
              {isAdminOpen && (
                <div className={styles.dropdownMenu}>
                  {sheetsList.map((sheet, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleAdminSelect(sheet.name, sheet.url)}
                    >
                      {sheet.name}
                    </button>
                  ))}
                  {(isSuperUser || (isUserAdmin && !isCustomConfig)) && (
                    <>
                      <div className={styles.dropdownDivider} />
                      <button 
                        className={styles.dropdownConfigBtn}
                        onClick={() => {
                          const list = [...sheetsList];
                          while (list.length < 4) {
                            list.push({ name: `archivo${list.length + 1}`, url: '' });
                          }
                          setConfigSheets(list.slice(0, 4));
                          setIsConfigModalOpen(true);
                          setIsAdminOpen(false);
                        }}
                      >
                        ⚙️ Configurar Archivos
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {!shouldHideExcel && (
            <button 
              className={`${styles.tabBtn} ${activeTab === 'excel' && currentSheetUrl === sheetUrl ? styles.tabBtnActive : ''}`}
              style={activeTab === 'excel' && currentSheetUrl === sheetUrl ? { backgroundColor: brandColor, boxShadow: `0 4px 12px ${brandColor}4D` } : {}}
              onClick={() => {
                setCurrentSheetUrl(sheetUrl);
                handleTabChange('excel');
              }}
            >
              📄 Planilla Excel
            </button>
          )}

          {(isSergio || isSuperUser) && (
            <button 
              className={`${styles.tabBtn} ${activeTab === 'stats' ? styles.tabBtnActive : ''}`}
              style={activeTab === 'stats' ? { backgroundColor: brandColor, boxShadow: `0 4px 12px ${brandColor}4D` } : {}}
              onClick={() => handleTabChange('stats')}
            >
              📈 Estadísticas
            </button>
          )}

          <button 
            className={`${styles.tabBtn} ${activeTab === 'whatsapp' ? styles.tabBtnActive : ''}`}
            style={activeTab === 'whatsapp' ? { backgroundColor: brandColor, boxShadow: `0 4px 12px ${brandColor}4D` } : {}}
            onClick={() => handleTabChange('whatsapp')}
          >
            💬 Reportes WhatsApp
          </button>
          
          <button 
            className={`${styles.tabBtn} ${activeTab === 'drive' ? styles.tabBtnActive : ''}`}
            style={activeTab === 'drive' ? { backgroundColor: brandColor, boxShadow: `0 4px 12px ${brandColor}4D` } : {}}
            onClick={() => handleTabChange('drive')}
          >
            📁 Carpeta Drive
          </button>
        </div>
      </div>

      {activeTab === 'excel' && !shouldHideExcel && (
        <div className={styles.iframeWrapper}>
          <iframe 
            src={currentSheetUrl}
            className={styles.iframe}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      )}

      {activeTab === 'stats' && (isSergio || isSuperUser) && (
        <div className={styles.iframeWrapper}>
          <iframe 
            src="https://docs.google.com/spreadsheets/d/1MwIVYmjvc9IPw_nWepCXlMj19XAugDc6zY37K0HvJ6Y/edit?gid=97119614#gid=97119614"
            className={styles.iframe}
            title="Estadísticas"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      )}

      {activeTab === 'whatsapp' && (
        <div className={styles.whatsappWrapper}>
          <WhatsAppDashboard userName={user.name || "Usuario"} userEmail={user.email || ""} brandId={brandId} />
        </div>
      )}

      {activeTab === 'drive' && (
        <div className={styles.driveWrapper}>
          {viewingFile ? (
            <div className={styles.fileInlineViewer}>
              <div className={styles.excelInlineHeader}>
                <div className={styles.excelInlineLeft}>
                  <button 
                    onClick={() => {
                      setViewingFile(null);
                      setExcelWorkbook(null);
                    }} 
                    className={styles.excelInlineBackBtn}
                  >
                    ← Volver a Archivos
                  </button>
                  <span className={styles.excelInlineDivider}>|</span>
                  <div className={styles.excelInlineTitle}>
                    {viewingFile.type === 'xls' && <FileSpreadsheet className={styles.iconXls} size={20} />}
                    {viewingFile.type === 'pdf' && <FileText className={styles.iconPdf} size={20} />}
                    {viewingFile.type === 'img' && <FileImage className={styles.iconImg} size={20} />}
                    <h3>{viewingFile.name}</h3>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDownloadFile(viewingFile)}
                  className={styles.excelInlineDownloadBtn}
                  style={{ backgroundColor: brandColor }}
                >
                  <Download size={16} /> Descargar
                </button>
              </div>

              {viewingFile.type === 'xls' && excelWorkbook && (
                <>
                  {/* Grid Table */}
                  <div className={styles.excelTableContainer}>
                    <table className={styles.excelTable}>
                      <thead>
                        <tr>
                          <th className={styles.excelCornerHeader}></th>
                          {Array.from({ length: (excelWorkbook.sheetsData[excelWorkbook.activeSheet] || []).reduce((max, row) => Math.max(max, row.length), 0) }).map((_, colIdx) => {
                            const getColumnLetter = (index: number): string => {
                              let letter = '';
                              let temp = index;
                              while (temp >= 0) {
                                letter = String.fromCharCode((temp % 26) + 65) + letter;
                                temp = Math.floor(temp / 26) - 1;
                              }
                              return letter;
                            };
                            return (
                              <th key={colIdx} className={styles.excelColHeader}>
                                {getColumnLetter(colIdx)}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {(excelWorkbook.sheetsData[excelWorkbook.activeSheet] || []).map((row, rowIdx) => (
                          <tr key={rowIdx}>
                            <td className={styles.excelRowHeader}>{rowIdx + 1}</td>
                            {Array.from({ length: (excelWorkbook.sheetsData[excelWorkbook.activeSheet] || []).reduce((max, row) => Math.max(max, row.length), 0) }).map((_, colIdx) => {
                              const cell = row[colIdx];
                              return (
                                <td key={colIdx} className={styles.excelCell}>
                                  {cell !== null && cell !== undefined ? String(cell) : ''}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Sheet Tabs at the bottom */}
                  {excelWorkbook.sheetNames.length > 1 && (
                    <div className={styles.excelSheetTabsBottom}>
                      {excelWorkbook.sheetNames.map((name) => (
                        <button
                          key={name}
                          className={`${styles.excelSheetTab} ${excelWorkbook.activeSheet === name ? styles.excelSheetTabActive : ''}`}
                          style={excelWorkbook.activeSheet === name ? { borderTop: `3px solid ${brandColor}`, color: brandColor } : {}}
                          onClick={() => setExcelWorkbook({
                            ...excelWorkbook,
                            activeSheet: name
                          })}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {viewingFile.type === 'pdf' && (
                <div className={styles.pdfViewerContainer}>
                  <iframe 
                    src={`/api/drive/view?id=${viewingFile.id}`} 
                    className={styles.pdfIframe}
                    title={viewingFile.name}
                  />
                </div>
              )}

              {viewingFile.type === 'img' && (
                <div className={styles.imageViewerContainer}>
                  <img 
                    src={`/api/drive/view?id=${viewingFile.id}`} 
                    className={styles.imageViewerImg} 
                    alt={viewingFile.name}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={styles.driveHeader}>
                <div className={styles.driveTitle}>
                  <h2>📁 Almacenamiento Seguro Propio</h2>
                  <p>Sube y gestiona documentos y actas directamente en el espacio digital propio de la empresa.</p>
                </div>
              </div>

              <div className={styles.explorerContainer}>
                {/* Search and Upload Bar */}
                <div className={styles.actionRow}>
                  <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Buscar archivos por nombre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className={styles.uploadZone}>
                    <button 
                      onClick={handleCreateFolder}
                      disabled={isUploading}
                      className={styles.uploadBtn}
                      style={{ borderColor: brandColor, color: brandColor, marginRight: '10px' }}
                    >
                      <FolderOpen size={18} />
                      Crear Carpeta
                    </button>

                    <label className={styles.uploadBtn} style={{ borderColor: brandColor, color: brandColor, marginRight: '10px' }}>
                      <FolderOpen size={18} />
                      Subir Carpeta
                      <input 
                        type="file" 
                        // @ts-ignore
                        webkitdirectory="true"
                        directory="true"
                        multiple
                        onChange={handleFolderChange}
                        className={styles.hiddenInput} 
                        disabled={isUploading}
                      />
                    </label>

                    <label className={styles.uploadBtn} style={{ borderColor: brandColor, color: brandColor }}>
                      <Upload size={18} />
                      Subir Archivo
                      <input 
                        type="file" 
                        multiple
                        onChange={handleFileChange}
                        className={styles.hiddenInput} 
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Upload progress */}
                {isUploading && (
                  <div className={styles.uploadProgressBarContainer}>
                    <div className={styles.uploadProgressInfo}>
                      <span className={styles.progressFileName}>Procesando: {uploadingFileName}</span>
                      <span className={styles.progressPercent}>{uploadProgress}%</span>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${uploadProgress}%`, backgroundColor: brandColor }}
                      />
                    </div>
                  </div>
                )}

                {/* Folder Tabs (Categories) */}
                <div className={styles.folderRow}>
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`${styles.folderBtn} ${selectedCategory === category ? styles.folderBtnActive : ''}`}
                      style={selectedCategory === category ? { borderColor: brandColor, color: brandColor, backgroundColor: brandColor + '10' } : {}}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedFileIds([]);
                      }}
                    >
                      <FolderOpen size={16} />
                      {category}
                    </button>
                  ))}
                </div>

                {/* Files List */}
                {isLoadingFiles ? (
                  <div className={styles.noFiles} style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <Loader2 className={styles.spinner} size={32} />
                    <p>Cargando archivos del almacenamiento seguro...</p>
                  </div>
                ) : (
                  <>
                    {/* Select All and Bulk Actions Bar */}
                    {filteredFiles.length > 0 && (
                      <div className={styles.bulkBar}>
                        <label className={styles.selectAllLabel}>
                          <input
                            type="checkbox"
                            checked={allFilteredSelected}
                            ref={(el) => {
                              if (el) {
                                el.indeterminate = someFilteredSelected;
                              }
                            }}
                            onChange={toggleSelectAll}
                            className={styles.checkboxInput}
                            style={{ accentColor: brandColor }}
                          />
                          <span>Seleccionar todo ({filteredFiles.length})</span>
                        </label>

                        {selectedFileIds.length > 0 && (
                          <div className={styles.bulkActions}>
                            <span className={styles.bulkInfo}>
                              {selectedFileIds.length} {selectedFileIds.length === 1 ? 'elemento seleccionado' : 'elementos seleccionados'}
                            </span>
                            <button
                              onClick={handleBulkDelete}
                              className={styles.bulkDeleteBtn}
                              disabled={isDeletingBulk}
                            >
                              {isDeletingBulk ? (
                                <>
                                  <Loader2 className={`${styles.spinner} mr-1`} size={16} />
                                  <span>Eliminando...</span>
                                </>
                              ) : (
                                <>
                                  <Trash2 size={16} style={{ marginRight: '6px' }} />
                                  <span>Eliminar Seleccionados</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={styles.filesGrid}>
                      {filteredFiles.length === 0 ? (
                        <div className={styles.noFiles}>
                          <p>No se encontraron archivos en esta carpeta.</p>
                        </div>
                      ) : (
                        filteredFiles.map((file, idx) => (
                          <div 
                            key={idx} 
                            className={`${styles.fileCard} ${file.id && selectedFileIds.includes(file.id) ? styles.fileCardSelected : ''}`}
                            style={file.id && selectedFileIds.includes(file.id) ? { borderColor: brandColor, backgroundColor: brandColor + '0A' } : {}}
                            onClick={() => file.id && toggleFileSelection(file.id)}
                          >
                            <div className={styles.checkboxContainer} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={!!file.id && selectedFileIds.includes(file.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (file.id) toggleFileSelection(file.id);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className={styles.checkboxInput}
                                style={{ accentColor: brandColor }}
                              />
                            </div>

                            <div className={styles.fileIconWrapper}>
                              {renderFileIcon(file.type)}
                            </div>
                            <div className={styles.fileDetails}>
                              <h3>{file.name}</h3>
                              <div className={styles.fileMeta}>
                                <span className={styles.fileCategory} style={{ color: brandColor, backgroundColor: brandColor + '10' }}>
                                  {file.category}
                                </span>
                                <span className={styles.fileSize}>{file.size}</span>
                                <span className={styles.fileDate}>{file.date}</span>
                              </div>
                            </div>
                            
                            <div className={styles.fileActions} onClick={(e) => e.stopPropagation()}>
                              {(file.type === 'pdf' || file.type === 'img' || file.type === 'xls') && (
                                <button 
                                  onClick={() => handleViewFile(file)}
                                  className={styles.viewBtn}
                                  title="Ver en línea"
                                  style={{ marginRight: '6px' }}
                                >
                                  <Eye size={18} />
                                </button>
                              )}
                              
                              <button 
                                onClick={() => handleDownloadFile(file)}
                                className={styles.downloadBtn}
                                title="Descargar archivo"
                                style={{ marginRight: '6px' }}
                              >
                                <Download size={18} />
                              </button>
                              
                              <button 
                                onClick={() => handleDeleteFile(file)}
                                className={styles.deleteBtn}
                                title="Eliminar archivo"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal de Configuración de Archivos Administrativos */}
      {isConfigModalOpen && (isSuperUser || (isUserAdmin && !isCustomConfig)) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>⚙️ Configurar Archivos Administrativos</h2>
              <button 
                onClick={() => setIsConfigModalOpen(false)} 
                className={styles.modalCloseBtn}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalAlert}>
                <strong>⚠️ Información Importante:</strong> Para que las planillas sean editables directamente desde el panel, asegúrate de compartir el archivo en Google Drive y que los enlaces terminen en <code>/edit</code> o <code>/edit?usp=sharing</code>.
              </div>

              {configSheets.map((sheet, index) => (
                <div key={index} className={styles.sheetConfigRow}>
                  <div className={styles.sheetConfigRowTitle}>
                    <span>📄 Archivo #{index + 1}</span>
                  </div>
                  <div className={styles.inputGroup}>
                    <input 
                      type="text" 
                      placeholder="Nombre del archivo (ej. Control Diario)" 
                      value={sheet.name}
                      onChange={(e) => {
                        const newSheets = [...configSheets];
                        newSheets[index] = { ...newSheets[index], name: e.target.value };
                        setConfigSheets(newSheets);
                      }}
                      className={styles.inputField}
                    />
                    <input 
                      type="text" 
                      placeholder="https://docs.google.com/spreadsheets/d/.../edit" 
                      value={sheet.url}
                      onChange={(e) => {
                        const newSheets = [...configSheets];
                        newSheets[index] = { ...newSheets[index], url: e.target.value };
                        setConfigSheets(newSheets);
                      }}
                      className={styles.inputField}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <button 
                onClick={() => setIsConfigModalOpen(false)} 
                className={styles.cancelBtn}
                disabled={isSavingConfig}
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  if (!brandId) return;
                  setIsSavingConfig(true);
                  try {
                    const res = await fetch('/api/admin-sheets', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ brandId, sheets: configSheets })
                    });
                    const data = await res.json();
                    if (data.success) {
                      setSheetsList(configSheets.filter(s => s.name && s.url));
                      setIsCustomConfig(true);
                      setIsConfigModalOpen(false);
                      logAction({
                        userEmail: user.email,
                        userName: user.name,
                        action: 'UPDATE_ADMIN_SHEETS',
                        resource: title,
                        details: { message: `Actualizó los enlaces de los archivos administrativos en el panel ${title}` }
                      });
                    } else {
                      alert("Error al guardar: " + data.error);
                    }
                  } catch (e) {
                    console.error(e);
                    alert("Error de red al guardar la configuración.");
                  } finally {
                    setIsSavingConfig(false);
                  }
                }}
                className={styles.saveBtn}
                style={{ backgroundColor: brandColor }}
                disabled={isSavingConfig}
              >
                {isSavingConfig ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
