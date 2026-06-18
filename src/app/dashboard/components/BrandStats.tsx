'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ArrowRight,
  Sparkles,
  Percent,
  CheckCircle,
  HelpCircle,
  LayoutDashboard,
  Edit3,
  MapPin,
  RefreshCw
} from 'lucide-react';
import styles from './BrandStats.module.css';

interface MetaAd {
  region: string;
  mensajes: number;
  inversion: number;
  costoMensaje: number;
}

interface ResumenCiudad {
  ciudad: string;
  region: string;
  serviciosProducto: number;
  serviciosEfectivos: number;
  ingresos: number;
  inversion: number;
  mensajes: number;
  cpa: number;
  roas: number;
  bitacoraVentas: number;
  conversion: number;
}

interface DesgloseProducto {
  ciudad: string;
  producto: string;
  serviciosProducto: number;
  serviciosEfectivos: number;
  ingresos: number;
  inversion: number;
  cpa: number;
  roas: number;
}

interface ResumenGeneral {
  ingresos: number;
  inversion: number;
  utilidad: number;
  roas: number;
}

interface WeekData {
  week: string;
  metaAds: MetaAd[];
  resumenCiudad: ResumenCiudad[];
  desgloseProducto: DesgloseProducto[];
  resumenGeneral: ResumenGeneral;
}

// B2B Interface Types
interface RegionB2B {
  region: string;
  inversion: number;
  mensajes: number;
  costoMensaje: number;
}

interface B2BData {
  isB2B: boolean;
  resumenGeneral: {
    inversion: number;
    mensajes: number;
    costoMensaje: number;
  };
  regiones: RegionB2B[];
}

interface BrandStatsProps {
  brandId: string;
  brandColor: string;
  statsSheetUrl?: string;
  canEdit?: boolean;
}

