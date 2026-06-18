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
  HelpCircle
} from 'lucide-react';
import styles from './ProMascotasStats.module.css';

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

export default function ProMascotasStats() {
  const [data, setData] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWeek, setSelectedWeek] = useState<string>('all'); // 'all', or index as string '0', '1'
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
      try {
        const response = await fetch('/api/promascotas/stats');
        const json = await response.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Error fetching statistics data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

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

  // Memoized calculations based on selected option
  const activeData = useMemo(() => {
    if (data.length === 0) return null;
    
    if (selectedWeek === 'all') {
      // Aggregate data from all weeks
      const totalIngresos = data.reduce((acc, curr) => acc + (curr.resumenGeneral?.ingresos || 0), 0);
      const totalInversion = data.reduce((acc, curr) => acc + (curr.resumenGeneral?.inversion || 0), 0);
      const totalUtilidad = totalIngresos - totalInversion;
      const totalMensajes = data.reduce((acc, curr) => {
        return acc + curr.metaAds.reduce((sum, ad) => sum + ad.mensajes, 0);
      }, 0);
      const totalServicios = data.reduce((acc, curr) => {
        return acc + curr.resumenCiudad.reduce((sum, res) => sum + res.serviciosProducto, 0);
      }, 0);
      const totalEfectivos = data.reduce((acc, curr) => {
        return acc + curr.resumenCiudad.reduce((sum, res) => sum + res.serviciosEfectivos, 0);
      }, 0);

      // Unique regions and products
      const regionsMap: Record<string, { mensajes: number, inversion: number }> = {};
      data.forEach(w => {
        w.metaAds.forEach(ad => {
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
          ciudad: "Bogotá & Alrededores",
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
        desgloseProducto: data.reduce<DesgloseProducto[]>((acc, curr) => {
          curr.desgloseProducto.forEach(prod => {
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
      return data[idx] || null;
    }
  }, [data, selectedWeek]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando análisis de ProMascotas...</p>
      </div>
    );
  }

  if (data.length === 0 || !activeData) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: 'center', color: '#94a3b8' }}>No hay datos estadísticos disponibles en este momento.</p>
      </div>
    );
  }

  // Calculate some display parameters for Custom Charts
  const maxIngresos = Math.max(...data.map(w => w.resumenGeneral?.ingresos || 0), 1);
  const maxInversion = Math.max(...data.map(w => w.resumenGeneral?.inversion || 0), 1);
  const maxVal = Math.max(maxIngresos, maxInversion);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Tooltip component */}
      {tooltip.show && (
        <div 
          className={styles.tooltip} 
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          <div className={styles.tooltipTitle}>{tooltip.title}</div>
          <div className={styles.tooltipValue}>{tooltip.value}</div>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.titleIcon}>📊</span>
          <div>
            <h2>Métricas de Rendimiento ProMascotas</h2>
            <p>Análisis de canales, inversión publicitaria Meta Ads y efectividad de visitas</p>
          </div>
        </div>

        <div className={styles.controls}>
          <select 
            value={selectedWeek} 
            onChange={(e) => setSelectedWeek(e.target.value)}
            className={styles.select}
          >
            <option value="all">Ver Acumulado Total</option>
            {data.map((w, idx) => (
              <option key={idx} value={String(idx)}>{w.week}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiCardIngresos}`}>
          <span className={styles.kpiLabel}>Ingresos Generados</span>
          <span className={styles.kpiValue} style={{ color: '#10b981' }}>
            {formatCOP(activeData.resumenGeneral.ingresos)}
          </span>
          <span className={styles.kpiSub}>
            Facturación en servicios
          </span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardInversion}`}>
          <span className={styles.kpiLabel}>Inversión Publicitaria</span>
          <span className={styles.kpiValue} style={{ color: '#e6a817' }}>
            {formatCOP(activeData.resumenGeneral.inversion)}
          </span>
          <span className={styles.kpiSub}>
            Meta Ads (Instagram & FB)
          </span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardUtilidad}`}>
          <span className={styles.kpiLabel}>Utilidad Neto</span>
          <span className={styles.kpiValue} style={{ color: '#3b82f6' }}>
            {formatCOP(activeData.resumenGeneral.utilidad)}
          </span>
          <span className={styles.kpiSub}>
            Retorno operativo neto
          </span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardRoas}`}>
          <span className={styles.kpiLabel}>Multiplicador ROAS</span>
          <span className={styles.kpiValue} style={{ color: '#8b5cf6' }}>
            {activeData.resumenGeneral.roas.toFixed(2)}x
          </span>
          <span className={styles.kpiSub}>
            {activeData.resumenGeneral.roas >= 3.0 ? (
              <span className={styles.trendUp}>Rendimiento Óptimo</span>
            ) : activeData.resumenGeneral.roas >= 2.0 ? (
              <span style={{ color: '#e6a817', fontWeight: 600 }}>Rendimiento Estable</span>
            ) : (
              <span className={styles.trendDown}>Monitorear</span>
            )}
          </span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardConversion}`}>
          <span className={styles.kpiLabel}>Tasa Conversión</span>
          <span className={styles.kpiValue} style={{ color: '#ec4899' }}>
            {formatPercent(activeData.resumenCiudad[0]?.conversion || 0)}
          </span>
          <span className={styles.kpiSub}>
            Mensajes a ventas efectivas
          </span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCardMensajes}`}>
          <span className={styles.kpiLabel}>Chats de Clientes</span>
          <span className={styles.kpiValue} style={{ color: '#06b6d4' }}>
            {activeData.metaAds.reduce((acc, curr) => acc + curr.mensajes, 0)}
          </span>
          <span className={styles.kpiSub}>
            Total consultas recibidas
          </span>
        </div>
      </div>

      {/* SVG & Responsive HTML Charts */}
      <div className={styles.chartsGrid}>
        
        {/* Chart 1: Comparativo de Flujo Financiero Semanal */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3>Flujo Financiero por Semana</h3>
              <p>Relación de Ingresos, Inversión y Utilidad en COP</p>
            </div>
            <BarChart3 size={20} style={{ color: '#64748b' }} />
          </div>

          <div className={styles.chartBody}>
            {selectedWeek === 'all' ? (
              <svg viewBox="0 0 400 240" className={styles.svgContainer}>
                {/* Horizontal gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                  <line 
                    key={idx}
                    x1="40" 
                    y1={30 + ratio * 150} 
                    x2="380" 
                    y2={30 + ratio * 150} 
                    className={styles.gridLine} 
                  />
                ))}
                
                {/* Axes */}
                <line x1="40" y1="180" x2="380" y2="180" className={styles.axisLine} />
                <line x1="40" y1="30" x2="40" y2="180" className={styles.axisLine} />
                
                {/* Week 1 Bars */}
                {(() => {
                  const w1 = data[0];
                  if (!w1) return null;
                  const ingH = ((w1.resumenGeneral?.ingresos || 0) / maxVal) * 140;
                  const invH = ((w1.resumenGeneral?.inversion || 0) / maxVal) * 140;
                  const utiH = ((w1.resumenGeneral?.utilidad || 0) / maxVal) * 140;

                  return (
                    <g>
                      {/* Ingreso Bar */}
                      <rect 
                        x="75" 
                        y={180 - ingH} 
                        width="24" 
                        height={ingH} 
                        fill="#10b981" 
                        rx="4"
                        className={styles.chartBar}
                        onMouseMove={(e) => handleMouseMove(e, `Ingresos - ${w1.week}`, formatCOP(w1.resumenGeneral?.ingresos))}
                        onMouseLeave={handleMouseLeave}
                      />
                      {/* Inversion Bar */}
                      <rect 
                        x="104" 
                        y={180 - invH} 
                        width="24" 
                        height={invH} 
                        fill="#f1c40f" 
                        rx="4"
                        className={styles.chartBar}
                        onMouseMove={(e) => handleMouseMove(e, `Inversión - ${w1.week}`, formatCOP(w1.resumenGeneral?.inversion))}
                        onMouseLeave={handleMouseLeave}
                      />
                      {/* Utilidad Bar */}
                      <rect 
                        x="133" 
                        y={180 - utiH} 
                        width="24" 
                        height={utiH} 
                        fill="#3b82f6" 
                        rx="4"
                        className={styles.chartBar}
                        onMouseMove={(e) => handleMouseMove(e, `Utilidad - ${w1.week}`, formatCOP(w1.resumenGeneral?.utilidad))}
                        onMouseLeave={handleMouseLeave}
                      />
                      <text x="116" y="198" textAnchor="middle" className={styles.chartLabel}>Semana 1</text>
                    </g>
                  );
                })()}

                {/* Week 2 Bars */}
                {(() => {
                  const w2 = data[1];
                  if (!w2) return null;
                  const ingH = ((w2.resumenGeneral?.ingresos || 0) / maxVal) * 140;
                  const invH = ((w2.resumenGeneral?.inversion || 0) / maxVal) * 140;
                  const utiH = ((w2.resumenGeneral?.utilidad || 0) / maxVal) * 140;

                  return (
                    <g>
                      {/* Ingreso Bar */}
                      <rect 
                        x="245" 
                        y={180 - ingH} 
                        width="24" 
                        height={ingH} 
                        fill="#10b981" 
                        rx="4"
                        className={styles.chartBar}
                        onMouseMove={(e) => handleMouseMove(e, `Ingresos - ${w2.week}`, formatCOP(w2.resumenGeneral?.ingresos))}
                        onMouseLeave={handleMouseLeave}
                      />
                      {/* Inversion Bar */}
                      <rect 
                        x="274" 
                        y={180 - invH} 
                        width="24" 
                        height={invH} 
                        fill="#f1c40f" 
                        rx="4"
                        className={styles.chartBar}
                        onMouseMove={(e) => handleMouseMove(e, `Inversión - ${w2.week}`, formatCOP(w2.resumenGeneral?.inversion))}
                        onMouseLeave={handleMouseLeave}
                      />
                      {/* Utilidad Bar */}
                      <rect 
                        x="303" 
                        y={180 - utiH} 
                        width="24" 
                        height={utiH} 
                        fill="#3b82f6" 
                        rx="4"
                        className={styles.chartBar}
                        onMouseMove={(e) => handleMouseMove(e, `Utilidad - ${w2.week}`, formatCOP(w2.resumenGeneral?.utilidad))}
                        onMouseLeave={handleMouseLeave}
                      />
                      <text x="286" y="198" textAnchor="middle" className={styles.chartLabel}>Semana 2</text>
                    </g>
                  );
                })()}

                {/* Y-axis Labels */}
                <text x="35" y="180" textAnchor="end" className={styles.chartLabel}>$0</text>
                <text x="35" y="110" textAnchor="end" className={styles.chartLabel}>{formatCOP(Math.round(maxVal / 2))}</text>
                <text x="35" y="40" textAnchor="end" className={styles.chartLabel}>{formatCOP(maxVal)}</text>
              </svg>
            ) : (
              <svg viewBox="0 0 400 240" className={styles.svgContainer}>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                  <line 
                    key={idx}
                    x1="40" 
                    y1={30 + ratio * 150} 
                    x2="380" 
                    y2={30 + ratio * 150} 
                    className={styles.gridLine} 
                  />
                ))}
                
                <line x1="40" y1="180" x2="380" y2="180" className={styles.axisLine} />
                <line x1="40" y1="30" x2="40" y2="180" className={styles.axisLine} />
                
                {(() => {
                  const ingH = (activeData.resumenGeneral.ingresos / maxVal) * 140;
                  const invH = (activeData.resumenGeneral.inversion / maxVal) * 140;
                  const utiH = (activeData.resumenGeneral.utilidad / maxVal) * 140;

                  return (
                    <g>
                      {/* Ingreso Bar */}
                      <rect 
                        x="100" 
                        y={180 - ingH} 
                        width="40" 
                        height={ingH} 
                        fill="#10b981" 
                        rx="6"
                        className={styles.chartBar}
                        onMouseMove={(e) => handleMouseMove(e, "Ingresos", formatCOP(activeData.resumenGeneral.ingresos))}
                        onMouseLeave={handleMouseLeave}
                      />
                      <text x="120" y="198" textAnchor="middle" className={styles.chartLabel}>Ingresos</text>

                      {/* Inversion Bar */}
                      <rect 
                        x="180" 
                        y={180 - invH} 
                        width="40" 
                        height={invH} 
                        fill="#f1c40f" 
                        rx="6"
                        className={styles.chartBar}
                        onMouseMove={(e) => handleMouseMove(e, "Inversión publicitaria", formatCOP(activeData.resumenGeneral.inversion))}
                        onMouseLeave={handleMouseLeave}
                      />
                      <text x="200" y="198" textAnchor="middle" className={styles.chartLabel}>Inversión</text>

                      {/* Utilidad Bar */}
                      <rect 
                        x="260" 
                        y={180 - utiH} 
                        width="40" 
                        height={utiH} 
                        fill="#3b82f6" 
                        rx="6"
                        className={styles.chartBar}
                        onMouseMove={(e) => handleMouseMove(e, "Utilidad Neta", formatCOP(activeData.resumenGeneral.utilidad))}
                        onMouseLeave={handleMouseLeave}
                      />
                      <text x="280" y="198" textAnchor="middle" className={styles.chartLabel}>Utilidad</text>
                    </g>
                  );
                })()}

                <text x="35" y="180" textAnchor="end" className={styles.chartLabel}>$0</text>
                <text x="35" y="110" textAnchor="end" className={styles.chartLabel}>{formatCOP(Math.round(maxVal / 2))}</text>
                <text x="35" y="40" textAnchor="end" className={styles.chartLabel}>{formatCOP(maxVal)}</text>
              </svg>
            )}
          </div>
          
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></div>
              <span>Ingresos</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#f1c40f' }}></div>
              <span>Inversión publicitaria</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }}></div>
              <span>Utilidad Neta</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Funnel de Conversión (Chats -> Agendados -> Efectivos) */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3>Embudo de Conversión Comercial</h3>
              <p>Relación de chats publicitarios a visitas domiciliarias</p>
            </div>
            <TrendingUp size={20} style={{ color: '#64748b' }} />
          </div>

          <div className={styles.chartBody} style={{ alignItems: 'center' }}>
            {(() => {
              const chats = activeData.metaAds.reduce((acc, curr) => acc + curr.mensajes, 0);
              const agendados = activeData.resumenCiudad.reduce((acc, curr) => acc + curr.serviciosProducto, 0);
              const efectivos = activeData.resumenCiudad.reduce((acc, curr) => acc + curr.serviciosEfectivos, 0);

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
                        onMouseMove={(e) => handleMouseMove(e, "Chats Meta Ads", `${chats} mensajes generados en Meta Ads`)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <span className={styles.stageValue}>{chats}</span>
                      </div>
                    </div>
                    <span className={styles.stagePct}>100%</span>
                  </div>

                  <div className={styles.funnelStage}>
                    <div className={styles.stageLabel}>🗓️ Servicios Planificados</div>
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
                    <div className={styles.stageLabel}>✅ Servicios Efectivos</div>
                    <div className={styles.stageBarContainer}>
                      <div 
                        className={styles.stageBar} 
                        style={{ width: `${Math.max(conversionGral * 4, 10)}%`, backgroundColor: '#10b981' }}
                        onMouseMove={(e) => handleMouseMove(e, "Conversión de Venta", `${efectivos} servicios cobrados y realizados (${efectivosPct.toFixed(1)}% de los planificados)`)}
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

        {/* Chart 3: Distribución por Producto (Semana 2 / Acumulados) */}
        {activeData.desgloseProducto && activeData.desgloseProducto.length > 0 && (
          <div className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
            <div className={styles.chartHeader}>
              <div>
                <h3>Desglose de Ventas por Tipo de Servicio</h3>
                <p>Ingresos y efectividad agrupados por producto (Premium, Standard, Básico, Revisión)</p>
              </div>
              <PieChart size={20} style={{ color: '#64748b' }} />
            </div>

            <div className={styles.chartBody} style={{ minHeight: 'auto' }}>
              <div className={styles.productGrid}>
                {activeData.desgloseProducto.map((p, idx) => {
                  const getProductColor = (name: string) => {
                    switch (name.toLowerCase()) {
                      case 'premium': return '#a855f7'; // purple
                      case 'standar':
                      case 'standard': return '#3b82f6'; // blue
                      case 'basico': return '#f1c40f'; // yellow
                      case 'revision': return '#94a3b8'; // gray
                      default: return '#10b981';
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
  );
}
