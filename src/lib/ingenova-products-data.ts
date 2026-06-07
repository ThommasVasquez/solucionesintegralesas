export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: string;
  image: string;
  description: string;
  features: string[];
}

export const INGENOVA_PRODUCTS_DATA: Product[] = [
  // ── AGUA POTABLE ──
  {
    id: "uv-purikor-6gpm",
    name: "Sistema de Desinfección UV Purikor 6 GPM",
    category: "Agua Potable",
    subcategory: "Desinfección ultravioleta",
    price: "$1,285,000",
    image: "/images/ingenova/filtro-uv.webp",
    description: "Sistema de desinfección mediante luz ultravioleta de alta intensidad. Destruye hasta el 99.9% de bacterias, virus y microorganismos patógenos en el agua sin alterar su sabor ni añadir químicos residuales.",
    features: [
      "Cámara de contacto en acero inoxidable 304 de alta durabilidad",
      "Lámpara Philips de larga duración (hasta 9,000 horas de uso continuo)",
      "Controlador electrónico con alarma sonora y LED de advertencia por fallo de lámpara",
      "Presión máxima de operación de 125 PSI",
      "Ideal para desinfección de agua potable residencial y comercial mediana"
    ]
  },
  {
    id: "uv-altamira-12gpm",
    name: "Sistema de Desinfección UV Altamira 12 GPM",
    category: "Agua Potable",
    subcategory: "Desinfección ultravioleta",
    price: "$2,450,000",
    image: "/images/ingenova/filtro-uv.webp",
    description: "Equipo de esterilización ultravioleta industrial y comercial de alto caudal. Diseñado para garantizar agua biológicamente segura en procesos productivos, restaurantes, y redes de agua potable en edificaciones.",
    features: [
      "Cámara de contacto fabricada en acero inoxidable 316 pulido espejo",
      "Lámpara de radiación UV de alta intensidad y rendimiento estable",
      "Balastro electrónico integrado con indicador de vida útil restante y alertas",
      "Conexiones de entrada/salida de alto flujo para evitar caídas de presión",
      "Mantenimiento rápido sin necesidad de herramientas especiales"
    ]
  },
  {
    id: "bomba-dosificadora-seko",
    name: "Bomba Dosificadora SEKO Tekna EVO APG",
    category: "Agua Potable",
    subcategory: "Dosificación",
    price: "$3,480,000",
    image: "/images/ingenova/clorador-salino.webp",
    description: "Bomba dosificadora electromagnética analógica de caudal constante y proporcional. Adecuada para la dosificación precisa de cloro libre, modificadores de pH, coagulantes y desinfectantes.",
    features: [
      "Cabezal de bomba fabricado en PVDF de máxima compatibilidad química",
      "Diafragma de teflón (PTFE) sólido garantizado por 5 años",
      "Regulación analógica de frecuencia de pulso (0-100% de la capacidad máxima)",
      "Válvula de purga manual integrada y sensor de nivel opcional",
      "Protección IP65 contra polvo y chorros de agua"
    ]
  },
  {
    id: "filtro-sedimentos-purikor",
    name: "Portafiltro Big Blue Purikor 20\"",
    category: "Agua Potable",
    subcategory: "Filtración",
    price: "$480.000",
    image: "/images/ingenova/suavizador-agua.webp",
    description: "Carcasa reforzada de gran capacidad para la filtración física de sedimentos en la acometida principal de agua. Remueve con alta eficiencia arena, tierra, óxidos y partículas en suspensión.",
    features: [
      "Fabricado en polipropileno de alta resistencia química y estructural",
      "Conexión de entrada y salida roscada de 1.5 pulgadas NPT para alto flujo",
      "Botón de despresurización para facilitar el reemplazo de cartuchos",
      "Compatible con una amplia gama de cartuchos plisados y de carbón activo",
      "Incluye soporte metálico de montaje y llave de apertura"
    ]
  },
  {
    id: "osmosis-residencial-purikor",
    name: "Sistema de Ósmosis Inversa Purikor 5 Etapas (75 GPD)",
    category: "Agua Potable",
    subcategory: "Osmosis inversa",
    price: "$1,150,000",
    image: "/images/ingenova/suavizador-agua.webp",
    description: "Purificador de agua por ósmosis inversa de uso doméstico. Retiene eficazmente sales minerales disueltas, metales pesados (plomo, cromo), cloro, sedimentos y microorganismos para entregar agua de la más alta pureza directamente en su cocina.",
    features: [
      "5 etapas completas de filtración: física, química, microfiltración, ósmosis y poscarbón",
      "Membrana de ósmosis inversa de alto rechazo de 75 galones diarios (GPD)",
      "Tanque de almacenamiento hidroneumático presurizado de 3.2 galones",
      "Grifo cromado de cuello de ganso con cierre cerámico de lujo",
      "Fácil de instalar debajo de la meseta de la cocina"
    ]
  },
  {
    id: "ptap-compacta",
    name: "Planta de Tratamiento de Agua Potable Modular (PTAP)",
    category: "Agua Potable",
    subcategory: "Plantas de tratamiento",
    price: "$18,500,000",
    image: "/images/ingenova/disena-planta.webp",
    description: "Sistema compacto y pre-ensamblado para la potabilización descentralizada de agua proveniente de pozos, aljibes o ríos. Integra procesos de floculación, filtración multimedia y desinfección en un solo chasis.",
    features: [
      "Estructura autoportante de acero al carbono con pintura anticorrosiva",
      "Filtros de zeolita y carbón activado con válvulas de retrolavado manuales o automáticas",
      "Módulo de dosificación de coagulante y cloro integrado",
      "Cumple plenamente con la normativa nacional de calidad de agua para consumo humano",
      "Bajo requerimiento energético y facilidad de operación por personal no técnico"
    ]
  },
  {
    id: "cloro-granulado-91",
    name: "Cloro Granulado al 91% (Paila 50 Kg)",
    category: "Agua Potable",
    subcategory: "Producto químico",
    price: "$680.000",
    image: "/images/ingenova/floculador.webp",
    description: "Desinfectante concentrado en forma de grano de disolución lenta y estabilizada. Indicado para cloración en tanques de almacenamiento de agua potable, redes hidráulicas y piscinas residenciales.",
    features: [
      "Concentración del 91% de cloro libre activo garantizado",
      "Estabilizado químicamente para resistir la degradación acelerada por radiación UV solar",
      "Excelente disolución sin enturbiar el agua ni generar sedimentos calcáreos",
      "Paila plástica de alta seguridad para almacenamiento prolongado"
    ]
  },
  {
    id: "suavizador-agua-purikor",
    name: "Suavizador de Agua Automático Purikor (1.5 ft³)",
    category: "Agua Potable",
    subcategory: "Suavización de agua",
    price: "$4,850,000",
    image: "/images/ingenova/suavizador-agua.webp",
    description: "Suavizador de agua automático diseñado para remover la dureza (exceso de calcio y magnesio). Previene la formación de incrustaciones calcáreas en tuberías, calderas, griferías y calentadores de agua, alargando su vida útil.",
    features: [
      "Válvula de control automático digital Runxin para regeneración programada",
      "Resina catiónica de grado alimentario de alta capacidad de intercambio iónico",
      "Tanque de salmuera de polietileno de alta resistencia con accesorios",
      "Regeneración automática inteligente por tiempo y volumen de agua tratada",
      "Ideal para casas, fincas de recreo y comercios medianos"
    ]
  },

  // ── TRATAMIENTO DE AGUA RESIDUAL ──
  {
    id: "soplador-greenco",
    name: "Soplador de Canal Lateral Greenco 1.5 HP",
    category: "Tratamiento de agua residual",
    subcategory: "Equipos de agua residual",
    price: "$2,890,000",
    image: "/images/ingenova/bomba-sumergible.webp",
    description: "Soplador regenerativo de canal lateral diseñado para suministrar aire continuo a alta presión y flujo constante. Esencial en tanques de aireación de plantas de tratamiento biológico domésticas e industriales.",
    features: [
      "Motor eléctrico trifásico acoplado de 1.5 HP de servicio continuo",
      "Carcasa y turbina de aleación de aluminio fundido para disipación de calor",
      "Suministro de aire 100% libre de aceite y contaminantes",
      "Operación ultrasilenciosa con baja vibración gracias al equilibrado dinámico"
    ]
  },
  {
    id: "disco-difusor-epdm",
    name: "Disco Difusor de Burbuja Fina EPDM 9\"",
    category: "Tratamiento de agua residual",
    subcategory: "Equipos de agua residual",
    price: "$185,000",
    image: "/images/ingenova/disco-difusor.webp",
    description: "Difusor de aire tipo disco para distribución de burbuja fina. Sus microperforaciones en la membrana elastómera de EPDM garantizan la máxima transferencia de oxígeno y homogenización biológica del lodo.",
    features: [
      "Membrana de caucho EPDM formulada especialmente contra la incrustación y ataque biológico",
      "Conexión estándar con rosca macho de 3/4 pulgadas NPT",
      "Válvula antiretorno incorporada en el chasis para impedir el ingreso de lodo residual",
      "Diseño de soporte de polipropileno con fibra de vidrio de alta resistencia"
    ]
  },
  {
    id: "ptar-compacta-biologica",
    name: "Planta de Tratamiento PTAR Biológica Compacta 1 LPS",
    category: "Tratamiento de agua residual",
    subcategory: "Plantas de tratamiento de agua residual",
    price: "$28,500,000",
    image: "/images/ingenova/disena-planta.webp",
    description: "Planta compacta autoportante para la purificación de aguas servidas (negras y grises) de origen doméstico. Combina reactores anaerobios y aerobios para cumplir la norma nacional de vertimientos vigentes.",
    features: [
      "Construcción en fibra de vidrio reforzada o polietileno de alta resistencia",
      "Reactor biológico con difusión de aire fina y sedimentación secundaria integrada",
      "Remoción superior al 85% de DBO5 y sólidos suspendidos totales",
      "Bajos costos de operación, sin ruidos molestos ni malos olores"
    ]
  },
  {
    id: "polimero-anionico-floculante",
    name: "Floculante Polímero Aniónico (Saco 25 Kg)",
    category: "Tratamiento de agua residual",
    subcategory: "Químicos para tratamiento de aguas residuales",
    price: "$450.000",
    image: "/images/ingenova/floculador.webp",
    description: "Polielectrolito sintético aniónico de alto peso molecular. Facilita la aglomeración de partículas suspendidas y coloides en el agua residual, formando flóculos pesados y favoreciendo la rápida clarificación.",
    features: [
      "Altamente eficaz en procesos de sedimentación y espesamiento de lodos de PTAR",
      "Dosificación ultra-baja (eficiencia en concentraciones de 1 a 3 ppm)",
      "Gran solubilidad en agua y excelente desempeño en decantadores centrífugos",
      "Saco de polipropileno laminado de 25 Kg de alta resistencia a la humedad"
    ]
  },

  // ── PISCINAS ──
  {
    id: "boquilla-retorno-hayward",
    name: "Boquilla de Retorno de 1.5\" Hayward SP1419D",
    category: "Piscinas",
    subcategory: "Accesorios",
    price: "$45.000",
    image: "/images/ingenova/calentador-hayward.webp",
    description: "Boquilla de retorno Hayward original para recirculación de agua en piscinas de concreto. Cuenta con una bola direccional para orientar el flujo de agua filtrada y mejorar la mezcla de productos químicos.",
    features: [
      "Fabricada en plástico ABS inyectado de gran resistencia al cloro y rayos solares",
      "Rótula ajustable direccional con orificio de salida de 1/2 pulgada",
      "Rosca externa tipo MIP de 1.5 pulgadas para fácil empotramiento",
      "Superficie lisa anti-lesiones para los bañistas"
    ]
  },
  {
    id: "bomba-calor-fairland-x20",
    name: "Bomba de Calor Inverter Fairland X20-22",
    category: "Piscinas",
    subcategory: "Calefacción",
    price: "$19,620,125",
    image: "/images/ingenova/calentador-hayward.webp",
    description: "Climatizador Full Inverter de última generación para piscinas residenciales. Utiliza la energía térmica del aire exterior para calentar el agua, logrando coeficientes de rendimiento (COP) extraordinariamente altos y silenciosos.",
    features: [
      "Tecnología Full Inverter que ajusta la velocidad de forma inteligente según la demanda",
      "Intercambiador de titanio de doble espiral apto para cloradores salinos",
      "COP promedio superior a 15, garantizando ahorros eléctricos de hasta el 70%",
      "Control de funcionamiento inalámbrico integrado a través de aplicación móvil Wi-Fi",
      "Garantía extendida en compresor e intercambiador"
    ]
  },
  {
    id: "bomba-calor-inverter-119k",
    name: "Bomba de Calor Inverter 119.000 BTU",
    category: "Piscinas",
    subcategory: "Calefacción",
    price: "$15,675,659",
    image: "/images/ingenova/calentador-hayward.webp",
    description: "Bomba de calor Inverter de alta capacidad ideal para piscinas medianas y grandes o jacuzzis comerciales. Mantiene una temperatura constante y agradable en climas fríos.",
    features: [
      "Capacidad de calefacción de 119,000 BTU para calentamiento rápido",
      "Compresor rotativo inverter silencioso y de baja vibración",
      "Gabinete de ABS resistente a la corrosión marina y química",
      "Descongelamiento inteligente automático por inversión de ciclo"
    ]
  },
  {
    id: "clorador-salino-bsv",
    name: "Clorador Salino BSV Evo Basic 15g/h",
    category: "Piscinas",
    subcategory: "Desinfeccion",
    price: "$6,850,000",
    image: "/images/ingenova/clorador-salino.webp",
    description: "Sistema ecológico de desinfección mediante electrólisis salina. Genera cloro activo natural a partir de sal común disuelta en la piscina, evitando la manipulación de cloro tradicional.",
    features: [
      "Celda de electrólisis de titanio autolimpiante por inversión de polaridad",
      "Menor consumo de energía eléctrica con tecnología de fuente conmutada IP65",
      "Display digital fácil de configurar con alertas de nivel de sal y flujo",
      "Previene la irritación de ojos, resequedad de piel y olor a químico"
    ]
  },
  {
    id: "alarma-inmersion-aqualarm",
    name: "Alarma de Inmersión Aqualarm",
    category: "Piscinas",
    subcategory: "Equipos para piscina",
    price: "$1,880,676",
    image: "/images/ingenova/descargar-manuales.webp",
    description: "Alarma de seguridad por detección de inmersión para la prevención de accidentes en piscinas domésticas. Homologada bajo normas de seguridad internacional.",
    features: [
      "Sensor ultrasensible de ondas de presión subacuática en el vaso de la piscina",
      "Sirena integrada en el dispositivo principal de 100 dB de alta potencia",
      "Rearme automático tras el baño y llaves magnéticas de desactivación",
      "Funciona con baterías de larga duración de fácil reemplazo"
    ]
  },
  {
    id: "bomba-hayward-super-pump",
    name: "Bomba para Piscina Hayward Super Pump 1.5 HP",
    category: "Piscinas",
    subcategory: "Filtros y bombas",
    price: "$2,450,000",
    image: "/images/ingenova/calentador-hayward.webp",
    description: "Motobomba autocebante de alto caudal Hayward. Es reconocida por su excepcional fiabilidad y durabilidad en sistemas de recirculación y filtración de piscinas.",
    features: [
      "Motor industrial resistente acoplado directamente con ventilación forzada",
      "Canasta prefiltro sobredimensionada con tapa Lexan transparente para inspección rápida",
      "Cuerpo de la bomba fabricado en resina termoestable reforzada con fibra de vidrio",
      "Perillas manuales de cierre rápido que no requieren herramientas para limpieza"
    ]
  },
  {
    id: "filtro-arena-hayward-24",
    name: "Filtro de Arena Hayward Pro Series 24\"",
    category: "Piscinas",
    subcategory: "Filtros y bombas",
    price: "$3,100,000",
    image: "/images/ingenova/calentador-hayward.webp",
    description: "Filtro de arena de alta eficiencia para piscinas residenciales. Garantiza una filtración homogénea mediante su difusor superior y purga de aire automática.",
    features: [
      "Tanque soplado en polímero de alta densidad a prueba de corrosión",
      "Válvula selectora Vari-Flo de 6 vías superior para fácil control de retrolavado y enjuague",
      "Sistema de drenaje de agua y arena integrado en la base del filtro",
      "Capacidad para hasta 300 lbs de arena filtrante estándar o zeolita activa"
    ]
  },
  {
    id: "modificador-alcalinidad-alka",
    name: "Modificador de Alcalinidad Alka (20 Kg)",
    category: "Piscinas",
    subcategory: "Producto químico",
    price: "$128,520",
    image: "/images/ingenova/floculador.webp",
    description: "Incrementador y estabilizador soluble de la alcalinidad total. Regula la capacidad amortiguadora del agua de la piscina para evitar oscilaciones incontroladas del pH.",
    features: [
      "Formula pura y concentrada de bicarbonato de sodio seleccionado",
      "Previene la corrosión de partes metálicas e incrustaciones en la bomba de calor",
      "Optimiza el rendimiento y eficiencia de los desinfectantes de cloro",
      "Bolsa de alta densidad resellable de 20 Kg"
    ]
  },

  // ── ANÁLISIS DE AGUA ──
  {
    id: "analizador-lovibond-3vias",
    name: "Analizador de Cloro y pH Lovibond de 3 Vías",
    category: "Análisis de agua",
    subcategory: "Comparadores visuales",
    price: "$125,000",
    image: "/images/ingenova/kit-taylor.webp",
    description: "Kit colorimétrico manual para monitoreo rápido del nivel de desinfectante y pH. Escalas visuales calibradas de gran legibilidad y resistencia a la decoloración por rayos UV.",
    features: [
      "Comparador de plástico transparente resistente con escala colorimétrica fija",
      "Contiene 20 tabletas DPD No.1 (cloro libre) y 20 de Phenol Red (pH) de disolución rápida",
      "Uso sencillo y resultados legibles en menos de 1 minuto",
      "Estuche protector de transporte"
    ]
  },
  {
    id: "medidor-multiparametro-hanna",
    name: "Medidor Multiparámetro Digital Hanna HI98129",
    category: "Análisis de agua",
    subcategory: "Equipos para medir la calidad del agua",
    price: "$2,150,000",
    image: "/images/ingenova/kit-taylor.webp",
    description: "Medidor de bolsillo digital multiparámetro de alta precisión. Mide simultáneamente pH, conductividad eléctrica (CE), sólidos disueltos totales (TDS) y temperatura en un solo sensor.",
    features: [
      "Cuerpo impermeable flotante con protección IP67",
      "Sonda de pH de cartucho reemplazable y unión de fibra para mayor vida útil",
      "Calibración automática a 1 o 2 puntos por pulsación de un botón",
      "Compensación automática de temperatura (ATC) para resultados exactos"
    ]
  },
  {
    id: "reactivos-dpd1-lovibond",
    name: "Reactivos DPD1 Lovibond (Caja x 100 Pastillas)",
    category: "Análisis de agua",
    subcategory: "Reactivos, laboratorio y otros",
    price: "$180,000",
    image: "/images/ingenova/kit-taylor.webp",
    description: "Tabletas reactivas DPD No.1 originales Lovibond para la medición de cloro libre residual. Fabricadas en Alemania bajo los más altos estándares de control y calidad.",
    features: [
      "Máxima estabilidad de almacenamiento al estar protegidas individualmente en aluminio",
      "Disolución inmediata al mezclarse con la muestra de agua",
      "Viraje de color nítido para lecturas seguras en comparadores y fotómetros",
      "Caja de cartón protectora con 100 pastillas de reactivo"
    ]
  },

  // ── BOMBAS DE AGUA ──
  {
    id: "presocontrol-altamira",
    name: "Control de Presión Automático Altamira (Presscontrol)",
    category: "Bombas de agua",
    subcategory: "Accesorios de instalación",
    price: "$285,000",
    image: "/images/ingenova/equipo-presion.webp",
    description: "Dispositivo de automatización electrónica para bombas de agua. Reemplaza el sistema tradicional de presostato y tanque hidroneumático, encendiendo la bomba por demanda y apagándola al cerrar grifos.",
    features: [
      "Protección electrónica contra trabajo en seco con reinicios automáticos programados",
      "Manómetro de lectura de presión de línea integrado en el chasis",
      "Evita el encendido y apagado constante por fugas mínimas en la red",
      "Conexión estándar con rosca macho/hembra de 1 pulgada NPT"
    ]
  },
  {
    id: "bomba-centrifuga-altamira-1hp",
    name: "Bomba Centrífuga Monobloc Altamira de 1 HP",
    category: "Bombas de agua",
    subcategory: "Bombas centrifugas",
    price: "$1,150,000",
    image: "/images/ingenova/bomba-sumergible.webp",
    description: "Bomba centrífuga horizontal compacta de alta eficiencia hidráulica. Apta para el bombeo de agua limpia sin sólidos abrasivos en aplicaciones residenciales y de llenado de tanques.",
    features: [
      "Impulsor de bronce fundido equilibrado dinámicamente contra desgaste",
      "Cuerpo de la bomba y soporte del motor fabricados en hierro fundido gris",
      "Motor eléctrico monofásico de 1 HP con protector térmico contra sobrecargas",
      "Funcionamiento continuo ultrasilencioso con bajos niveles de vibración"
    ]
  },
  {
    id: "bomba-multietapas-horizontal-altamira",
    name: "Bomba Multietapas Horizontal Altamira 1.5 HP",
    category: "Bombas de agua",
    subcategory: "Bombas multietapas",
    price: "$2,890,000",
    image: "/images/ingenova/bomba-sumergible.webp",
    description: "Bomba multietapa horizontal de alta presión silenciosa. Excelente desempeño hidráulico que permite presurizar múltiples servicios residenciales o sistemas de riego por goteo.",
    features: [
      "Estructura e impulsores de acero inoxidable 304 para evitar la corrosión",
      "Difusores hidráulicos en tecnopolímero de alta resistencia al desgaste",
      "Sello mecánico de carburo de silicio / grafito de alta durabilidad",
      "Entrega alta presión con bajo caudal de corriente eléctrica"
    ]
  },
  {
    id: "bomba-periferica-altamira",
    name: "Bomba Periférica Altamira 0.5 HP",
    category: "Bombas de agua",
    subcategory: "Bombas Periféricas",
    price: "$380.000",
    image: "/images/ingenova/bomba-sumergible.webp",
    description: "Bomba periférica compacta ideal para suministrar agua limpia a alta presión con bajo caudal. Ideal para el llenado de tanques elevados y uso doméstico en general.",
    features: [
      "Impulsor periférico de bronce con álabes radiales de alta eficiencia",
      "Inserción de latón antibloqueo en el cuerpo de hierro para evitar pegados",
      "Eje de transmisión de acero inoxidable 304 de alta durabilidad",
      "Diseño compacto para instalación en espacios reducidos"
    ]
  },
  {
    id: "bomba-sumergible-pozo-altamira",
    name: "Bomba Sumergible de Pozo Profundo Altamira 1 HP",
    category: "Bombas de agua",
    subcategory: "Bombeo sumergible",
    price: "$2,450,000",
    image: "/images/ingenova/bomba-sumergible.webp",
    description: "Bomba sumergible multietapas para pozos profundos de 4 pulgadas. Excelente desempeño hidráulico que resiste la presencia moderada de arena y sedimentos en el pozo.",
    features: [
      "Camisa exterior, eje de bomba y acoplamiento fabricados en acero inoxidable 304",
      "Impulsores flotantes de noryl de alta resistencia al desgaste abrasivo",
      "Motor sumergible con bobinas rebobinables en baño de aceite mineral atóxico",
      "Incluye caja de control y arranque (Control Box) con capacitor y térmica"
    ]
  },
  {
    id: "sistema-presurizacion-altamira",
    name: "Sistema de Presurización Inteligente Altamira Inverter",
    category: "Bombas de agua",
    subcategory: "Presurización",
    price: "$4,890,000",
    image: "/images/ingenova/equipo-presion.webp",
    description: "Equipo de presión constante inteligente con variador de velocidad integrado. Mantiene la presión del agua uniforme en todas las duchas y grifos al ajustar la velocidad del motor de la bomba en tiempo real.",
    features: [
      "Variador de frecuencia que regula la velocidad y ahorra hasta 60% de energía",
      "Presión constante seleccionable mediante un amigable teclado digital LCD",
      "Protección por falta de agua (trabajo en seco) y sobretensiones en la red",
      "Arranques y paros sumamente suaves que evitan golpes de ariete y ruidos"
    ]
  }
];
