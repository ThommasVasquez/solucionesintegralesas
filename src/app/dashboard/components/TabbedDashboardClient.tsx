'use client';

import { useState, useEffect } from 'react';
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
  FolderOpen 
} from 'lucide-react';
import styles from "./TabbedDashboardClient.module.css";

export interface DriveFile {
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'img';
  size: string;
  date: string;
  category: string;
}

interface TabbedDashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  isSergio: boolean;
  sheetUrl: string;
  title: string;
  brandColor: string;
  driveUrl: string;
  initialFiles: DriveFile[];
  hideExcelForSergio?: boolean;
}

export default function TabbedDashboardClient({
  user,
  isSergio,
  sheetUrl,
  title,
  brandColor,
  driveUrl,
  initialFiles,
  hideExcelForSergio = false
}: TabbedDashboardClientProps) {
  // Ocultar planilla si es Sergio y la bandera está encendida.
  const shouldHideExcel = isSergio && hideExcelForSergio;

  const [activeTab, setActiveTab] = useState<'excel' | 'whatsapp' | 'drive'>(shouldHideExcel ? 'whatsapp' : 'excel');

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

  const handleTabChange = (tab: 'excel' | 'whatsapp' | 'drive') => {
    setActiveTab(tab);
    logAction({
      userEmail: user.email,
      userName: user.name,
      action: 'SWITCH_TAB',
      resource: title,
      details: { tab, message: `Cambió a la pestaña "${tab === 'excel' ? 'Planilla Excel' : tab === 'whatsapp' ? 'Reportes WhatsApp' : 'Carpeta Drive'}" en el panel ${title}` }
    });
  };

  // Estados del Explorador de Archivos (Drive)
  const [files, setFiles] = useState<DriveFile[]>(initialFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Categorías de carpetas
  const categories = ['Todos', ...Array.from(new Set([...files.map(f => f.category), ...customCategories]))];

  // Helper para deducir tipo de archivo por extensión
  const getFileType = (fileName: string): 'pdf' | 'doc' | 'xls' | 'img' => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'xls';
    return 'img';
  };

  // Simulación de subida de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      setUploadProgress(0);
      setUploadingFileName(file.name);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const newFile: DriveFile = {
                name: file.name,
                type: getFileType(file.name),
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                date: new Date().toLocaleDateString(),
                category: selectedCategory === 'Todos' ? 'General' : selectedCategory
              };
              setFiles(prevFiles => [newFile, ...prevFiles]);
              setIsUploading(false);
              logAction({
                userEmail: user.email,
                userName: user.name,
                action: 'UPLOAD_FILE',
                resource: title,
                details: { fileName: file.name, size: file.size, message: `Subió el archivo ${file.name} en el panel ${title}` }
              });
            }, 300);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  // Crear Carpeta manualmente
  const handleCreateFolder = () => {
    const folderName = prompt("Ingrese el nombre de la nueva carpeta:");
    if (folderName && folderName.trim()) {
      const trimmed = folderName.trim();
      if (categories.includes(trimmed)) {
        alert("Ya existe una carpeta con ese nombre.");
        return;
      }
      setCustomCategories(prev => [...prev, trimmed]);
      setSelectedCategory(trimmed);
      logAction({
        userEmail: user.email,
        userName: user.name,
        action: 'CREATE_FOLDER',
        resource: title,
        details: { folderName: trimmed, message: `Creó la carpeta "${trimmed}" en el panel ${title}` }
      });
    }
  };

  // Subir Carpeta (webkitdirectory)
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const folderFiles = Array.from(e.target.files);
      const firstFile = folderFiles[0];
      const folderName = firstFile.webkitRelativePath.split('/')[0] || 'Carpeta Subida';
      
      if (categories.includes(folderName)) {
        alert(`Ya existe una carpeta llamada "${folderName}". Los archivos se guardarán en ella.`);
      }

      setIsUploading(true);
      setUploadProgress(0);
      setUploadingFileName(`Carpeta "${folderName}" (${folderFiles.length} archivos)`);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const newFiles: DriveFile[] = folderFiles.map(file => ({
                name: file.name,
                type: getFileType(file.name),
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                date: new Date().toLocaleDateString(),
                category: folderName
              }));
              
              setCustomCategories(prevCats => [...prevCats, folderName]);
              setFiles(prevFiles => [...newFiles, ...prevFiles]);
              setSelectedCategory(folderName);
              setIsUploading(false);
              
              logAction({
                userEmail: user.email,
                userName: user.name,
                action: 'UPLOAD_FOLDER',
                resource: title,
                details: { 
                  folderName, 
                  fileCount: folderFiles.length,
                  message: `Subió la carpeta "${folderName}" con ${folderFiles.length} archivos en el panel ${title}` 
                }
              });
            }, 300);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  // Filtrado de archivos
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <main className={`${styles.main} ${activeTab !== 'excel' ? styles.scrollable : styles.hiddenScroll} ${shouldHideExcel ? styles.isSergioActive : ''}`}>
      <Navbar />
      
      {/* Selector de pestañas, oculto si se debe ocultar el Excel */}
      {!shouldHideExcel && (
        <div className={styles.tabContainer}>
          <div className={styles.tabBar}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'excel' ? styles.tabBtnActive : ''}`}
              style={activeTab === 'excel' ? { backgroundColor: brandColor, boxShadow: `0 4px 12px ${brandColor}4D` } : {}}
              onClick={() => handleTabChange('excel')}
            >
              📄 Planilla Excel
            </button>
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
          <WhatsAppDashboard userName={user.name || "Usuario"} userEmail={user.email || ""} />
        </div>
      )}

      {activeTab === 'drive' && (
        <div className={styles.driveWrapper}>
          <div className={styles.driveHeader}>
            <div className={styles.driveTitle}>
              <h2>📁 Explorador de Documentos</h2>
              <p>Acceso a la documentación digital, actas y soportes de la línea de negocio en la nube.</p>
            </div>
            <a 
              href={driveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.externalDriveBtn}
              style={{ backgroundColor: brandColor }}
              onClick={() => {
                logAction({
                  userEmail: user.email,
                  userName: user.name,
                  action: 'OPEN_DRIVE',
                  resource: title,
                  details: { message: `Abrió la carpeta externa de Google Drive en el panel ${title}` }
                });
              }}
            >
              <ExternalLink size={18} />
              Abrir en Google Drive ↗
            </a>
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
                  <span className={styles.progressFileName}>Subiendo: {uploadingFileName}</span>
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
                  onClick={() => setSelectedCategory(category)}
                >
                  <FolderOpen size={16} />
                  {category}
                </button>
              ))}
            </div>

            {/* Files List */}
            <div className={styles.filesGrid}>
              {filteredFiles.length === 0 ? (
                <div className={styles.noFiles}>
                  <p>No se encontraron archivos en esta carpeta.</p>
                </div>
              ) : (
                filteredFiles.map((file, idx) => (
                  <div key={idx} className={styles.fileCard}>
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
                    <button 
                      onClick={() => {
                        alert(`Iniciando descarga de: ${file.name}`);
                        logAction({
                          userEmail: user.email,
                          userName: user.name,
                          action: 'DOWNLOAD_FILE',
                          resource: title,
                          details: { fileName: file.name, message: `Descargó el archivo ${file.name} del panel ${title}` }
                        });
                      }}
                      className={styles.downloadBtn}
                      title="Descargar archivo"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