export default function BrandStats({ brandId, brandColor, statsSheetUrl, canEdit = false }: BrandStatsProps) {
  const [viewMode, setViewMode] = useState<'charts' | 'spreadsheet'>('charts');
  const [b2cData, setB2cData] = useState<WeekData[]>([]);
  const [b2bData, setB2bData] = useState<B2BData | null>(null);
  const [isB2B, setIsB2B] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedWeek, setSelectedWeek] = useState<string>('all'); // 'all', or index as string '0', '1'...
  
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    title: string;
    value: string;
  }>({ show: false, x: 0, y: 0, title: '', value: '' });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const response = await fetch(`/api/stats?brandId=${brandId}&r=${refreshKey}`);
        const json = await response.json();
        
        if (json.success) {
          if (json.isEmpty || !json.data || (Array.isArray(json.data) && json.data.length === 0)) {
            setIsEmpty(true);
          } else if (json.data.isB2B) {
            setIsB2B(true);
            setB2bData(json.data);
            setIsEmpty(false);
          } else {
            setIsB2B(false);
            setB2cData(json.data);
            setIsEmpty(false);
          }
        } else {
          setIsEmpty(true);
        }
      } catch (err) {
        console.error("Error fetching statistics data:", err);
        setIsEmpty(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [brandId, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatPercent = (num: number) => {
    return num.toFixed(2).replace('.', ',') + '%';
  };

  const handleMouseMove = (e: React.MouseEvent, title: string, value: string) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + 15;
    const y = e.clientY - rect.top - 40;
    setTooltip({
      show: true,
      x,
      y,
      title,
      value
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  // Memoized B2C Calculations based on selected week
  const activeB2CData = useMemo(() => {
    if (isB2B || b2cData.length === 0) return null;
    
    if (selectedWeek === 'all') {
      // Aggregate data from all weeks
      const totalIngresos = b2cData.reduce((acc, curr) => acc + (curr.resumenGeneral?.ingresos || 0), 0);
      const totalInversion = b2cData.reduce((acc, curr) => acc + (curr.resumenGeneral?.inversion || 0), 0);
      const totalUtilidad = totalIngresos - totalInversion;
      const totalMensajes = b2cData.reduce((acc, curr) => {
        return acc + (curr.metaAds || []).reduce((sum, ad) => sum + ad.mensajes, 0);
      }, 0);
      const totalServicios = b2cData.reduce((acc, curr) => {
        return acc + (curr.resumenCiudad || []).reduce((sum, res) => sum + res.serviciosProducto, 0);
      }, 0);
      const totalEfectivos = b2cData.reduce((acc, curr) => {
        return acc + (curr.resumenCiudad || []).reduce((sum, res) => sum + res.serviciosEfectivos, 0);
      }, 0);

      // Unique regions and products aggregation
      const regionsMap: Record<string, { mensajes: number, inversion: number }> = {};
      b2cData.forEach(w => {
        (w.metaAds || []).forEach(ad => {
          if (!regionsMap[ad.region]) regionsMap[ad.region] = { mensajes: 0, inversion: 0 };
          regionsMap[ad.region].mensajes += ad.mensajes;
          regionsMap[ad.region].inversion += ad.inversion;
        });
      });

      const metaAdsAgg = Object.entries(regionsMap).map(([region, val]) => ({
        region,
        mensajes: val.mensajes,
        inversion: val.inversion,
        costoMensaje: val.mensajes > 0 ? Math.round(val.inversion / val.mensajes) : 0
      }));

      return {
        week: "Acumulado",
        resumenGeneral: {
          ingresos: totalIngresos,
          inversion: totalInversion,
          utilidad: totalUtilidad,
          roas: totalInversion > 0 ? parseFloat((totalIngresos / totalInversion).toFixed(2)) : 0
        },
        metaAds: metaAdsAgg,
        resumenCiudad: [{
          ciudad: "General",
          region: "Total",
          serviciosProducto: totalServicios,
          serviciosEfectivos: totalEfectivos,
          ingresos: totalIngresos,
          inversion: totalInversion,
          mensajes: totalMensajes,
          cpa: totalEfectivos > 0 ? Math.round(totalInversion / totalEfectivos) : 0,
          roas: totalInversion > 0 ? parseFloat((totalIngresos / totalInversion).toFixed(2)) : 0,
          bitacoraVentas: totalEfectivos,
          conversion: totalMensajes > 0 ? parseFloat(((totalEfectivos / totalMensajes) * 100).toFixed(2)) : 0
        }],
        desgloseProducto: b2cData.reduce<DesgloseProducto[]>((acc, curr) => {
          (curr.desgloseProducto || []).forEach(prod => {
            const existing = acc.find(p => p.producto === prod.producto);
            if (existing) {
              existing.serviciosProducto += prod.serviciosProducto;
              existing.serviciosEfectivos += prod.serviciosEfectivos;
              existing.ingresos += prod.ingresos;
              existing.inversion += prod.inversion;
            } else {
              acc.push({ ...prod });
            }
          });
          return acc;
        }, []).map(p => ({
          ...p,
          cpa: p.serviciosEfectivos > 0 ? Math.round(p.inversion / p.serviciosEfectivos) : 0,
          roas: p.inversion > 0 ? parseFloat((p.ingresos / p.inversion).toFixed(2)) : 0
        }))
      };
    } else {
      const idx = parseInt(selectedWeek);
      return b2cData[idx] || null;
    }
  }, [b2cData, selectedWeek, isB2B]);

  // Find best performing B2B region (lowest Cost per Message)
  const bestB2BRegion = useMemo(() => {
    if (!isB2B || !b2bData || b2bData.regiones.length === 0) return null;
    const withMessages = b2bData.regiones.filter(r => r.mensajes > 0 && r.inversion > 1000);
    if (withMessages.length === 0) return null;
    return withMessages.reduce((best, curr) => curr.costoMensaje < best.costoMensaje ? curr : best, withMessages[0]);
  }, [b2bData, isB2B]);

  // Handle CSS brand color token
  const brandStyles = {
    '--brand-color': brandColor
  } as React.CSSProperties;

  if (viewMode === 'spreadsheet' && statsSheetUrl) {
    return (
      <div className={styles.container} style={brandStyles}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <span className={styles.titleIcon}>✏️</span>
            <div>
              <h2>Editar Planilla de Origen</h2>
              <p>Modifica los datos directamente en la hoja de cálculo de Google Drive</p>
            </div>
          </div>
          <div className={styles.viewToggleContainer}>
            <button 
              className={styles.toggleBtn}
              onClick={() => setViewMode('charts')}
            >
              <LayoutDashboard size={16} /> Gráficos
            </button>
            <button 
              className={`${styles.toggleBtn} ${styles.toggleBtnActive}`}
              onClick={() => setViewMode('spreadsheet')}
            >
              <Edit3 size={16} /> Editar Datos
            </button>
          </div>
        </div>
        <div className={styles.iframeWrapper}>
          <iframe 
            src={statsSheetUrl}
            className={styles.iframe}
            title="Google Sheets Editor"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} style={brandStyles} ref={containerRef}>
      {/* Tooltip Component */}
      {tooltip.show && (
        <div 
          className={styles.tooltip} 
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          <div className={styles.tooltipTitle}>{tooltip.title}</div>
          <div className={styles.tooltipValue}>{tooltip.value}</div>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.titleIcon}>📊</span>
          <div>
            <h2>Métricas y Estadísticas Comerciales</h2>
            <p>Análisis de efectividad, inversión publicitaria Meta Ads y embudo comercial</p>
          </div>
        </div>

        <div className={styles.controls}>
          <button 
            onClick={handleRefresh}
            className={styles.select}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Actualizar datos desde Google Sheets"
          >
            <RefreshCw size={14} className={loading ? styles.spinner : ''} />
            Actualizar
          </button>

          {statsSheetUrl && canEdit && (
            <div className={styles.viewToggleContainer}>
              <button 
                className={`${styles.toggleBtn} ${viewMode === 'charts' ? styles.toggleBtnActive : ''}`}
                onClick={() => setViewMode('charts')}
              >
                <LayoutDashboard size={16} /> Gráficos
              </button>
              <button 
                className={`${styles.toggleBtn} ${viewMode === 'spreadsheet' ? styles.toggleBtnActive : ''}`}
                onClick={() => setViewMode('spreadsheet')}
              >
                <Edit3 size={16} /> Editar Datos
              </button>
            </div>
          )}

          {!isB2B && !isEmpty && b2cData.length > 0 && (
            <select 
              value={selectedWeek} 
              onChange={(e) => setSelectedWeek(e.target.value)}
              className={styles.select}
            >
              <option value="all">Ver Acumulado Total</option>
              {b2cData.map((w, idx) => (
                <option key={idx} value={String(idx)}>{w.week}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando información estadística desde Google Sheets...</p>
        </div>
      ) : isEmpty ? (
        <div className={styles.emptyStateContainer}>
          <span className={styles.emptyStateIcon}>📂</span>
          <h3 className={styles.emptyStateTitle}>Aún no hay datos de estadísticas</h3>
          <p className={styles.emptyStateDesc}>
            La planilla de Google Sheets está vacía o no tiene el formato esperado. 
            Copia los datos de reporte a la planilla para habilitar el dashboard interactivo de gráficos.
          </p>
          {statsSheetUrl && canEdit && (
            <button 
              className={styles.emptyStateBtn} 
              style={{ backgroundColor: brandColor }}
              onClick={() => setViewMode('spreadsheet')}
            >
              ✏️ Llenar Planilla en Google Sheets
            </button>
          )}
        </div>
      ) : isB2B && b2bData ? (
        /* ==================== B2B DASHBOARD LAYOUT (PrinterService) ==================== */
        <div>
          {/* B2B KPI Cards */}
          <div className={styles.kpiGrid}>
            <div className={`${styles.kpiCard} ${styles.kpiCardCustom1}`}>
              <span className={styles.kpiLabel}>Inversión Publicitaria</span>
              <span className={styles.kpiValue} style={{ color: '#10b981' }}>
                {formatCOP(b2bData.resumenGeneral.inversion)}
              </span>
              <span className={styles.kpiSub}>Invertido en Meta Ads este mes</span>
            </div>

            <div className={`${styles.kpiCard} ${styles.kpiCardCustom3}`}>
              <span className={styles.kpiLabel}>Conversaciones Totales</span>
              <span className={styles.kpiValue} style={{ color: '#3b82f6' }}>
                {b2bData.resumenGeneral.mensajes.toLocaleString()}
              </span>
              <span className={styles.kpiSub}>Chats iniciados en WhatsApp</span>
            </div>

            <div className={`${styles.kpiCard} ${styles.kpiCardCustom2}`}>
              <span className={styles.kpiLabel}>Costo por Conversación</span>
              <span className={styles.kpiValue} style={{ color: '#e6a817' }}>
                {formatCOP(b2bData.resumenGeneral.costoMensaje)}
              </span>
              <span className={styles.kpiSub}>CPA promedio por chat</span>
            </div>

            {bestB2BRegion && (
              <div className={`${styles.kpiCard} ${styles.kpiCardCustom4}`}>
                <span className={styles.kpiLabel}>Región Más Eficiente</span>
                <span className={styles.kpiValue} style={{ color: '#8b5cf6', fontSize: '1.25rem', padding: '0.2rem 0' }}>
                  {bestB2BRegion.region}
                </span>
                <span className={styles.kpiSub}>
                  Costo: <span className={styles.trendUp}>{formatCOP(bestB2BRegion.costoMensaje)}</span> / chat
                </span>
              </div>
            )}
          </div>

          {/* B2B Charts and Tables */}
          <div className={styles.chartsGrid}>
            {/* Chart 1: Inversión por Región (Top 5) */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h3>Inversión por Región (Top 5)</h3>
                  <p>Distribución geográfica de la inversión publicitaria en COP</p>
                </div>
                <BarChart3 size={20} style={{ color: '#64748b' }} />
              </div>

              <div className={styles.chartBody}>
                {(() => {
                  const topRegiones = b2bData.regiones.slice(0, 5);
                  const maxInversion = Math.max(...topRegiones.map(r => r.inversion), 1);
                  return (
                    <svg viewBox="0 0 400 240" className={styles.svgContainer}>
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                        <line 
                          key={idx}
                          x1="80" 
                          y1={30 + ratio * 150} 
                          x2="380" 
                          y2={30 + ratio * 150} 
                          className={styles.gridLine} 
                        />
                      ))}
                      
                      <line x1="80" y1="180" x2="380" y2="180" className={styles.axisLine} />
                      <line x1="80" y1="30" x2="80" y2="180" className={styles.axisLine} />

                      {topRegiones.map((r, idx) => {
                        const widthRatio = (r.inversion / maxInversion) * 140;
                        const barHeight = 18;
                        const yPos = 40 + idx * 28;

                        return (
                          <g key={idx}>
                            {/* Region Label */}
                            <text 
                              x="75" 
                              y={yPos + 12} 
                              textAnchor="end" 
                              className={styles.chartLabel}
                              style={{ fontSize: '9px', fontWeight: 600 }}
                            >
                              {r.region.length > 13 ? r.region.slice(0, 11) + '..' : r.region}
                            </text>
                            
                            {/* Bar */}
                            <rect 
                              x="80" 
                              y={yPos} 
                              width={widthRatio} 
                              height={barHeight} 
                              fill={brandColor} 
                              rx="3"
                              className={styles.chartBar}
                              onMouseMove={(e) => handleMouseMove(e, r.region, `Inversión: ${formatCOP(r.inversion)} (${r.mensajes} chats)`)}
                              onMouseLeave={handleMouseLeave}
                            />
                          </g>
                        );
                      })}
                      
                      <text x="80" y="198" textAnchor="start" className={styles.chartLabel}>$0</text>
                      <text x="230" y="198" textAnchor="middle" className={styles.chartLabel}>{formatCOP(Math.round(maxInversion / 2))}</text>
                      <text x="380" y="198" textAnchor="end" className={styles.chartLabel}>{formatCOP(maxInversion)}</text>
                    </svg>
                  );
                })()}
              </div>
            </div>

            {/* Chart 2: Conversaciones por Región (Top 5) */}
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h3>Chats de WhatsApp (Top 5)</h3>
                  <p>Cantidad de conversaciones generadas por área geográfica</p>
                </div>
                <Users size={20} style={{ color: '#64748b' }} />
              </div>

              <div className={styles.chartBody}>
                {(() => {
                  const sortedByChats = [...b2bData.regiones].sort((a, b) => b.mensajes - a.mensajes);
                  const topRegiones = sortedByChats.slice(0, 5);
                  const maxChats = Math.max(...topRegiones.map(r => r.mensajes), 1);
                  return (
                    <svg viewBox="0 0 400 240" className={styles.svgContainer}>
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                        <line 
                          key={idx}
                          x1="80" 
                          y1={30 + ratio * 150} 
                          x2="380" 
                          y2={30 + ratio * 150} 
                          className={styles.gridLine} 
                        />
                      ))}
                      
                      <line x1="80" y1="180" x2="380" y2="180" className={styles.axisLine} />
                      <line x1="80" y1="30" x2="80" y2="180" className={styles.axisLine} />

                      {topRegiones.map((r, idx) => {
                        const widthRatio = (r.mensajes / maxChats) * 140;
                        const barHeight = 18;
                        const yPos = 40 + idx * 28;

                        return (
                          <g key={idx}>
                            <text 
                              x="75" 
                              y={yPos + 12} 
                              textAnchor="end" 
                              className={styles.chartLabel}
                              style={{ fontSize: '9px', fontWeight: 600 }}
                            >
                              {r.region.length > 13 ? r.region.slice(0, 11) + '..' : r.region}
                            </text>
                            
                            <rect 
                              x="80" 
                              y={yPos} 
                              width={widthRatio} 
                              height={barHeight} 
                              fill="#3b82f6" 
                              rx="3"
                              className={styles.chartBar}
                              onMouseMove={(e) => handleMouseMove(e, r.region, `${r.mensajes} chats generados (Inversión: ${formatCOP(r.inversion)})`)}
                              onMouseLeave={handleMouseLeave}
                            />
                          </g>
                        );
                      })}
                      
                      <text x="80" y="198" textAnchor="start" className={styles.chartLabel}>0</text>
                      <text x="230" y="198" textAnchor="middle" className={styles.chartLabel}>{Math.round(maxChats / 2)} chats</text>
                      <text x="380" y="198" textAnchor="end" className={styles.chartLabel}>{maxChats} chats</text>
                    </svg>
                  );
                })()}
              </div>
            </div>

            {/* Regional breakdown detailed table */}
            <div className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
              <div className={styles.chartHeader}>
                <div>
                  <h3>Desglose de Rendimiento Geográfico Completo</h3>
                  <p>Inversión, volumen de mensajes y CPA exacto de todas las regiones activas</p>
                </div>
                <MapPin size={20} style={{ color: '#64748b' }} />
              </div>
              
              <div className={styles.tableContainer}>
                <table className={styles.regionsTable}>
                  <thead>
                    <tr>
                      <th>Ubicación / Región</th>
                      <th>Inversión (COP)</th>
                      <th>Mensajes / Chats</th>
                      <th>Costo por Chat (CPA)</th>
                      <th>Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b2bData.regiones.map((r, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{r.region}</td>
                        <td style={{ color: '#10b981', fontWeight: 500 }}>{formatCOP(r.inversion)}</td>
                        <td>{r.mensajes}</td>
                        <td style={{ color: '#e6a817', fontWeight: 600 }}>{formatCOP(r.costoMensaje)}</td>
                        <td>
                          {bestB2BRegion && r.region === bestB2BRegion.region ? (
                            <span className={styles.bestPerfomer}>Mejor Rendimiento</span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Estable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== B2C DASHBOARD LAYOUT (Weekly/Standard) ==================== */
        activeB2CData && (
          <div>
            {/* B2C KPI Cards */}
            <div className={styles.kpiGrid}>
              <div className={`${styles.kpiCard} ${styles.kpiCardCustom1}`}>
                <span className={styles.kpiLabel}>Ingresos Generados</span>
                <span className={styles.kpiValue} style={{ color: '#10b981' }}>
                  {formatCOP(activeB2CData.resumenGeneral.ingresos)}
                </span>
                <span className={styles.kpiSub}>Facturación en servicios</span>
              </div>

              <div className={`${styles.kpiCard} ${styles.kpiCardCustom2}`}>
                <span className={styles.kpiLabel}>Inversión Publicitaria</span>
                <span className={styles.kpiValue} style={{ color: '#e6a817' }}>
                  {formatCOP(activeB2CData.resumenGeneral.inversion)}
                </span>
                <span className={styles.kpiSub}>Meta Ads (Instagram & FB)</span>
              </div>

              <div className={`${styles.kpiCard} ${styles.kpiCardCustom3}`}>
                <span className={styles.kpiLabel}>Utilidad Neta</span>
                <span className={styles.kpiValue} style={{ color: '#3b82f6' }}>
                  {formatCOP(activeB2CData.resumenGeneral.utilidad)}
                </span>
                <span className={styles.kpiSub}>Retorno operativo neto</span>
              </div>

              <div className={`${styles.kpiCard} ${styles.kpiCardCustom4}`}>
                <span className={styles.kpiLabel}>Multiplicador ROAS</span>
                <span className={styles.kpiValue} style={{ color: '#8b5cf6' }}>
                  {activeB2CData.resumenGeneral.roas.toFixed(2)}x
                </span>
                <span className={styles.kpiSub}>
                  {activeB2CData.resumenGeneral.roas >= 3.0 ? (
                    <span className={styles.trendUp}>Rendimiento Óptimo</span>
                  ) : activeB2CData.resumenGeneral.roas >= 2.0 ? (
                    <span style={{ color: '#e6a817', fontWeight: 600 }}>Estable</span>
                  ) : (
                    <span className={styles.trendDown}>Monitorear</span>
                  )}
                </span>
              </div>

              <div className={`${styles.kpiCard} ${styles.kpiCardCustom5}`}>
                <span className={styles.kpiLabel}>Tasa Conversión</span>
                <span className={styles.kpiValue} style={{ color: '#ec4899' }}>
                  {formatPercent(activeB2CData.resumenCiudad[0]?.conversion || 0)}
                </span>
                <span className={styles.kpiSub}>Mensajes a ventas efectivas</span>
              </div>

              <div className={`${styles.kpiCard} ${styles.kpiCardCustom6}`}>
                <span className={styles.kpiLabel}>Chats de Clientes</span>
                <span className={styles.kpiValue} style={{ color: '#06b6d4' }}>
                  {activeB2CData.metaAds.reduce((acc, curr) => acc + curr.mensajes, 0)}
                </span>
                <span className={styles.kpiSub}>Total consultas recibidas</span>
              </div>
            </div>

            {/* B2C Charts Grid */}
            <div className={styles.chartsGrid}>
              
              {/* Chart 1: Financial Flow Bar Chart */}
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div>
                    <h3>Flujo Financiero por Semana</h3>
                    <p>Relación de Ingresos, Inversión y Utilidad en COP</p>
                  </div>
                  <BarChart3 size={20} style={{ color: '#64748b' }} />
                </div>

                <div className={styles.chartBody}>
                  {selectedWeek === 'all' && b2cData.length > 1 ? (
                    (() => {
                      const maxVal = Math.max(...b2cData.map(w => Math.max(w.resumenGeneral?.ingresos || 0, w.resumenGeneral?.inversion || 0)), 1);
                      return (
                        <svg viewBox="0 0 400 240" className={styles.svgContainer}>
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                            <line 
                              key={idx}
                              x1="45" 
                              y1={30 + ratio * 150} 
                              x2="380" 
                              y2={30 + ratio * 150} 
                              className={styles.gridLine} 
                            />
                          ))}
                          
                          <line x1="45" y1="180" x2="380" y2="180" className={styles.axisLine} />
                          <line x1="45" y1="30" x2="45" y2="180" className={styles.axisLine} />
                          
                          {b2cData.slice(0, 3).map((w, wIdx) => {
                            const ingH = ((w.resumenGeneral?.ingresos || 0) / maxVal) * 140;
                            const invH = ((w.resumenGeneral?.inversion || 0) / maxVal) * 140;
                            const utiH = ((w.resumenGeneral?.utilidad || 0) / maxVal) * 140;
                            
                            const groupOffset = 50 + wIdx * 110;

                            return (
                              <g key={wIdx}>
                                {/* Ingreso Bar */}
                                <rect 
                                  x={groupOffset} 
                                  y={180 - ingH} 
                                  width="18" 
                                  height={ingH} 
                                  fill="#10b981" 
                                  rx="3"
                                  className={styles.chartBar}
                                  onMouseMove={(e) => handleMouseMove(e, `Ingresos - ${w.week}`, formatCOP(w.resumenGeneral?.ingresos))}
                                  onMouseLeave={handleMouseLeave}
                                />
                                {/* Inversion Bar */}
                                <rect 
                                  x={groupOffset + 21} 
                                  y={180 - invH} 
                                  width="18" 
                                  height={invH} 
                                  fill="#f1c40f" 
                                  rx="3"
                                  className={styles.chartBar}
                                  onMouseMove={(e) => handleMouseMove(e, `Inversión - ${w.week}`, formatCOP(w.resumenGeneral?.inversion))}
                                  onMouseLeave={handleMouseLeave}
                                />
                                {/* Utilidad Bar */}
                                <rect 
                                  x={groupOffset + 42} 
                                  y={180 - utiH} 
                                  width="18" 
                                  height={utiH} 
                                  fill="#3b82f6" 
                                  rx="3"
                                  className={styles.chartBar}
                                  onMouseMove={(e) => handleMouseMove(e, `Utilidad - ${w.week}`, formatCOP(w.resumenGeneral?.utilidad))}
                                  onMouseLeave={handleMouseLeave}
                                />
                                <text x={groupOffset + 30} y="196" textAnchor="middle" className={styles.chartLabel} style={{ fontSize: '8px' }}>
                                  {w.week.length > 14 ? w.week.slice(0, 12) + '..' : w.week}
                                </text>
                              </g>
                            );
                          })}

                          <text x="40" y="180" textAnchor="end" className={styles.chartLabel}>$0</text>
                          <text x="40" y="110" textAnchor="end" className={styles.chartLabel}>{formatCOP(Math.round(maxVal / 2))}</text>
                          <text x="40" y="40" textAnchor="end" className={styles.chartLabel}>{formatCOP(maxVal)}</text>
                        </svg>
                      );
                    })()
                  ) : (
                    (() => {
                      const maxVal = Math.max(activeB2CData.resumenGeneral.ingresos, activeB2CData.resumenGeneral.inversion, 1);
                      const ingH = (activeB2CData.resumenGeneral.ingresos / maxVal) * 140;
                      const invH = (activeB2CData.resumenGeneral.inversion / maxVal) * 140;
                      const utiH = (activeB2CData.resumenGeneral.utilidad / maxVal) * 140;

                      return (
                        <svg viewBox="0 0 400 240" className={styles.svgContainer}>
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                            <line 
                              key={idx}
                              x1="45" 
                              y1={30 + ratio * 150} 
                              x2="380" 
                              y2={30 + ratio * 150} 
                              className={styles.gridLine} 
                            />
                          ))}
                          
                          <line x1="45" y1="180" x2="380" y2="180" className={styles.axisLine} />
                          <line x1="45" y1="30" x2="45" y2="180" className={styles.axisLine} />
                          
                          {/* Ingreso Bar */}
                          <rect 
                            x="100" 
                            y={180 - ingH} 
                            width="40" 
                            height={ingH} 
                            fill="#10b981" 
                            rx="5"
                            className={styles.chartBar}
                            onMouseMove={(e) => handleMouseMove(e, "Ingresos", formatCOP(activeB2CData.resumenGeneral.ingresos))}
                            onMouseLeave={handleMouseLeave}
                          />
                          <text x="120" y="196" textAnchor="middle" className={styles.chartLabel}>Ingresos</text>

                          {/* Inversion Bar */}
                          <rect 
                            x="180" 
                            y={180 - invH} 
                            width="40" 
                            height={invH} 
                            fill="#f1c40f" 
                            rx="5"
                            className={styles.chartBar}
                            onMouseMove={(e) => handleMouseMove(e, "Inversión", formatCOP(activeB2CData.resumenGeneral.inversion))}
                            onMouseLeave={handleMouseLeave}
                          />
                          <text x="200" y="196" textAnchor="middle" className={styles.chartLabel}>Inversión</text>

                          {/* Utilidad Bar */}
                          <rect 
                            x="260" 
                            y={180 - utiH} 
                            width="40" 
                            height={utiH} 
                            fill="#3b82f6" 
                            rx="5"
                            className={styles.chartBar}
                            onMouseMove={(e) => handleMouseMove(e, "Utilidad", formatCOP(activeB2CData.resumenGeneral.utilidad))}
                            onMouseLeave={handleMouseLeave}
                          />
                          <text x="280" y="196" textAnchor="middle" className={styles.chartLabel}>Utilidad</text>

                          <text x="40" y="180" textAnchor="end" className={styles.chartLabel}>$0</text>
                          <text x="40" y="110" textAnchor="end" className={styles.chartLabel}>{formatCOP(Math.round(maxVal / 2))}</text>
                          <text x="40" y="40" textAnchor="end" className={styles.chartLabel}>{formatCOP(maxVal)}</text>
                        </svg>
                      );
                    })()
                  )}
                </div>
                
                <div className={styles.chartLegend}>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></div>
                    <span>Ingresos</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#f1c40f' }}></div>
                    <span>Inversión</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }}></div>
                    <span>Utilidad Neta</span>
                  </div>
                </div>
              </div>

              {/* Chart 2: Embudo de Conversión (Funnel) */}
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <div>
                    <h3>Embudo de Conversión Comercial</h3>
                    <p>Relación de chats recibidos a visitas programadas y efectivas</p>
                  </div>
                  <TrendingUp size={20} style={{ color: '#64748b' }} />
                </div>

                <div className={styles.chartBody} style={{ alignItems: 'center' }}>
                  {(() => {
                    const chats = activeB2CData.metaAds.reduce((acc, curr) => acc + curr.mensajes, 0);
                    const agendados = activeB2CData.resumenCiudad.reduce((acc, curr) => acc + curr.serviciosProducto, 0);
                    const efectivos = activeB2CData.resumenCiudad.reduce((acc, curr) => acc + curr.serviciosEfectivos, 0);

                    const agendadosPct = chats > 0 ? (agendados / chats) * 100 : 0;
                    const efectivosPct = agendados > 0 ? (efectivos / agendados) * 100 : 0;
                    const conversionGral = chats > 0 ? (efectivos / chats) * 100 : 0;

                    return (
                      <div className={styles.funnelWrapper}>
                        <div className={styles.funnelStage}>
                          <div className={styles.stageLabel}>💬 Chats Recibidos</div>
                          <div className={styles.stageBarContainer}>
                            <div 
                              className={styles.stageBar} 
                              style={{ width: '100%', backgroundColor: '#06b6d4' }}
                              onMouseMove={(e) => handleMouseMove(e, "Chats Meta Ads", `${chats} mensajes generados`)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <span className={styles.stageValue}>{chats}</span>
                            </div>
                          </div>
                          <span className={styles.stagePct}>100%</span>
                        </div>

                        <div className={styles.funnelStage}>
                          <div className={styles.stageLabel}>🗓️ Visitas Planificadas</div>
                          <div className={styles.stageBarContainer}>
                            <div 
                              className={styles.stageBar} 
                              style={{ width: `${Math.max(agendadosPct, 15)}%`, backgroundColor: '#e6a817' }}
                              onMouseMove={(e) => handleMouseMove(e, "Tasa de Agendamiento", `${agendados} servicios planificados (${agendadosPct.toFixed(1)}% de los chats)`)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <span className={styles.stageValue}>{agendados}</span>
                            </div>
                          </div>
                          <span className={styles.stagePct}>{agendadosPct.toFixed(1)}%</span>
                        </div>

                        <div className={styles.funnelStage}>
                          <div className={styles.stageLabel}>✅ Visitas Efectivas</div>
                          <div className={styles.stageBarContainer}>
                            <div 
                              className={styles.stageBar} 
                              style={{ width: `${Math.max(conversionGral * 4, 10)}%`, backgroundColor: '#10b981' }}
                              onMouseMove={(e) => handleMouseMove(e, "Conversión de Venta", `${efectivos} servicios efectivos cobrados (${efectivosPct.toFixed(1)}% de los planificados)`)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <span className={styles.stageValue}>{efectivos}</span>
                            </div>
                          </div>
                          <span className={styles.stagePct}>{conversionGral.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Chart 3: Desglose por Servicio / Producto */}
              {activeB2CData.desgloseProducto && activeB2CData.desgloseProducto.length > 0 && (
                <div className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
                  <div className={styles.chartHeader}>
                    <div>
                      <h3>Desglose de Ventas por Tipo de Servicio</h3>
                      <p>Ingresos y efectividad agrupados por producto</p>
                    </div>
                    <PieChart size={20} style={{ color: '#64748b' }} />
                  </div>

                  <div className={styles.chartBody} style={{ minHeight: 'auto' }}>
                    <div className={styles.productGrid}>
                      {activeB2CData.desgloseProducto.map((p, idx) => {
                        const getProductColor = (name: string) => {
                          switch (name.toLowerCase()) {
                            case 'premium': return '#a855f7';
                            case 'standar':
                            case 'standard': return '#3b82f6';
                            case 'basico':
                            case 'básico': return '#f1c40f';
                            case 'revision':
                            case 'revisión': return '#94a3b8';
                            default: return brandColor || '#10b981';
                          }
                        };

                        const color = getProductColor(p.producto);
                        const efPct = p.serviciosProducto > 0 ? (p.serviciosEfectivos / p.serviciosProducto) * 100 : 0;

                        return (
                          <div key={idx} className={styles.productRow}>
                            <div className={styles.productNameInfo}>
                              <div className={styles.productColorDot} style={{ backgroundColor: color }}></div>
                              <span className={styles.productName}>Servicio {p.producto}</span>
                            </div>
                            
                            <div className={styles.productStats}>
                              <div className={styles.productStat}>
                                <span className={styles.productStatLabel}>Ingresos</span>
                                <div className={styles.productStatValue} style={{ color: '#10b981' }}>{formatCOP(p.ingresos)}</div>
                              </div>

                              <div className={styles.productStat}>
                                <span className={styles.productStatLabel}>Inversión</span>
                                <div className={styles.productStatValue} style={{ color: '#e6a817' }}>{formatCOP(p.inversion)}</div>
                              </div>

                              <div className={styles.productStat}>
                                <span className={styles.productStatLabel}>Eficiencia</span>
                                <div className={styles.productStatValue}>
                                  {p.serviciosEfectivos} / {p.serviciosProducto} ({efPct.toFixed(0)}%)
                                </div>
                              </div>

                              <div className={styles.productStat}>
                                <span className={styles.productStatLabel}>ROAS</span>
                                <div className={styles.productStatValue} style={{ color: '#8b5cf6' }}>{p.roas.toFixed(2)}x</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )
      )}
    </div>
  );
}
