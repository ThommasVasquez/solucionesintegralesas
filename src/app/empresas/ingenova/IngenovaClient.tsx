"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import s from "./ingenova.module.css";

// Prefilled WhatsApp URLs
const WA_BASE = "https://wa.me/573123043792";
const waLink = (msg: string) => `${WA_BASE}?text=${encodeURIComponent(msg)}`;

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    title: "Construcción Civil y Remodelaciones",
    subtitle: "Obra Civil Profesional",
    desc: "Ampliaciones, mampostería, pintura, adecuación de locales comerciales, enchapados, pisos y acabados de alta calidad.",
    ctaText: "Cotizar Obra",
    ctaMsg: "Hola Ingenova, me interesa recibir una cotización sobre obras civiles y remodelaciones."
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    title: "Mantenimiento e Impermeabilización de Fachadas",
    subtitle: "Mantenimiento de Fachadas",
    desc: "Lavado a presión, sellado de juntas de dilatación, impermeabilización técnica y pintura de fachadas comerciales y residenciales.",
    ctaText: "Cotizar Fachada",
    ctaMsg: "Hola Ingenova, solicito una cotización para el mantenimiento o impermeabilización de fachadas."
  },
  {
    image: "https://images.unsplash.com/photo-1635424710928-0544e8512eae?q=80&w=1200&auto=format&fit=crop",
    title: "Reparación y Montaje de Cubiertas y Techos",
    subtitle: "Cubiertas y Tejados",
    desc: "Instalación de cubiertas termoacústicas, impermeabilización total de terrazas y reparación profesional de goteras y humedades.",
    ctaText: "Cotizar Cubiertas",
    ctaMsg: "Hola Ingenova, me gustaría cotizar la reparación o instalación de cubiertas/techo."
  },
  {
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200&auto=format&fit=crop",
    title: "Construcción y Acabados de Piscinas",
    subtitle: "Zonas Húmedas",
    desc: "Diseño civil, excavación estructural, vaciado de concreto monolítico impermeable y revestimientos en vitrocerámica de lujo.",
    ctaText: "Cotizar Piscina",
    ctaMsg: "Hola Ingenova, me gustaría cotizar el diseño, construcción y acabados de una piscina o jacuzzi."
  },
  {
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop",
    title: "Instalación y Suministro de Equipos para Piscinas",
    subtitle: "Maquinaria y Climatización",
    desc: "Venta y montaje de bombas de calor Inverter, sistemas de filtración, cloradores salinos y automatización para cuartos de máquinas.",
    ctaText: "Cotizar Equipos",
    ctaMsg: "Hola Ingenova, quiero cotizar equipos o sistemas de calefacción/filtración para piscina."
  }
];

