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
  // ── CLIMATIZACIÓN ──
  {
    id: "bomba-calor-fairland-x20",
    name: "Bomba de Calor Inverter Fairland X20-22",
    category: "Climatización",
    subcategory: "Bombas de calor Inverter",
    price: "$19,620,125",
    image: "/images/ingenova/calentador-hayward.webp",
    description: "Climatizador Full Inverter de última generación para piscinas residenciales. Utiliza la energía térmica del aire exterior para calentar el agua, logrando coeficientes de rendimiento (COP) extraordinariamente altos y un funcionamiento silencioso.",
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
    category: "Climatización",
    subcategory: "Bombas de calor Inverter",
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
    id: "calentador-gas-hayward",
    name: "Calentador a Gas Hayward Universal H-Series",
    category: "Climatización",
    subcategory: "Calentadores a gas",
    price: "$12,500,000",
    image: "/images/ingenova/calentador-hayward.webp",
    description: "Calentador a gas Hayward de alto rendimiento para piscinas y jacuzzis. Ofrece una alta eficiencia térmica y un calentamiento rápido sin importar las condiciones climáticas del entorno.",
    features: [
      "Quemadores de cuproníquel resistentes a químicos y corrosión",
      "Bajas emisiones de NOx que cumplen con estándares de protección ambiental",
      "Pantalla digital intuitiva para un ajuste preciso de la temperatura",
      "Ideal para jacuzzis residenciales y comerciales de rápido calentamiento"
    ]
  },

  // ── FILTRACIÓN Y BOMBEO ──
  {
    id: "bomba-hayward-super-pump",
    name: "Bomba para Piscina Hayward Super Pump 1.5 HP",
    category: "Filtración y Bombeo",
    subcategory: "Motobombas autocebantes",
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
    category: "Filtración y Bombeo",
    subcategory: "Filtros de arena",
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
    id: "vidrio-filtrante-filtracion",
    name: "Vidrio Filtrante Activo (Saco 20 Kg)",
    category: "Filtración y Bombeo",
    subcategory: "Medios filtrantes",
    price: "$195,000",
    image: "/images/ingenova/suavizador-agua.webp",
    description: "Medio filtrante ecológico fabricado a partir de vidrio reciclado activado. Reemplaza la arena de sílice convencional en el filtro, ofreciendo un filtrado hasta un 30% más eficiente y previniendo bacterias.",
    features: [
      "Larga vida útil (más de 10 años sin perder efectividad)",
      "Previene la formación de biopelículas y bacterias en el filtro",
      "Reduce el consumo de agua en lavados hasta un 50%",
      "Filtración microscópica de hasta 15 micras"
    ]
  },

  // ── ACCESORIOS DE VASO ──
  {
    id: "boquilla-retorno-hayward",
    name: "Boquilla de Retorno de 1.5\" Hayward SP1419D",
    category: "Accesorios de Vaso",
    subcategory: "Boquillas de retorno",
    price: "$45,000",
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
    id: "skimmer-hayward",
    name: "Skimmer de Boca Ancha Hayward SP1085",
    category: "Accesorios de Vaso",
    subcategory: "Skimmers y desagües",
    price: "$580,000",
    image: "/images/ingenova/calentador-hayward.webp",
    description: "Skimmer original Hayward fabricado en ABS. Recoge de forma automática hojas, insectos y partículas suspendidas en la superficie del agua antes de que caigan al fondo.",
    features: [
      "Cesta prefiltro de gran capacidad para retención de hojas y suciedad",
      "Construcción robusta en ABS de una sola pieza resistente a la decoloración",
      "Válvula de alivio integrada para evitar sobrepresiones",
      "Conexión de 1.5 pulgadas para tuberías estándar"
    ]
  },
  {
    id: "reflector-led-piscina",
    name: "Reflector LED Extraplano Multicolor (RGB) 18W",
    category: "Accesorios de Vaso",
    subcategory: "Iluminación LED subacuática",
    price: "$780,000",
    image: "/images/ingenova/filtro-uv.webp",
    description: "Luminaria LED sumergible multicolor de alta intensidad y bajo consumo energético. Ideal para ambientar y decorar su piscina por las noches con múltiples programas de color.",
    features: [
      "Luz LED RGB de alta eficiencia (18 Watts) de larga duración",
      "Cuerpo plano que no requiere nicho de instalación para acabados limpios",
      "Protección IP68 estanca total contra filtraciones de agua",
      "Incluye control remoto y sincronizador de colores"
    ]
  },

  // ── SEGURIDAD Y CONFORT ──
  {
    id: "alarma-inmersion-aqualarm",
    name: "Alarma de Inmersión Aqualarm",
    category: "Seguridad y Confort",
    subcategory: "Alarmas de inmersión",
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
    id: "escalera-acero-inoxidable",
    name: "Escalera de Acero Inoxidable de 3 Peldaños",
    category: "Seguridad y Confort",
    subcategory: "Escaleras y pasamanos",
    price: "$1,150,000",
    image: "/images/ingenova/bomba-sumergible.webp",
    description: "Escalera de acceso seguro fabricada en acero inoxidable AISI 304 pulido. Peldaños antideslizantes de plástico reforzado para mayor seguridad y comodidad.",
    features: [
      "Tubo de acero inoxidable de 1.5 pulgadas de diámetro de gran agarre",
      "Peldaños con inserción de goma antideslizante para evitar resbalones",
      "Anclajes y tapas protectoras de piso incluidas para instalación rápida",
      "Altamente resistente a la corrosión y químicos de piscina"
    ]
  },
  {
    id: "cubierta-seguridad-piscina",
    name: "Manta Térmica y Cubierta de Seguridad a Medida",
    category: "Seguridad y Confort",
    subcategory: "Cubiertas de seguridad",
    price: "$2,450,000",
    image: "/images/ingenova/descargar-manuales.webp",
    description: "Lona térmica de burbujas de gran espesor para retención de calor y evaporación de agua. Opcionalmente configurable como cubierta de seguridad con tensores de anclaje.",
    features: [
      "Reduce las pérdidas de calor de la bomba de calor hasta un 80%",
      "Disminuye la evaporación del agua en un 95% para ahorro",
      "Mantiene la piscina limpia protegiéndola contra hojas, lluvia y polvo",
      "Material con protección UV para mayor durabilidad y resistencia"
    ]
  }
];