const BUBBLE_SERVICES = [
  {
    id: "item-p-1",
    title: "Acabados Piscinas",
    icon: (
      <svg viewBox="0 0 84 67" className={s.bubbleSvg}>
        <path d="M51.4 26.5h1C62.3 26.5 72.2 26.5 82 26.5c.8 0 1.5-.1 1.8-.9V24.8c-.4-.7-1.1-.8-1.8-.8-2.8 0-5.6 0-8.4-.1-.3 0-.6 0-1-.1V24c0-2.5 0-4.9 0-7.3 0-1.2 0-2.5-.1-3.7-.8-6.4-5.8-11.7-11.9-12.8C54.1-.9 47.9 2.2 44.9 8.2c-.1.2-.2.4-.3.6-.1 0-.1-.1-.1-.1-.1-.1-.2-.3-.3-.4C41.5 3.1 37.3.3 31.5 0 23.8-.3 17 5.8 16.5 13.5c-.2 3.1-.1 6.3-.1 9.5 0 .3 0 .6 0 1h-1.1c-4.4 0-8.8 0-13.2 0-.3 0-.7 0-1 .1C.5 24.3.3 24.7.3 25.4c0 .3.1.6.3.8.2.2.5.3.8.3.3 0 .6 0 .8 0h14.3v1C16.4 28.7 16.4 30 16.4 31.2c0 .9.5 1.4 1.3 1.4.7 0 1.1-.5 1.2-1.4v-.7c0-3 0-6 0-9 0-2.7-.1-5.4.1-8.1.5-6.9 7.3-12.1 14-10.9 6 1.1 10.2 6.1 10.3 12.3 0 2.8 0 5.6 0 8.4 0 .2 0 .5 0 .7h-3V23c0-2.9 0-5.7-.1-8.6-.2-6.4-7-10.7-12.8-8-3.8 1.8-5.5 5-5.5 9.1 0 10.5 0 21 0 31.5v1.2c-.5-.4-.9-.6-1.3-.9-1.2-.8-2-1.8-1.8-3.4.1-1 .1-2 0-3 0-1.5 0-3 0-4.5 0-.7-.4-1.2-1.1-1.2-.7-.1-1.2.4-1.3 1.1 0 .2 0 .5 0 .7v8c0 .5-.2 1-.5 1.3C12 50.3 6.2 50 2.6 45.7c-.9-1.1-1.6-1.1-2.4 0v.8c.1 0 .1.1.2.2 4.1 5.7 11.7 6.5 16.8 1.8.2-.2.4-.3.5-.5 2.3 2.3 5 3.6 8.2 3.6 3.2 0 5.8-1.3 8.1-3.6 2.3 2.3 5 3.6 8.2 3.6 3.2 0 5.8-1.3 8.1-3.6 2.3 2.3 5 3.6 8.2 3.6 3.2 0 5.8-1.3 8.1-3.6.2.2.4.4.6.6 3.1 2.7 6.6 3.6 10.6 2.5 2.6-.7 4.6-2.4 6.2-4.6v-.8c-.8-1.1-1.5-1.1-2.4 0-3.9 4.7-10.1 4.7-13.9 0-.7-.9-1.5-.9-2.3 0-3.6 4.4-9.5 4.7-13.3.6-.3-.3-.5-.7-.5-1.1 0-6.1 0-12.2 0-18.3 0-24.4 0-30.5 0" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, me interesa cotizar la construcción o acabados de mi piscina.")
  },
  {
    id: "item-p-2",
    title: "Obra Civil",
    icon: (
      <svg viewBox="0 0 66 64" className={s.bubbleSvg}>
        <path d="M10 10h46v44H10zM5 5v54h56V5zm15 15h10v10H20zm16 0h10v10H36zM20 34h10v10H20zm16 0h10v10H36z" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, me interesa cotizar proyectos de obra civil y remodelaciones.")
  },
  {
    id: "item-p-3",
    title: "Cubiertas",
    icon: (
      <svg viewBox="0 0 66 66" className={s.bubbleSvg}>
        <path d="M33 5L5 28h10v33h36V28h10L33 5zm10 51H23V34h20v22z" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, necesito impermeabilización o instalación de cubiertas.")
  },
  {
    id: "item-p-4",
    title: "Fachadas",
    icon: (
      <svg viewBox="0 0 66 64" className={s.bubbleSvg}>
        <path d="M10 10h46v44H10zM5 5v54h56V5zm15 15h10v10H20zm16 0h10v10H36zM20 34h10v10H20zm16 0h10v10H36z" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, me interesa cotizar la impermeabilización o mantenimiento de fachadas.")
  },
  {
    id: "item-p-5",
    title: "Maquinaria",
    icon: (
      <svg viewBox="0 0 70 67" className={s.bubbleSvg}>
        <path d="M35 15c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 35c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, me interesa cotizar equipos y maquinaria para piscina.")
  },
  {
    id: "item-p-6",
    title: "Servicios",
    icon: (
      <svg viewBox="0 0 62 62" className={s.bubbleSvg}>
        <g clipPath="url(#clip0_750_477)">
          <path d="M57.4834 19.4752C58.1494 19.6722 58.8623 19.6487 59.5135 19.4081C60.1647 19.1676 60.7186 18.7232 61.0909 18.1427C61.3305 17.7708 61.479 17.3337 61.6683 16.9263V15.7418C61.4107 14.7694 60.7843 14.0528 60.0765 13.3635C57.8008 11.1474 55.5706 8.88743 53.2901 6.67844C51.424 4.86979 48.3471 5.68943 47.7482 8.16847C47.6021 8.76899 47.7817 9.4453 47.7961 10.0873C47.7961 10.2792 47.832 10.5445 47.7243 10.6534C46.4067 11.98 45.0773 13.2829 43.7466 14.5905C43.7262 14.6107 43.6807 14.6071 43.5789 14.6296C43.5789 13.3623 43.5537 12.1079 43.5897 10.8548C43.6076 10.1903 43.3825 9.69641 42.9082 9.2321C40.2827 6.66422 37.6824 4.07266 35.0678 1.4953C34.7743 1.20748 34.439 0.961117 34.1228 0.695801H3.10147C1.65381 1.07956 0.735544 1.98764 0.34668 3.42003V52.1114C1.2354 54.2908 2.04267 54.8214 4.47287 54.8214C8.1052 54.8214 11.7383 54.8214 15.3722 54.8214C15.6503 54.8299 15.9281 54.7972 16.1963 54.7243C16.4449 54.6429 16.6582 54.4805 16.8014 54.2636C16.9446 54.0467 17.0091 53.7882 16.9844 53.5304C16.9597 53.2626 16.8426 53.0113 16.6526 52.8189C16.4626 52.6264 16.2113 52.5046 15.9412 52.4739C15.7225 52.4553 15.5029 52.4498 15.2836 52.4573H4.02492C3.03679 52.4573 2.74215 52.1635 2.74215 51.1852V4.33205C2.74215 3.34659 3.026 3.06588 4.02012 3.06588H32.537C32.5549 3.20209 32.5657 3.24118 32.5657 3.28026C32.5657 4.91835 32.5657 6.55762 32.5657 8.19571C32.5729 10.233 33.9239 11.5785 35.9721 11.5856C37.4884 11.5856 39.0059 11.5856 40.5235 11.5856H41.1834C41.1834 13.3125 41.1702 14.9494 41.1942 16.5851C41.2012 16.7686 41.1669 16.9514 41.0938 17.1201C41.0206 17.2889 40.9105 17.4396 40.7714 17.5611C37.9388 20.3434 35.142 23.1565 32.2878 25.921C31.3081 26.8685 31.15 27.5519 32.198 28.4841C32.2232 28.5066 32.2244 28.5563 32.2363 28.5931C32.2199 28.6291 32.199 28.6629 32.1741 28.6937C30.8773 29.9785 29.5802 31.2636 28.2826 32.5491C27.4825 33.3451 27.4873 33.9077 28.2994 34.7119C29.6816 36.0811 31.0646 37.4496 32.4483 38.8172C32.5502 38.9179 32.6376 39.0316 32.7897 39.2069C29.9786 39.2069 27.267 39.2069 24.5541 39.2069C22.3982 39.2069 20.8123 40.7325 20.8147 42.7661C20.8171 44.7998 22.4125 46.3076 24.5708 46.3076C26.8058 46.3076 29.042 46.2946 31.2782 46.3242C31.6443 46.3348 31.9991 46.4527 32.2974 46.663C33.9036 47.8593 35.6211 48.8459 37.5363 49.4606C38.5891 49.7982 39.6719 50.0446 40.7379 50.3312V52.4561H27.0957C26.8765 52.4561 26.6561 52.4478 26.4381 52.4691C26.1673 52.4918 25.9131 52.6076 25.7198 52.7966C25.5266 52.9856 25.4065 53.2356 25.3805 53.5032C25.344 53.77 25.4053 54.041 25.5534 54.267C25.7015 54.4929 25.9265 54.659 26.1878 54.735C26.438 54.7989 26.696 54.828 26.9543 54.8214C30.0477 54.8262 33.1414 54.8262 36.2356 54.8214H36.862C36.862 54.9032 36.8692 54.9304 36.862 54.9399C36.7159 55.0429 36.5661 55.1401 36.4212 55.2443C34.8989 56.3387 34.0102 57.798 33.8772 59.667C33.7922 60.8692 34.2006 61.2743 35.4343 61.2755C39.2056 61.2755 42.9776 61.2755 46.7505 61.2755C51.2029 61.2755 55.654 61.2755 60.104 61.2755C61.2167 61.2755 61.6203 60.8479 61.5724 59.7558C61.4634 57.2342 59.6082 54.9707 57.0989 54.3879C56.3324 54.2091 55.5263 54.1949 54.6591 54.0966C54.6591 53.8455 54.6591 53.5742 54.6591 53.3042C54.6304 51.409 54.6459 49.5139 54.5393 47.6247C54.5082 47.0716 54.5118 46.734 54.9909 46.342C58.6536 43.3737 60.9909 39.1017 61.4994 34.4458C62.0079 29.79 60.647 25.1229 57.7097 21.4497C57.2702 20.8953 56.7875 20.3742 56.3395 19.853C56.6114 19.339 56.9588 19.3129 57.4834 19.4752ZM37.3818 9.20723C36.8656 9.20723 36.3482 9.21908 35.8319 9.20012C35.3529 9.18236 35.0043 8.92889 34.9935 8.45155C34.96 7.28132 34.9827 6.1099 34.9827 4.98468L39.2814 9.20723H37.3818ZM49.5364 12.4467L54.8783 17.7234L39.9006 32.5361L34.5611 27.257L49.5364 12.4467ZM43.6076 42.4274C43.5968 42.277 43.5777 42.123 43.5777 41.9702C43.5777 38.9321 43.5777 35.894 43.5873 32.8559C43.585 32.6104 43.6697 32.372 43.8268 32.1819C45.9827 30.0203 48.1602 27.8765 50.3329 25.7291C50.4044 25.6648 50.4796 25.6047 50.5581 25.549C53.1021 27.8374 54.4938 32.2506 52.7415 36.3595C51.9949 38.1497 50.7291 39.6812 49.1037 40.7611C47.4782 41.8409 45.5658 42.4207 43.6076 42.4274ZM52.217 48.4396C52.2756 50.3099 52.2277 52.1837 52.2277 54.1321H43.2519C43.2246 54.036 43.2062 53.9377 43.1968 53.8383C43.1968 52.0617 43.1609 50.285 43.2136 48.5083C43.2615 46.8584 44.0652 45.5603 45.5372 44.8271C49.0322 43.0859 52.1283 45.6361 52.217 48.4396ZM41.1499 34.9251V42.1716C40.4803 42.033 39.909 41.9512 39.5629 41.1766C38.982 39.8737 37.837 39.2602 36.4033 39.2152C35.6547 39.1927 34.9049 39.2152 34.1395 39.2152L38.5711 34.8197C39.7497 35.8134 39.8252 35.817 41.1499 34.9216V34.9251ZM30.7643 33.6222L33.9874 30.4361L36.6536 33.0679L33.4497 36.2659L30.7643 33.6222ZM30.3475 43.9387C28.4527 43.9387 26.5575 43.9387 24.6619 43.9387C23.7504 43.9387 23.2354 43.523 23.2186 42.7958C23.2018 42.0448 23.7372 41.5876 24.6559 41.5864C28.4886 41.5864 32.3214 41.5864 36.1541 41.5864C37.0213 41.5864 37.5794 42.0602 37.5794 42.765C37.5794 43.4697 37.0273 43.9364 36.1553 43.9387C34.2222 43.9387 32.2862 43.9387 30.3475 43.9387ZM40.648 47.9019L36.4272 46.5362L36.4596 46.355C37.9052 46.2626 38.958 45.5662 39.6695 44.3178L41.8578 44.8046L40.648 47.9019ZM55.597 56.5993C57.166 56.5993 58.4536 57.4959 58.8704 58.8332H36.4967C37.0788 57.5753 37.9735 56.854 39.2694 56.6325C39.4676 56.6034 39.668 56.5911 39.8683 56.5957C45.1104 56.5918 50.3529 56.5914 55.5958 56.5946L55.597 56.5993ZM53.3847 44.531L50.8887 42.4677C53.8291 40.2302 55.6041 37.2431 55.9 33.505C56.1934 29.787 54.9574 26.5665 52.3942 23.8967L54.6472 21.7055C60.7712 27.3091 60.9987 38.5874 53.3847 44.531ZM50.3784 9.70825C50.1532 9.47965 50.055 8.97863 50.1293 8.65646C50.1904 8.39233 50.5964 8.20756 50.8719 7.96712C51.2049 8.16018 51.4791 8.25494 51.666 8.44089C54.0838 10.8098 56.4941 13.1909 58.8967 15.5843C59.3758 16.0581 59.383 16.6017 58.9686 16.9879C58.5541 17.374 58.0499 17.3302 57.5888 16.8753C55.1741 14.4851 52.7583 12.1103 50.3832 9.69996L50.3784 9.70825Z" fill="currentColor"/>
        </g>
        <defs>
          <clipPath id="clip0_750_477">
            <rect width="61.324" height="60.5761" fill="white" transform="translate(0.344727 0.697266)"/>
          </clipPath>
        </defs>
      </svg>
    ),
    link: waLink("Hola Ingenova, me interesa recibir información sobre sus servicios de construcción civil y acabados.")
  }
];

const SOLUTIONS = [
  {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    title: "Construcción Civil y Remodelaciones",
    desc: "Ejecución de obras de mampostería, pañetes, pisos, pintura y remodelaciones estructurales residenciales y comerciales.",
    icon: "🧱",
    link: waLink("Hola Ingenova, me interesa cotizar obras de construcción civil o remodelación."),
    detailedDesc: "Llevamos a cabo proyectos de obra civil de mediana complejidad, adecuaciones de espacios y remodelaciones generales. Nos especializamos en mampostería, pañetes, colocación de pisos cerámicos y porcelanatos, pintura profesional de interiores/exteriores y acabados de lujo para locales comerciales y residenciales.",
    features: [
      "Remodelación completa de locales comerciales, oficinas y viviendas",
      "Construcción de muros, divisiones y mampostería estructural",
      "Instalación técnica de pisos, baldosas y enchapados de alta gama",
      "Aplicación de pintura arquitectónica y acabados estéticos de larga duración",
      "Obras civiles complementarias y adecuaciones de redes hidrosanitarias"
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800&auto=format&fit=crop",
    title: "Construcción y Acabados de Piscinas",
    desc: "Diseño estructural, excavación, concreto reforzado impermeable y enchapes de lujo en vitrocerámica.",
    icon: "🏊",
    link: waLink("Hola Ingenova, me interesa cotizar la construcción o acabados de mi piscina."),
    detailedDesc: "Especialistas en el diseño, construcción civil y revestimiento estético de piscinas, jacuzzis y zonas húmedas. Realizamos desde el movimiento de tierra y vaciado de concreto sismorresistente con aditivos de estanqueidad, hasta el enchape en vitrocerámica (mosaico), playas en piedra térmica y acabados de lujo con iluminación LED.",
    features: [
      "Planificación y diseño estructural sismorresistente",
      "Excavación, cimentación y vaciado de concreto monolítico impermeable",
      "Enchape y acabados premium (mosaico vitrocerámico, piedra natural y antideslizante)",
      "Construcción de jacuzzis integrados, playas húmedas y cascadas",
      "Pruebas de estanqueidad hidráulica y acabados de rebose"
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    title: "Impermeabilización de Fachadas y Cubiertas",
    desc: "Lavado a alta presión, sellado de juntas, hidrófugos de fachada y montaje de tejas termoacústicas.",
    icon: "🏢",
    link: waLink("Hola Ingenova, me interesa cotizar impermeabilización de fachadas y cubiertas."),
    detailedDesc: "Soluciones definitivas para la protección climática de edificaciones residenciales y comerciales. Realizamos lavado a presión de fachadas, sellado elástico de juntas de dilatación, aplicación de hidrófugos repelentes de agua, impermeabilización de terrazas con mantos asfálticos y acrílicos, e instalación de cubiertas termoacústicas UPVC.",
    features: [
      "Sellado de fisuras y juntas con poliuretano de alta elasticidad",
      "Aplicación de hidrófugo siliconado transparente contra humedades",
      "Impermeabilización asfáltica y acrílica de terrazas y losas de concreto",
      "Lavado de fachadas a presión para remoción de hongos y moho",
      "Suministro e instalación de tejas termoacústicas y policarbonato"
    ]
  },
  {
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    title: "Suministro de Maquinaria y Equipos",
    desc: "Venta e instalación de bombas de calor Inverter, filtros de arena, motobombas y sistemas automáticos para piscinas.",
    icon: "⚙️",
    link: waLink("Hola Ingenova, me interesa cotizar equipos para mi piscina."),
    detailedDesc: "Suministro e instalación de equipos y maquinaria especializada para el correcto funcionamiento de piscinas y jacuzzis. Somos distribuidores autorizados de las mejores marcas del mercado (AstralPool, Hayward, Pentair). Ofrecemos bombas de calor Full Inverter para climatización eficiente, motobombas autocebantes, filtros de arena y sistemas de automatización.",
    features: [
      "Venta de equipos de marcas líderes con garantía directa del fabricante",
      "Instalación y acoplamiento hidráulico y eléctrico por técnicos expertos",
      "Automatización de sistemas de filtrado y control de temperatura",
      "Climatización ecológica y de bajo consumo (bombas de calor Inverter)",
      "Asesoría técnica para dimensionamiento de cuartos de máquinas"
    ]
  }
];

const BEST_SELLERS = [
  {
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
    name: "Bomba de Calor Inverter Fairland X20-22",
    desc: "Calefacción turbo silenciosa para piscinas con tecnología Full Inverter de última generación. COP extremadamente alto.",
    price: "$19,620,125",
    tag: "Maquinaria",
    link: waLink("Hola Ingenova, me interesa cotizar la Bomba de Calor Inverter Fairland X20-22 por $19.620.125.")
  },
  {
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
    name: "Bomba de Calor Inverter 119.000 BTU",
    desc: "Equipo de climatización Inverter de alto rendimiento para piscinas grandes y jacuzzis de uso comercial o residencial.",
    price: "$15,675,659",
    tag: "Calefacción",
    link: waLink("Hola Ingenova, me interesa cotizar la Bomba de Calor Inverter 119.000 BTU por $15.675.659.")
  },
  {
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600&auto=format&fit=crop",
    name: "Alarma de Inmersión Aqualarm",
    desc: "Sistema homologado de detección de inmersión para garantizar la seguridad de niños y mascotas en el área de piscina.",
    price: "$1,880,676",
    tag: "Seguridad",
    link: waLink("Hola Ingenova, me interesa comprar la Alarma de Inmersión Aqualarm por $1.880.676.")
  },
  {
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",
    name: "Filtro de Arena Hayward Pro Series 24\"",
    desc: "Filtro de arena de alta eficiencia para recirculación de agua en piscinas residenciales. Con válvula de 6 vías.",
    price: "$3,100,000",
    tag: "Filtración",
    link: waLink("Hola Ingenova, me interesa cotizar el Filtro de Arena Hayward Pro Series 24\" por $3.100.000.")
  }
];

const TESTIMONIALS = [
  {
    quote: "Acabo de comprar por internet un filtro de arena para piscina. Hoy me llegó en perfectas condiciones y tal como lo pedí. Además con un precio muy competitivo en comparación con los que había cotización en otros distribuidores. Puedo recomendarlos sin ninguna duda.",
    author: "Jaime Alberto Vasquez M.",
    role: "Cliente Web",
    location: "Colombia",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "Se encuentran bastantes opciones en equipos y accesorios para piscinas. La asesoría en el diseño de cuartos de máquinas es técnica y muy profesional.",
    author: "John A.",
    role: "Constructor de Piscinas",
    location: "Bogotá",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "La atención es excelente, brindan buena asesoría y la ejecución de la obra civil para nuestra piscina campestre superó las expectativas.",
    author: "Juan David N.",
    role: "Propietario de Finca",
    location: "Cundinamarca",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  }
];

const BRANDS = [
  { name: "AstralPool", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop" },
  { name: "Hayward", logo: "https://images.unsplash.com/photo-1608501078713-8e445a709b39?q=80&w=200&auto=format&fit=crop" },
  { name: "Pentair", logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200&auto=format&fit=crop" },
  { name: "Taylor", logo: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=200&auto=format&fit=crop" },
  { name: "Lovibond", logo: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&auto=format&fit=crop" },
  { name: "BSV", logo: "https://images.unsplash.com/photo-1585130401366-fe05a8d813c4?q=80&w=200&auto=format&fit=crop" }
];

export default function IngenovaClient() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const [visibleItems, setVisibleItems] = useState<{ [key: string]: boolean }>({});
  
  const [selectedSolution, setSelectedSolution] = useState<typeof SOLUTIONS[0] | null>(null);
  const solutionModalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSolution(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSolutionBackdropClick = (e: React.MouseEvent) => {
    if (solutionModalRef.current && !solutionModalRef.current.contains(e.target as Node)) {
      setSelectedSolution(null);
    }
  };

  // Hero slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Review slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Intersection observer for scroll animations
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-animate-id");
          if (id) {
            setVisibleItems((prev) => ({ ...prev, [id]: true }));
          }
        }
      });
    }, observerOptions);

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const registerRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className={s.page}>

      {/* ══════════ HERO SLIDER ══════════ */}
      <section id="inicio" className={s.hero}>
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`${s.heroSlide} ${idx === activeSlide ? s.slideActive : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={s.heroOverlay} />
            <div className={s.heroContent}>
              <div className={s.heroBadge}>
                <span className={s.heroBadgeDot} /> {slide.subtitle}
              </div>
              <h1 className={s.heroTitle}>{slide.title}</h1>
              <p className={s.heroDesc}>{slide.desc}</p>
              <div className={s.heroCtas}>
                <a
                  href={waLink(slide.ctaMsg)}
                  target="_blank"
                  rel="noreferrer"
                  className={s.btnPrimaryGold}
                >
                  {slide.ctaText} →
                </a>
                <a href="#bienvenidos" className={s.btnSecondaryOutline}>
                  Saber Más
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Controls */}
        <div className={s.heroDots}>
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={`${s.heroDot} ${idx === activeSlide ? s.heroDotActive : ""}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ══════════ PROCESS SUMMARY (BARRA DE LOGROS) ══════════ */}
      <section className={s.statsBar}>
        <div className={s.statsContainer}>
          <div className={s.statBox}>
            <h2 className={s.statValue}>10+</h2>
            <p className={s.statLabel}>Años de Trayectoria</p>
          </div>
          <div className={s.statBox}>
            <h2 className={s.statValue}>+2,000</h2>
            <p className={s.statLabel}>Clientes Satisfechos</p>
          </div>
          <div className={s.statBox}>
            <h2 className={s.statValue}>100%</h2>
            <p className={s.statLabel}>Garantía por Escrito</p>
          </div>
          <div className={s.statBox}>
            <h2 className={s.statValue}>&lt;24h</h2>
            <p className={s.statLabel}>Tiempo de Respuesta</p>
          </div>
        </div>
      </section>

      {/* ══════════ BIENVENIDOS (WAVE PORTFOLIO) ══════════ */}
      <section 
        id="bienvenidos" 
        className={`${s.welcomeSection} ${visibleItems["welcome"] ? s.visible : ""}`}
        ref={registerRef("welcome")}
        data-animate-id="welcome"
      >
        <div className={s.welcomeContainer}>
          <div className={s.welcomeText}>
            <span className={s.subTitle}>Bienvenidos</span>
            <h2 className={s.mainTitle}>INGENOVA SOLUCIONES INTEGRALES AS</h2>
            <p className={s.welcomeParagraph}>
              En Ingenova somos especialistas en obras de construcción civil, remodelaciones residenciales y comerciales, adecuaciones estructurales y acabados de alta especificación. Asimismo, diseñamos y construimos piscinas y jacuzzis con revestimientos de lujo y sistemas de recirculación eficientes. Nuestro compromiso es brindar calidad técnica, seguridad y durabilidad en cada proyecto.
            </p>
            <a href="#contacto" className={s.btnPrimaryGold}>Agendar Asesoría</a>
          </div>

          <h3 className={s.waveSectionTitle}>
            LINEAS DE <strong>NEGOCIO</strong>
          </h3>

          {/* Wave Wrapper */}
          <div className={`${s.waveWrapper} ${visibleItems["welcome"] ? s.waveActive : ""}`}>
            {/* SVG Wave */}
            <svg 
              className={s.waveSvg} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 1728 256" 
              fill="none"
            >
              <path 
                className={s.wavePath}
                d="M-85.0908 4.36328C-85.0908 4.36328 249.667 260.081 570.477 250.782C891.287 241.483 1058.67 4.36328 1435.27 4.36328C1811.87 4.36328 2058.29 213.587 2058.29 213.587" 
                stroke="var(--ing-navy)" 
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>

            {/* Bubble Grid */}
            <div className={s.bubbleGrid}>
              {BUBBLE_SERVICES.map((bubble, idx) => (
                <div 
                  key={bubble.id} 
                  className={`${s.bubbleItem} ${s[bubble.id]} ${visibleItems["welcome"] ? s.bubbleVisible : ""}`}
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <a href={bubble.link} target="_blank" rel="noreferrer" className={s.bubbleLink}>
                    <div className={s.bubbleCircle}>
                      {bubble.icon}
                    </div>
                  </a>
                  <h4 className={s.bubbleTitle}>{bubble.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SOLUTIONS GRID ══════════ */}
      <section 
        id="soluciones" 
        className={`${s.solutionsSection} ${visibleItems["solutions"] ? s.visible : ""}`}
        ref={registerRef("solutions")}
        data-animate-id="solutions"
      >
        <div className={s.solutionsContainer}>
          <div className={s.sectionHeaderCenter}>
            <span className={s.subTitle}>Servicios y Soluciones</span>
            <h2 className={s.mainTitle}>Algunas de nuestras Soluciones</h2>
          </div>

          <div className={s.solutionsGrid}>
            {SOLUTIONS.map((sol, idx) => (
              <div 
                key={idx} 
                className={s.solutionCard}
                style={{ backgroundImage: `url(${sol.image})` }}
              >
                <div className={s.solutionOverlay} />
                <div className={s.solutionContent}>
                  <div className={s.solutionIcon}>{sol.icon}</div>
                  <h3 className={s.solutionTitle}>{sol.title}</h3>
                  <p className={s.solutionDesc}>{sol.desc}</p>
                  <button 
                    onClick={() => setSelectedSolution(sol)} 
                    className={s.solutionBtn}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ VITRINA DE PRODUCTOS (LO MÁS VENDIDO) ══════════ */}
      <section 
        id="productos" 
        className={`${s.productsSection} ${visibleItems["products"] ? s.visible : ""}`}
        ref={registerRef("products")}
        data-animate-id="products"
      >
        <div className={s.productsContainer}>
          <div className={s.sectionHeaderLeft}>
            <span className={s.subTitle}>Equipos y Medición</span>
            <h2 className={s.mainTitle}>lo más Vendido</h2>
            <p className={s.sectionSubtext}>
              Distribuimos e instalamos los mejores equipos para la climatización y recirculación de su piscina.
            </p>
          </div>

          <div className={s.productsGrid}>
            {BEST_SELLERS.map((prod, idx) => (
              <div key={idx} className={s.productCard}>
                <div className={s.productTag}>{prod.tag}</div>
                <div className={s.productImageWrap}>
                  <Image 
                    src={prod.image} 
                    alt={prod.name} 
                    fill 
                    className={s.productImg}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className={s.productBody}>
                  <h3 className={s.productName}>{prod.name}</h3>
                  <p className={s.productDesc}>{prod.desc}</p>
                  <div className={s.productFooter}>
                    <span className={s.productPrice}>{prod.price}</span>
                    <a href={prod.link} target="_blank" rel="noreferrer" className={s.btnProductCta}>
                      Cotizar por WA
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Técnico */}
          <div className={s.techBanner}>
            <div className={s.techBannerContent}>
              <h3>¿Buscas asesoría?</h3>
              <p>Haz clic ahora para hablar con un representante</p>
            </div>
            <a 
              href={waLink("Hola Ingenova, me gustaría recibir asesoría personalizada sobre el diseño o equipamiento de mi piscina.")} 
              target="_blank" 
              rel="noreferrer" 
              className={s.btnPrimaryGold}
            >
              Contactar Ahora
            </a>
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIOS (OPINIONES) ══════════ */}
      <section 
        id="opiniones" 
        className={`${s.opinionesSection} ${visibleItems["opiniones"] ? s.visible : ""}`}
        ref={registerRef("opiniones")}
        data-animate-id="opiniones"
      >
        <div className={s.opinionesContainer}>
          <div className={s.sectionHeaderCenter}>
            <span className={s.subTitle}>Qué opinan</span>
            <h2 className={s.mainTitle}>nuestros clientes</h2>
          </div>

          <div className={s.reviewSlider}>
            {TESTIMONIALS.map((test, idx) => (
              <div
                key={idx}
                className={`${s.reviewSlide} ${idx === activeReview ? s.reviewActive : ""}`}
              >
                <div className={s.reviewBox}>
                  <div className={s.reviewStars}>
                    {"★".repeat(test.stars)}
                  </div>
                  <p className={s.reviewQuote}>“{test.quote}”</p>
                  <div className={s.reviewProfile}>
                    <div className={s.avatarWrap}>
                      <Image
                        src={test.avatar}
                        alt={test.author}
                        width={60}
                        height={60}
                        className={s.reviewAvatar}
                      />
                    </div>
                    <div className={s.authorMeta}>
                      <h4>{test.author}</h4>
                      <p>{test.role} — <strong>{test.location}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={s.reviewDots}>
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                className={`${s.reviewDot} ${idx === activeReview ? s.reviewDotActive : ""}`}
                onClick={() => setActiveReview(idx)}
                aria-label={`Ver testimonio ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BRANDS GRID ══════════ */}
      <section className={s.brandsSection}>
        <div className={s.brandsContainer}>
          <h3 className={s.brandsTitle}>Trabajamos con las mejores Marcas del Mercado</h3>
          <div className={s.brandsGrid}>
            {BRANDS.map((brand, idx) => (
              <div key={idx} className={s.brandItem}>
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={150}
                  height={80}
                  className={s.brandLogoImg}
                  style={{ objectFit: "contain", filter: "grayscale(100%) brightness(0.8)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CONTACTO & FOOTER ══════════ */}
      <footer id="contacto" className={s.footer}>
        <div className={s.footerTop}>
          <div className={s.footerContainer}>
            {/* Column 1: Brand Info */}
            <div className={s.footerCol}>
              <Image
                src="/ingenova-logo.jpg"
                alt="Ingenova Logo Footer"
                width={150}
                height={60}
                className={s.footerLogo}
                style={{ width: "auto", height: "45px", objectFit: "contain" }}
              />
              <p className={s.footerBrandDesc}>
                Ingenova, especialistas en construcción de piscinas, impermeabilización de fachadas, cubiertas y maquinaria para piscinas en Bogotá y Sabana Norte.
              </p>
              <div className={s.footerSocials}>
                <a href="https://www.facebook.com/aquaintegralsas/" target="_blank" rel="noreferrer" aria-label="Facebook">FB</a>
                <a href="https://www.instagram.com/aquaintegralsas/" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
                <a href="https://www.youtube.com/channel/UCUIrM9IVHh0dJ4Vpzxtx8KA" target="_blank" rel="noreferrer" aria-label="YouTube">YT</a>
                <a href="https://twitter.com/aqua_integral" target="_blank" rel="noreferrer" aria-label="Twitter">TW</a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className={s.footerCol}>
              <h4 className={s.footerColTitle}>Enlaces Rápidos</h4>
              <ul className={s.footerLinks}>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#bienvenidos">Líneas de Negocio</a></li>
                <li><a href="#soluciones">Nuestras Soluciones</a></li>
                <li><a href="#productos">Lo más Vendido</a></li>
                <li><a href="#opiniones">Opiniones de Clientes</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Details */}
            <div className={s.footerCol}>
              <h4 className={s.footerColTitle}>Contacto Comercial</h4>
              <ul className={s.footerContactList}>
                <li>
                  <span className={s.contactIcon}>📍</span>
                  <span>Cl. 76 #20c-33, Bogotá</span>
                </li>
                <li>
                  <span className={s.contactIcon}>📞</span>
                  <a href="tel:6016958175">PBX: 601 695 8175</a>
                </li>
                <li>
                  <span className={s.contactIcon}>💬</span>
                  <a href="https://wa.me/573123043792" target="_blank" rel="noreferrer">WA: (57) 312 304 3792</a>
                </li>
                <li>
                  <span className={s.contactIcon}>💬</span>
                  <a href="https://wa.me/573105286629" target="_blank" rel="noreferrer">WA: (57) 310 528 6629</a>
                </li>
                <li>
                  <span className={s.contactIcon}>✉️</span>
                  <a href="mailto:comercial@ingenova.com.co">comercial@ingenova.com.co</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom (Payments / Copyright) */}
        <div className={s.footerBottom}>
          <div className={s.footerBottomContainer}>
            <p className={s.copyright}>
              © {new Date().getFullYear()} INGENOVA SOLUCIONES INTEGRALES AS. Todos los derechos reservados.
            </p>
            <div className={s.paymentRow}>
              <span className={s.paymentMethod} title="PSE">PSE</span>
              <span className={s.paymentMethod} title="Visa">VISA</span>
              <span className={s.paymentMethod} title="Mastercard">MASTERCARD</span>
              <span className={s.paymentMethod} title="Bancolombia">BANCOLOMBIA</span>
              <span className={s.paymentMethod} title="Nequi / Daviplata">NEQUI</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── SERVICE DETAIL MODAL ── */}
      {selectedSolution && (
        <div className={s.modalOverlay} onClick={handleSolutionBackdropClick}>
          <div ref={solutionModalRef} className={s.modalContent}>
            <button 
              className={s.closeBtn} 
              onClick={() => setSelectedSolution(null)}
              aria-label="Cerrar modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={s.closeIcon}>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className={s.modalGrid}>
              <div className={s.modalImageArea}>
                <img 
                  src={selectedSolution.image} 
                  alt={selectedSolution.title}
                  className={s.modalImg}
                />
              </div>
              
              <div className={s.modalDetailsArea}>
                <span className={s.modalCategoryTag}>Servicio Especializado › {selectedSolution.title}</span>
                <h2 className={s.modalTitle}>{selectedSolution.title}</h2>
                
                <p className={s.modalDesc}>{selectedSolution.detailedDesc}</p>

                <h4 className={s.featuresTitle}>¿Qué incluye este servicio?:</h4>
                <ul className={s.featuresList}>
                  {selectedSolution.features.map((feature, idx) => (
                    <li key={idx} className={s.featureItem}>
                      <span className={s.featureBullet}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href={selectedSolution.link}
                  target="_blank"
                  rel="noreferrer"
                  className={s.whatsappBtn}
                >
                  <span className={s.whatsappIcon}>💬</span>
                  Solicitar Cotización y Visita por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
