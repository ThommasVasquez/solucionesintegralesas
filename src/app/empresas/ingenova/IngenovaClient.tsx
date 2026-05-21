"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import s from "./ingenova.module.css";

// Prefilled WhatsApp URLs
const WA_BASE = "https://wa.me/573001234567";
const waLink = (msg: string) => `${WA_BASE}?text=${encodeURIComponent(msg)}`;

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1800&auto=format&fit=crop",
    title: "Diseño & Construcción de Piscinas",
    subtitle: "Zonas Húmedas de Lujo",
    desc: "Creamos espacios acuáticos premium que combinan arquitectura de vanguardia, sistemas automatizados y acabados de la más alta calidad.",
    ctaText: "Cotizar Proyecto",
    ctaMsg: "Hola Ingenova, me gustaría cotizar el diseño y construcción de una piscina."
  },
  {
    image: "https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=1800&auto=format&fit=crop",
    title: "Sistemas Inteligentes de Calefacción",
    subtitle: "Jacuzzis & Spas Privados",
    desc: "Instalamos bombas de calor y calentadores de alta eficiencia para que disfrutes de tu jacuzzi con la temperatura ideal, ahorrando hasta un 60% de energía.",
    ctaText: "Optimizar Jacuzzi",
    ctaMsg: "Hola Ingenova, quiero información sobre sistemas de calefacción para jacuzzis."
  },
  {
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1800&auto=format&fit=crop",
    title: "Mantenimiento Técnico Certificado",
    subtitle: "Agua 100% Cristalina",
    desc: "Prevención, diagnóstico y tratamiento químico especializado para condominios, copropiedades y residencias en Bogotá y Sabana Norte.",
    ctaText: "Agendar Visita",
    ctaMsg: "Hola Ingenova, me gustaría agendar una visita técnica para mantenimiento."
  }
];

const BUBBLE_SERVICES = [
  {
    id: "item-p-1",
    title: "Piscinas",
    icon: (
      <svg viewBox="0 0 84 67" className={s.bubbleSvg}>
        <path d="M51.4 26.5h1C62.3 26.5 72.2 26.5 82 26.5c.8 0 1.5-.1 1.8-.9V24.8c-.4-.7-1.1-.8-1.8-.8-2.8 0-5.6 0-8.4-.1-.3 0-.6 0-1-.1V24c0-2.5 0-4.9 0-7.3 0-1.2 0-2.5-.1-3.7-.8-6.4-5.8-11.7-11.9-12.8C54.1-.9 47.9 2.2 44.9 8.2c-.1.2-.2.4-.3.6-.1 0-.1-.1-.1-.1-.1-.1-.2-.3-.3-.4C41.5 3.1 37.3.3 31.5 0 23.8-.3 17 5.8 16.5 13.5c-.2 3.1-.1 6.3-.1 9.5 0 .3 0 .6 0 1h-1.1c-4.4 0-8.8 0-13.2 0-.3 0-.7 0-1 .1C.5 24.3.3 24.7.3 25.4c0 .3.1.6.3.8.2.2.5.3.8.3.3 0 .6 0 .8 0h14.3v1C16.4 28.7 16.4 30 16.4 31.2c0 .9.5 1.4 1.3 1.4.7 0 1.1-.5 1.2-1.4v-.7c0-3 0-6 0-9 0-2.7-.1-5.4.1-8.1.5-6.9 7.3-12.1 14-10.9 6 1.1 10.2 6.1 10.3 12.3 0 2.8 0 5.6 0 8.4 0 .2 0 .5 0 .7h-3V23c0-2.9 0-5.7-.1-8.6-.2-6.4-7-10.7-12.8-8-3.8 1.8-5.5 5-5.5 9.1 0 10.5 0 21 0 31.5v1.2c-.5-.4-.9-.6-1.3-.9-1.2-.8-2-1.8-1.8-3.4.1-1 .1-2 0-3 0-1.5 0-3 0-4.5 0-.7-.4-1.2-1.1-1.2-.7-.1-1.2.4-1.3 1.1 0 .2 0 .5 0 .7v8c0 .5-.2 1-.5 1.3C12 50.3 6.2 50 2.6 45.7c-.9-1.1-1.6-1.1-2.4 0v.8c.1 0 .1.1.2.2 4.1 5.7 11.7 6.5 16.8 1.8.2-.2.4-.3.5-.5 2.3 2.3 5 3.6 8.2 3.6 3.2 0 5.8-1.3 8.1-3.6 2.3 2.3 5 3.6 8.2 3.6 3.2 0 5.8-1.3 8.1-3.6 2.3 2.3 5 3.6 8.2 3.6 3.2 0 5.8-1.3 8.1-3.6.2.2.4.4.6.6 3.1 2.7 6.6 3.6 10.6 2.5 2.6-.7 4.6-2.4 6.2-4.6v-.8c-.8-1.1-1.5-1.1-2.4 0-3.9 4.7-10.1 4.7-13.9 0-.7-.9-1.5-.9-2.3 0-3.6 4.4-9.5 4.7-13.3.6-.3-.3-.5-.7-.5-1.1 0-6.1 0-12.2 0-18.3 0-24.4 0-30.5 0-.1-.1-.1-.1-.1-.3v-6.1h-18.8v6.1h18.8zm0 8.7v3.4H24.5V35.2h18.8zm-18.7-21.3c.3-3.4 3.5-5.9 7-5.7 3.3.2 6.1 3 6.2 6.4v9.4H24.5V13.9zm18.8 35.2c-3.3.4-6 1.6-8.1-.9-.2-.3-.4-.6-.7-.7-.7-.4-1.2-.1-1.7.5-1.4 1.7-3.1 2.9-5.3 3.3-1 .2-2 .1-3 .2v-8h18.8v7.9zm8.1-34c0-3.3 2.1-6 5.1-6.8 1-.2 2-.2 2.9 0 1 .2 1.9.6 2.7 1.2.8.6 1.4 1.4 1.9 2.3.5.9.7 1.8.8 2.8.1.6 0 1.3.1 1.9 0 .3.2.6.4.8.2.2.5.3.8.3.3 0 .6-.1.8-.3.2-.2.4-.5.4-.8.4-5-2-8.7-5.9-10.2-5.9-2.3-12.1 2.1-12.3 8.7v6.1c0 7.9 0 15.8 0 23.8 0 .8-.2 1.4-.8 1.8-.7.5-1.4 1.1-2.3 1.7 0-.5 0-.7 0-1v-32.4c0-6.2 4.2-11.2 10.3-12.3 6.5-1.2 13.2 3.6 14 10.3.3 2.6.1 5.3.2 8 .1 1 0 2 0 3h-3.1v-2.5c0-.9-.5-1.5-1.3-1.5-.8 0-1.2.6-1.2 1.5V23.8c0 .1 0 .2-.1.3H51.4v-.7c0-2.7 0-5.4.1-8.1l-.1.1zm23.9 47c-1.6 2.1-3.6 3.6-6.1 4.2-3.9 1-7.4 0-10.4-2.7-.2-.2-.4-.3-.6-.5-4.4 4.5-11.3 4.9-16.3 0-.8.6-1.6 1.2-2.4 1.8-.7.5-1.4.4-1.8-.2-.4-.6-.2-1.2.5-1.8.9-.7 1.8-1.5 2.6-2.3.8-.8 1.5-.8 2.2.1 2 2.5 4.5 3.8 7.7 3.5 2.6-.2 4.6-1.5 6.2-3.4.9-1 1.6-1 2.4 0 3.9 4.7 10.1 4.7 13.9 0 .2-.3.5-.6.8-.6.5 0 1 .1 1.3.4.5.5.3 1.1-.1 1.6z" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, me interesa el servicio de mantenimiento y equipamiento de Piscinas.")
  },
  {
    id: "item-p-2",
    title: "Agua Residual",
    icon: (
      <svg viewBox="0 0 66 64" className={s.bubbleSvg}>
        <path d="M65.3 47.8c-.3-1.3-1.5-2.1-2.8-2.2-.3 0-.7-.1-1.1-.1.4-1.1.9-2.1 1.2-3.2.6-1.9-.6-3.8-2.5-4.1-.7-.1-.7-.4-.6-.9.5-4.3-.4-8.3-2.6-12-2.7-4.5-6.5-7.7-10.8-10.5C41.2 11.6 35.8 9.3 30.2 7.5c-.5-.2-.7-.4-.6-.9.1-.8.1-1.6 0-2.4 0-1.1-.5-1.7-1.6-1.7-1.9 0-3.8 0-5.7.1-1 .1-1.6.6-1.6 1.7 0 .4 0 .9 0 1.3H2.1C.5 5.5.1 6 .1 7.5c0 5 0 10.1 0 15.1 0 1.7.5 2.2 2.1 2.2h18.6v1.5c.1.9.6 1.4 1.4 1.5 2 .1 4 .1 6 0 .9 0 1.4-.6 1.4-1.5v-.9l.2-.1c.4.4.8.9 1.2 1.3 2.7 2.9 5 5.9 6.3 9.7.8 2.4 1 4.8.2 7.3-.2.5-.4.7-1 .7-2.1 0-4.1-.1-6.2 0-.4 0-.9.1-1.3.3-.4.2-.7.5-1 .8-.3.3-.5.7-.6 1.2-.1.4-.2.8-.1 1.3 0 .3 0 .5-.1.8-2.2-.2-4.4-.3-6.6-.3-4.5.1-9.1.1-13.6 0-2.5 0-4.8.8-7.1 1.6-.3.1-.6.4-.8.7-.2.3-.2.7-.1 1.1s.4.6.7.8c.3.2.7.2 1.1.1.6-.2 1.2-.4 1.8-.6 1.6-.6 3.3-.9 5-.8 3.7 0 7.4 0 11.1 0 2.1 0 4.1 0 5.9 1.2h.8c2.2.6 4.4-1.3 4-3.5-.1-.7.1-.8.7-.8 1.9 0 3.8 0 5.8 0 1.6 0 2.7-.7 3.2-2.2.4-1.2.7-2.4.9-3.6.3-3-.5-5.8-1.8-8.5-2.2-4.4-5.3-8-8.9-11.2-.2-.1-.3-.3-.4-.5-.1-.2-.2-.5-.2-.7 0-3 0-6 0-9v-.8c.3.1.6.2.8.3 3.1 1.3 6.2 2.4 9.2 3.8 4.2 2 8.1 4.5 11.4 7.9 4.2 4.2 6.5 9.2 5.6 15.3-.2 1.7 1 3.1 2.6 3.4h.7c-.4 1-.8 1.9-1.1 2.8-.2.6-.3 1.3-.2 2 .2 1.6 1.5 2.5 3.2 2.6h.8c.1.5.3 1.1.3 1.6-.1 1.7-.7 3.2-2.7 3.7-.8.2-1.2 1.1-.9 1.9s1.4 1 2.2.9c2.5-.5 4-2.2 4.6-4.6.6-2.7.3-5.4-.3-8zM20.7 21.8h-3.6c-1 0-2 0-3 .1-.6 0-.8-.2-.8-.8V14.5c0-.9-.4-1.5-1.1-1.6-1-.2-1.8.5-1.8 1.6 0 1.9 0 3.8 0 5.7v1.6H7.2c-1.2 0-2.4 0-3.6.1-.4 0-.6-.1-.6-.6.1-4.1.1-8.2.1-12.3 0-.1 0-.2.1-.3h11.7c0 .2 0 .5 0 .7.1 1.7 0 3.3.1 5 .1.9.5 1.4 1.2 1.6.3.1.6 0 .9-.1s.5-.3.6-.6c.1-.3.2-.6.2-1 0-1.6 0-3.2 0-4.8V8.4H20.7l.1 13.4H20.7zm5.9 3c-.9 0-1.8 0-2.6 0h-.3c0-.2-.1-.3-.1-.5v-18V5.5h2.9l-.1 19.3zm-13.2 7.4c-.8 0-1.6.1-2.3.4s-1.4.7-2 1.3c-.6.6-1.1 1.3-1.4 2-.3.7-.5 1.5-.5 2.3s.2 1.6.5 2.3 1.1 1.4 2 2 1.6.4 2.3.4c1.5-.1 2.9-.8 4-1.9s1.6-2.6 1.6-4.1c0-1.5-.6-3-1.6-4.1-1.1-1.1-2.5-1.8-4-1.8zm0 8.9c-.8 0-1.5-.3-2.1-.9s-.8-1.6-.8-2.4c0-.4.1-.8.2-1.1s.3-.7.6-1c.3-.3.6-.5 1-.6s.8-.1 1.2 0c.8.1 1.5.4 2.1 1s.8 1.6.8 2.4c0 .8-.3 1.5-.8 2.1s-1.3 1.1-2.1 1.1zm42.3 19c-1.1.8-2.3 1.6-3.5 2.3-1.3.7-2.9.3-3.7-.9-.3-.5-.6-.5-1.1-.3-1.4.6-2.8 1.1-4.2 1.7-1.5.6-2.8.4-3.9-.8-1.2-1.2-1.2-1.2-2.7-.5-1.1.5-2.2 1.1-3.3 1.6-.9.4-1.7.2-2.1-.6-.4-.8-.1-1.6.8-2.1 1.5-.8 3-1.5 4.5-2.2 1.5-.7 2.8-.6 3.9.7.9 1.1 1.8 1.3 3 .6.8-.5 1.7-.7 2.6-1.1 2.3-.9 3.2-.7 4.9 1.3.8-.5 1.6-1 2.4-1.5.2-.2.5-.4.8-.5s.7.1 1 .2c.4.1.7.3.9.6.4.7.3 1.5-.3 2zm-25.1-2.8c-3.1 1.6-6.3 3.3-9.9 3-1.3-.1-2.2-.8-2.7-2.1-.1-.3-.6-.6-.9-.6-1.2.1-2.4.3-3.6.5-.8.2-1.6.6-2.4.9-.9.3-1.7 0-2-1-.3-.8 0-1.6.9-2 2.1-.9 4.2-1.6 6-1.6 1.9 0 3.2.2 4.1 1.4.1.1.2.2.3.3.7 1.2.8 1.4 2.2 1 2-1 4-1.8 6-2.5.4-.1.8-.3 1.2-.3.3 0 .6.1.8.3.2.2.4.4.5.7.2.6.1 1.3-.4 1.6v.1zm21.2-56.4c-1.2 0-2.3.5-3.1 1.3s-1.3 2-1.3 3.1c0 1.2.5 2.3 1.3 3.1s2 1.3 3.1 1.3 2.3-.5 3.1-1.3 1.3-2 1.3-3.1c0-1.2-.5-2.3-1.3-3.1s-2-1.3-3.1-1.3zm.1 5.9c-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3s-.2-.3-.3-.5-.1-.4-.1-.6c0-.2.1-.4.2-.6s.3-.3.5-.4c.2-.1.4-.2.6-.2.4 0 .8.2 1 .4s.4.6.4 1c0 .4-.2.8-.4 1s-.7.6-1 .6h-.1zm0 28.2c.1.4 0 .8-.3 1.1s-.7.5-1.1.5c-.4 0-.8-.2-1.1-.5s-.4-.7-.4-1.1.2-.8.5-1.1.7-.4 1.1-.4 1.1.1 1.4.4s.3.7.3 1.1zm-47.2 26.8c0 .4-.2.8-.4 1s-.7.4-1.1.4c-.4 0-.8-.2-1.1-.4s-.4-.6-.4-1c0-.4.2-.8.4-1s.7-.4 1.1-.4c.4 0 .8.2 1.1.4s.4.6.4 1zm36.9-10.4c0 .2 0 .4-.1.6s-.1.3-.3.4c-.1.1-.3.2-.5.3s-.4.1-.6 0c-.4-.1-.8-.2-1-.5s-.4-.7-.4-1.1c.1-.4.2-.8.5-1s.7-.4 1.1-.4c.4.1.8.2 1 .5s.3.7.3 1.2zm16.3 3c0 .4-.2.7-.5 1s-.7.4-1.1.4c-.4 0-.8-.2-1.1-.4s-.4-.6-.4-1 .2-.8.5-1c.3-.3.7-.4 1.1-.4.9 0 1.5.6 1.5 1.4z" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, quiero cotizar soluciones para el manejo y tratamiento de Agua Residual.")
  },
  {
    id: "item-p-3",
    title: "Medición & Control",
    icon: (
      <svg viewBox="0 0 66 66" className={s.bubbleSvg}>
        <path d="M65.7 32.1c-.4-.4-.9-.6-1.5-.6-.6 0-1.2 0-1.7 0H61.1c-.8 0-1.6.3-2.1.9s-.9 1.3-.9 2.1c0 .4 0 .8 0 1.2v.6h-10.4v-.2c0-.2 0-.5 0-.7 0-2.1-1.5-3.6-3.6-3.6-1 0-2 0-3.1 0h-2.8v-.1c0-.2 0-.3 0-.5V32c0-1.1 0-2.2-.1-3.3 0-.4.1-.6.5-.8 5.5-2.3 9-7.7 8.8-13.5-.1-3-.1-5.8-1.8-8.2-1.7-2.4-4.2-4.1-7-5.1-.7-.2-1.4-.4-2.1-.6-.3-.1-.7-.1-1-.2h-2.8c0 .1-.1 0-.1.1-.1 0-.2.1-.3.1l-.8.2C24.3 1.8 19.7 6.8 18.8 13.1c-.8 5.9 2.4 12 7.7 14.5 1.2.6 1.6 1.2 1.5 2.5-.1 1-.1 1.9-.1 2.9v.7h-2.2c-1.2 0-2.4 0-3.6 0-2.2.1-3.7 1.6-3.7 3.8v1.1h-10.4v-1.1c0-.4 0-.8 0-1.2 0-1 0-1.9 0-2.9 0-.4-.1-.8-.2-1.1s-.4-.7-.7-1-.6-.5-1-.7-.8-.2-1.2-.2h-1.2c-.6 0-1.2 0-1.8 0-.7 0-1.2.2-1.5.6V65.8c0 .1.1.1.2.2h4.9c0-.1.1-.1.2-.2 1.6-.6 2.4-1.7 2.4-3.2v-3.7H18.4v.2c0 .3 0 .6 0 .8.1 1 .5 1.9 1.1 2.6.7.7 1.6 1.1 2.5 1.1 1.1 0 2.2 0 3.3 0H26.7H43.5c2.7 0 4.1-1.4 4.1-4.1 0-.2 0-.3 0-.5h10.4c0 .3 0 .6 0 .9v2.3c-.1 2 1.1 3.5 2.8 4.1.1 0 .2.1.2.1h5c.1 0 .1-.1.2-.2V32.2c.1-.1.1-.2-.1-.2v.1zm-4.5 31.7c-.6 0-1-.4-1-1v-.3V35.1c0-1.2.2-1.5 1.5-1.5h1.8v30.2h-2.3zm-3.1-23v15.7H47.7V40.9H58.1zM35.9 28.9v5.1H30.1V28.9h5.8zm-3.1-1.8C26.2 27 20.7 21.4 20.8 14.9 20.9 8 26.3 2.7 33.1 2.7h.1c1.6 0 3.2.3 4.6.9 1.4.6 2.7 1.5 3.8 2.6 1.1 1.1 2 2.5 2.6 4s.9 3.1.9 4.7c-.1 6.7-5.6 12.1-12.3 12.1l-.1.1zm12.7 11c0 7.1 0 14.2 0 21.3 0 1.3-.5 1.9-1.9 1.9H22.3c-1.3 0-1.9-.5-1.9-1.9V38.1c0-1.3.5-1.9 1.9-1.9h21.4c1.3.1 1.8.6 1.8 1.9zm-27.2 2.8v15.7H7.9V40.9h10.4zm-15.3 23H2.4V33.7c.2 0 .4 0 .6 0 .6 0 1.2 0 1.8 0s.8.5.8.8v29.3H3zm31.7-25.7c-1.1 0-2.1 0-3.2 0H31.5c-1.2 0-1.5.3-1.5 1.5v9h6.1V39.4c0-.9-.4-1.3-1.3-1.3zm-7.5 0c-1.1 0-2.3 0-3.4 0-1 0-1.4.3-1.4 1.4V58.1h6.1v-17.7c.2-.9-.2-1.3-1.3-1.3zm15 0c-1 0-2.2 0-3.5 0-.9 0-1.3.4-1.3 1.3v17.7h6.1V48.7v-9.3c.1-.9-.3-1.3-1.3-1.3zm-2.1-30.6c-1.9-1.9-4.5-2.9-7.2-2.9H32.8c-2 0-4 .6-5.7 1.8-1.7 1.2-3 2.8-3.7 4.7-.7 1.9-.9 4-.5 5.9.4 2 1.4 3.8 2.9 5.2 1.9 1.9 4.5 2.9 7.2 2.9h.1c5.5-.1 10.1-4.8 10-10.3-.1-1.4-.4-2.7-.9-4-1-1.3-1.8-2.4-2.8-3.3zm1 7.4c0 1.1-.2 2.1-.6 3.1-.4 1-1 1.9-1.8 2.6-.8.8-1.7 1.4-2.7 1.8-1 .4-2.1.6-3.1.6h-.1c-2.1 0-4.2-.9-5.7-2.4s-2.4-3.5-2.4-5.7c0-2.2.9-4.2 2.4-5.7s3.5-2.4 5.7-2.4h.1c2.2 0 4.2.9 5.7 2.4 1.6 1.5 2.4 3.6 2.4 5.7zm-6.3.1c-.8-.4-.9-.9-.8-1.6 0-.1 0-.1-.1-.2 0-.1 0-.1-.1-.2 0-.1 0-.1-.1-.2h-.4c-.6-.7-1-1.2-1.6-1.2s-1 .4-1.1 1.1V12.3c0 .6 0 1.2.1 1.8 0 .4-.1.6-.5.8-.7.3-1.3.9-1.6 1.6-.3.7-.4 1.5-.3 2.2s.5 1.4 1.1 1.9.7.8 1.5.8h.1c.7 0 1.5-.2 2.1-.7s1-1.1 1.2-1.8c.6-1.5-.1-3.2-1.4-3.9zm-.5 2.9c0 .2 0 .4-.1.6s-.1.3-.3.4c-.1.1-.3.2-.5.3s-.4.1-.6 0c-.2 0-.4-.1-.5-.3s-.2-.3-.3-.5c0-.2 0-.4-.1-.6 0-.2.1-.4.2-.6s.3-.3.5-.4c.2-.1.4-.2.6-.2s.8.2 1 .4.4.6.4 1.1z" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, me gustaría cotizar equipos de Medición y Control del agua.")
  },
  {
    id: "item-p-4",
    title: "Agua Potable",
    icon: (
      <svg viewBox="0 0 70 67" className={s.bubbleSvg}>
        <path d="M57.1 64.7c-.9-5.5-1.8-11.1-2.6-16.6-.2-1.3-.4-2.5-.6-3.9.3 0 .6 0 .9 0 .8 0 1.2-.4 1.3-1.1.1-1.5.1-3 0-4.4 0-.7-.5-1.1-1.2-1.1h-1.1c0-1.1 0-2.1-.1-3.1-.1-5.7-3.9-10.5-9.6-11.8-1.7-.4-3.5-.3-5.3-.4-.4 0-.7-.1-.8-.5-.4-.8-.9-1.7-1.3-2.5-.4-1-.1-1.6 1.1-1.4-.1 0-.2 0-.3 0V17.1c0-.8 0-1.6 0-2.3 0-1-.4-1.4-1.4-1.4h-.8v-2.2h.8c2.7 0 5.4 0 8.1 0 1 0 1.4-.4 1.4-1.3 0-1.3 0-2.6 0-3.9 0-1.1-.4-1.5-1.5-1.5-2.7 0-5.4 0-8.1 0-.2 0-.5 0-.8-.1 0-.4 0-.7 0-1.1-.1-1.9-1.6-3.3-3.5-3.3s-3.4 1.4-3.5 3.3c0 .3 0 .7 0 1.1h-.8c-2.7 0-5.4 0-8.1 0-1 0-1.4.4-1.4 1.4 0 1.3 0 2.6 0 3.9 0 1.1.4 1.5 1.5 1.5H24c.2 0 .5 0 .7.1v2.1c-.2 0-.4.1-.6.1-1.4 0-1.7.3-1.7 1.6 0 .9 0 1.8 0 2.7-.2 0-.4 0-.6 0-1-.1-1.5.3-1.9 1.1-.4 1-.9 1.9-1.5 2.9-.1.2-.3.4-.5.4-1.2 0-2.4 0-3.7 0v-3.4H9.7v-2.1H.5v21.9H9.7v-2.2c1.3 0 2.6 0 3.8 0 .6 0 .8-.2.8-.8 0-.8 0-1.7 0-2.5H14.9c7.9 0 15.8 0 23.7 0 2.5 0 4.1 2 3.5 4.4-.3 0-.6 0-.9 0-.8 0-1.3.4-1.3 1.1 0 1.4 0 2.8 0 4.3 0 .7.5 1.1 1.2 1.1h.9c0 .1 0 .2 0 .3-1.1 6.6-2.1 13.3-3.2 19.9-.1.7 0 1.3.7 1.8h17c.6-.3.9-.8.7-1.5zM7.3 36.5H2.8V18.9h4.5v17.6zm4.7-2.2H9.8V21.1h2.2v13.2zm24.4-27.5h3.3v2.1h-3.3V6.8zm-7 0H34V9H29.4V6.8zm2.2 8.8v2.1H24.8v-2.1H31.6zm-4.5-2.3V11.2h2.2v2.1H27.1zm.5-10.7c.2-.1.4-.2.6-.2s.4 0 .6.1c.9.4.6 1.2.6 2H27.1c0-.7-.3-1.5.5-2zm-7.6 6.3h-3.4V6.8H20.1V9zm2.4 0V6.8H27V9H22.5zm16 22c-7.8 0-15.6 0-23.3 0H14.4V24.5c1.7 0 3.4-.1 5.1.1 1.7.2 3.3.6 5.1.9.1-.7.3-1.4.4-2.1l-4.3-.8c.4-.8.7-1.5 1.1-2.2.1-.1.2-.2.3-.2.1-.1.2-.1.3-.1 3.9 0 7.7 0 11.6 0 .2 0 .5.1.6.2.4.7.8 1.4 1.2 2.2l-4.3.8c.1.7.3 1.4.4 2.1 1.7-.3 3.4-.8 5.1-1 3.9-.4 7.8-.3 10.9 2.5 2 1.8 3.2 4 3.3 6.6.1 1.3 0 2.6 0 3.9H44.4v-1.1c-.1-3.1-2.6-5.5-5.9-5.5v.1zm15.1 8.8v2.1H42.1V39.8H53.6zm-1.2 24.2l-1-8.9h-2.3l1 8.9H45.8c.7-4 1.4-7.9 2.1-11.9l-2.3-.4c-.7 4.1-1.4 8.2-2.1 12.3H41.1c1-6.6 2-13.2 3.1-19.8H51.5c1 6.6 2 13.2 3.1 19.8H52.4zm7-2.3c-.2-1.4-.4-2.7-.7-4.1-.5-2.2-1.5-4.2-3.5-5.6-2-1.4-4.7-1.3-6.3.2-2.1 2.1-1.5 5.6 1.4 7 2.5 1.3 5 2.6 7.1 4.4.3.2.9.3 1.2.2.3-.1.6-.6.7-.9v-1.2l-.6.2zm-8.2-4.4c-.8-.5-1.2-1.2-1.3-2.1-.1-1.3 1.3-2.3 2.7-1.9 1.2.3 2 1 2.6 2 1 1.6 1.4 3.3 1.6 5.1-1.9-1.1-3.8-2.1-5.6-3.1zM69.3 52.4c-.5-1.5-1.6-2.4-3.1-2.7-1.6-.3-3 .2-4.1 1.4-2 2.4-2.6 5.2-2.6 8.2v1.5c.1.5.3 1 .9 1h1.2c.4 0 .8-.1 1.2-.4.5-.4.9-1 1.5-1.3 1.4-1 2.9-2 4.3-2.9 1.7-1 2.6-3 2.1-4.8zm-2.7 2.3c-.1.1-.3.2-.4.3-1.4 1-2.9 1.9-4.4 3 .1-2.1.8-3.9 2.1-5.5.7-.8 1.9-.8 2.7-.1.7.6.7 1.5-.1 2.3zm-32.7-10.5h-2.2v2.1h2.2v-2.1zm25.4 3.3H57.2v2.1H59.4v-2.1zm4.6-8.8H61.8v2.1h2.2v-2.1zm-25.4 12.1h-2.2V53H38.6v-2.1z" fill="currentColor"/>
        </svg>
    ),
    link: waLink("Hola Ingenova, quiero cotizar equipos y servicios de tratamiento de Agua Potable.")
  },
  {
    id: "item-p-5",
    title: "Bombeo",
    icon: (
      <svg viewBox="0 0 60 52" className={s.bubbleSvg}>
        <path d="M45.5 7.3c1.8 0 3.5 0 5.3 0 2.3 0 4.7 0 7 0 .7 0 1.3-.2 1.7-.8V1c-.3-.6-.8-.8-1.5-.8-4.3 0-8.6 0-12.9 0-.6 0-1.3 0-1.9.1-3 .4-5.2 2.4-5.6 5.3-.2 1.4-.1 2.9-.1 4.3 0 .2 0 .4-.1.7-1.2.2-1.4.5-1.4 1.7 0 1.1 0 2.3 0 3.4V16.8h-2.1c0-.2-.1-.4-.1-.5-.2-1.1-.9-1.9-2-2-1.2-.1-2.4-.1-3.6.1-.5 0-1 .2-1.3.5s-.6.7-.6 1.2c0 .2 0 .4 0 .6H23.3v-1.7c0-.6 0-1.1 0-1.7 0-1-.4-2-1.1-2.7s-1.7-1.1-2.7-1.1c-.9 0-1.8 0-2.7 0-2.5 0-4.1 1.6-4.1 4.2 0 .5 0 .9 0 1.4-.1 0-.2 0-.2.1-5.7.8-9.4 4-11.3 9.4-.3.9-.4 1.8-.6 2.8v2.6c.1.6.2 1.3.4 1.9C1.5 36.2 2.9 38.5 4.9 40.3s4.4 3 7 3.4c.2 0 .4.1.7.1v5H12c-3.3 0-6.6 0-9.8 0-.7 0-1.3.2-1.7.8V50.3c.3.6.8.8 1.5.8h55.9c.7 0 1.2-.2 1.5-.8v-.7c-.3-.6-.8-.8-1.5-.8H23.2v-.1h-.8v-5H26.3c0 .2 0 .4 0 .6.1.5.3 1 .7 1.3.4.4.9.5 1.4.6 1 .0 2 0 3 0 1.4 0 2.2-.7 2.4-2.1 0-.1.0-.2.1-.4h15.3c1.7 0 1.9-.2 1.9-1.9v-4.1H51.8c2 0 4 0 6-.1.7 0 1.2-.2 1.5-.8V23.7c-.3-.6-.8-.8-1.5-.8-2.1.0-4.1 0-6.1 0h-.7V18.9c0-1.9-.2-2.1-2.1-2.1H46.4v-4.8c0-1.6 0-3.2 0-4.8 0-.5-.1-1-.6-1.2-.3-.1-.5-.2-.8-.2 0-1-.0-2 .1-3 0-.1.3-.3.5-.3zm-30.5 7.6c0-.4.2-.7.5-1s.6-.4 1-.4h3c.4 0 .8.1 1 .4s.5.7.5 1.1v1.6H15v-1.7zm5 33.8h-5v-4.9h5v4.9zm6.2-7.3H25.7c-3.9 0-7.7 0-11.6-.1-5.2 0-9.4-3.2-10.8-8.1C1.3 26.7 5.9 19.9 12.7 19.2c.5 0 1 0 1.4 0H25.6h.7v22.3zm24.9-16.3h6v10.2H51.2V25.2zm-12.8-12.1H44V16.8H38.4V13.1zm10.4 6.1v22.3H33.9c0-.2 0-.4 0-.6 0-1.6 0-3.2 0-4.8.1-.2 0-.5 0-.7-.1-.3-.2-.5-.4-.7-.2-.2-.5-.3-.7-.3-.3 0-.5.1-.7.3-.2.2-.3.4-.3.7c0 .3 0 .7.1 1 0 2.3 0 4.6 0 6.9V44H28.7V16.6H31.5c0 .2 0 .4 0 .7.0 2.5 0 5.1.0 7.6 0 1 .9 1.6 1.7 1.1.5-.3.6-.8.6-1.3 0-1.7 0-3.3 0-5V19.2H48.8zm-6.2-11.9c0 .5 0 1.1 0 1.6s0 1.1 0 1.7H39.7c.1-1.6.0-3.3.3-4.9.3-2 2-3.2 4.4-3.2 2.6 0 5.3 0 7.9 0H57.2v2.4H55.2L45.9 5c-.3 0-.6 0-.9 0-1.4.1-2.2.9-2.3 2.3H42.7zm-19.3 17.1c.1.2 0 .3-.1.5-.1.1-.2.3-.3.4s-.3.1-.5.2-.3 0-.5 0c-1-.0-2 0-3 0-.2 0-.3-.1-.5-.2s-.3-.2-.4-.3-.2-.3-.2-.5 0-.3.1-.5c.0-.6.5-1.1 1.2-1.1h1.4c.5 0 1 .1 1.5.1.7.0 1.1.5 1.2 1.1s.1.3.1.3zm0 5.9c0 .2 0 .3-.1.5-.1.1-.2.3-.3.4s-.3.1-.5.2-.3 0-.5 0c-1-.0-2 0-3 0-.3 0-.6-.1-.8-.3-.2-.2-.3-.5-.3-.8s.5-1.1 1.2-1.1h1.5 1.5c.3-.0.6.1.8.3.2.2.3.5.3.8zm0 5.9c0 .6-.5 1.1-1.2 1.2-.5 0-1-.1-1.5-.1-.5 0-1 0-1.5-.1-.7-.1-1.2-.6-1.2-1.2 0-.6.5-1.1 1.2-1.2.9-.2 1.9-.2 2.9 0 .8.1 1.3.6 1.3 1.4zm10.5-5.9c0 .2 0 .3-.1.5-.1.1-.2.3-.3.4s-.3.1-.5.2-.3 0-.5 0c-.3 0-.6-.1-.8-.3-.2-.2-.3-.5-.3-.8 0-.3.1-.6.3-.8s.5-.3.8-.3c.3 0 .6.1.8.3.2.2.3.5.3.8z" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, me interesa cotizar equipos o mantenimiento para sistemas de Bombeo.")
  },
  {
    id: "item-p-6",
    title: "Turcos & Sauna",
    icon: (
      <svg viewBox="0 0 61 60" className={s.bubbleSvg}>
        <path d="M48.9 49.2c0 .2-.1.4-.2.6-.1.1-.3.3-.5.4-.2.1-.4.2-.6.2-.2 0-.4-.1-.6-.2-.3-.2-.4-.4-.5-.6-.1-.2-.2-.4-.2-.6s0-.4.2-.6.3-.3.5-.4c.2-.1.4-.2.6-.2s.4.1.6.2.3.3.5.4c.1.2.2.4.2.6zm-26.5 4.5c0 .3-.1.6-.3.8s-.5.3-.8.3c-.2 0-.4-.1-.6-.2s-.3-.3-.4-.5-.2-.3-.2-.5 0-.3.1-.5c.0-.6.5-1.1 1.2-1.1h1.4c.5 0 1 .1 1.5.1.7.0 1.1.5 1.2 1.1s.1.3.1.3zm26.5-4.5c.1.2.2.4.2.6s-.1.4-.2.6c-.2.2-.4.3-.6.3-.2.0-.4 0-.6-.1-.3-.1-.5-.3-.6-.6s-.1-.6.2-.9c.2-.2.5-.3.8-.3s.6.1.8.3.2.2.2.2zM33.9 30.3c0 .2-.1.3-.2.5-.1.1-.2.3-.3.4s-.3.1-.5.2c-.2.1-.4.1-.6.1-.3 0-.6-.1-.8-.3-.2-.2-.3-.5-.3-.8 0-.2.1-.4.2-.6s.3-.3.5-.4.4-.2.6-.2.4.1.6.2.3.3.5.4c.1.2.3.4.3.6z" fill="currentColor"/>
        <path d="M60.2 62.8c0-.1 0-.2-.1-.3V35.1c0-1.2.2-1.5 1.5-1.5h1.8v30.2h-2.3zm-3.1-23v15.7H47.7V40.9H58.1zM35.9 28.9v5.1H30.1V28.9h5.8zm-3.1-1.8C26.2 27 20.7 21.4 20.8 14.9 20.9 8 26.3 2.7 33.1 2.7h.1c1.6 0 3.2.3 4.6.9 1.4.6 2.7 1.5 3.8 2.6 1.1 1.1 2 2.5 2.6 4s.9 3.1.9 4.7c-.1 6.7-5.6 12.1-12.3 12.1l-.1.1zm12.7 11c0 7.1 0 14.2 0 21.3 0 1.3-.5 1.9-1.9 1.9H22.3c-1.3 0-1.9-.5-1.9-1.9V38.1c0-1.3.5-1.9 1.9-1.9h21.4c1.3.1 1.8.6 1.8 1.9zm-27.2 2.8v15.7H7.9V40.9h10.4zm-15.3 23H2.4V33.7c.2 0 .4 0 .6 0 .6 0 1.2 0 1.8 0s.8.5.8.8v29.3H3zm31.7-25.7c-1.1 0-2.1 0-3.2 0H31.5c-1.2 0-1.5.3-1.5 1.5v9h6.1V39.4c0-.9-.4-1.3-1.3-1.3zm-7.5 0c-1.1 0-2.3 0-3.4 0-1 0-1.4.3-1.4 1.4V58.1h6.1v-17.7c.2-.9-.2-1.3-1.3-1.3zm15 0c-1 0-2.2 0-3.5 0-.9 0-1.3.4-1.3 1.3v17.7h6.1V48.7v-9.3c.1-.9-.3-1.3-1.3-1.3zm-2.1-30.6c-1.9-1.9-4.5-2.9-7.2-2.9H32.8c-2 0-4 .6-5.7 1.8-1.7 1.2-3 2.8-3.7 4.7-.7 1.9-.9 4-.5 5.9.4 2 1.4 3.8 2.9 5.2 1.9 1.9 4.5 2.9 7.2 2.9h.1c5.5-.1 10.1-4.8 10-10.3-.1-1.4-.4-2.7-.9-4-1-1.3-1.8-2.4-2.8-3.3zm1 7.4c0 1.1-.2 2.1-.6 3.1-.4 1-1 1.9-1.8 2.6-.8.8-1.7 1.4-2.7 1.8-1 .4-2.1.6-3.1.6h-.1c-2.1 0-4.2-.9-5.7-2.4s-2.4-3.5-2.4-5.7c0-2.2.9-4.2 2.4-5.7s3.5-2.4 5.7-2.4h.1c2.2 0 4.2.9 5.7 2.4 1.6 1.5 2.4 3.6 2.4 5.7zm-6.3.1c-.8-.4-.9-.9-.8-1.6 0-.1 0-.1-.1-.2 0-.1 0-.1-.1-.2 0-.1 0-.1-.1-.2h-.4c-.6-.7-1-1.2-1.6-1.2s-1 .4-1.1 1.1V12.3c0 .6 0 1.2.1 1.8 0 .4-.1.6-.5.8-.7.3-1.3.9-1.6 1.6-.3.7-.4 1.5-.3 2.2s.5 1.4 1.1 1.9.7.8 1.5 .8h.1c.7 0 1.5-.2 2.1-.7s1-1.1 1.2-1.8c.6-1.5-.1-3.2-1.4-3.9zm-.5 2.9c0 .2 0 .4-.1.6s-.1.3-.3.4c-.1.1-.3.2-.5.3s-.4.1-.6 0c-.2 0-.4-.1-.5-.3s-.2-.3-.3-.5c0-.2 0-.4-.1-.6 0-.2.1-.4.2-.6s.3-.3.5-.4c.2-.1.4-.2.6-.2s.8.2 1 .4.4.6.4 1.1z" fill="currentColor"/>
      </svg>
    ),
    link: waLink("Hola Ingenova, quiero cotizar mantenimiento para zonas húmedas de Turcos y Saunas.")
  }
];

const SOLUTIONS = [
  {
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=900&auto=format&fit=crop",
    title: "Manuales y Catálogos",
    desc: "Accede de forma directa a las fichas técnicas, catálogos y manuales de operación de los equipos de las principales marcas aliadas.",
    icon: "📄",
    link: waLink("Hola Ingenova, necesito manuales y fichas técnicas de equipos para zonas húmedas.")
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop",
    title: "Diseña tu Zona Húmeda",
    desc: "Asesoría personalizada en planos 3D para la óptima distribución de jacuzzis, saunas, turcos y cuartos de máquinas.",
    icon: "📐",
    link: waLink("Hola Ingenova, quiero asesoría para diseñar mi zona húmeda o piscina.")
  },
  {
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=900&auto=format&fit=crop",
    title: "Cuarto de Máquinas",
    desc: "Instalación técnica de bombas de calor, colectores solares, cloradores salinos y filtros de última generación.",
    icon: "⚙️",
    link: waLink("Hola Ingenova, me interesa optimizar o reparar el cuarto de máquinas de mi piscina.")
  },
  {
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=900&auto=format&fit=crop",
    title: "Blog de Consejos",
    desc: "Guías prácticas escritas por ingenieros certificados sobre el correcto balance químico del agua y cuidado invernal.",
    icon: "💡",
    link: waLink("Hola Ingenova, me gustaría leer consejos y mejores prácticas para el cuidado de mi piscina.")
  }
];

const BEST_SELLERS = [
  {
    image: "https://images.unsplash.com/photo-1585130401366-fe05a8d813c4?q=80&w=600&auto=format&fit=crop",
    name: "Clorador Salino BSV Evo Basic",
    desc: "Desinfección ecológica automática sin olor a cloro químico. Ideal para pieles sensibles y niños.",
    price: "Cotizar ahora",
    tag: "Ecológico",
    link: waLink("Hola Ingenova, quiero cotizar el Clorador Salino BSV Evo Basic.")
  },
  {
    image: "https://images.unsplash.com/photo-1542013936693-8848e5740a7a?q=80&w=600&auto=format&fit=crop",
    name: "Bomba de Calor Pentair UltraTemp",
    desc: "Calefacción inteligente de alto rendimiento. Mantén tu piscina temperada todo el año con mínimo consumo.",
    price: "Cotizar ahora",
    tag: "Eficiencia",
    link: waLink("Hola Ingenova, me gustaría cotizar la Bomba de Calor Pentair UltraTemp.")
  },
  {
    image: "https://images.unsplash.com/photo-1608501078713-8e445a709b39?q=80&w=600&auto=format&fit=crop",
    name: "Filtro de Arena AstralPool Cantabric",
    desc: "Filtro inyectado en plástico técnico con válvula colectora. Máxima durabilidad garantizada.",
    price: "Cotizar ahora",
    tag: "Durabilidad",
    link: waLink("Hola Ingenova, solicito cotización para el Filtro de Arena AstralPool Cantabric.")
  },
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    name: "Kit de Reactivos Taylor K-2006",
    desc: "El estándar de oro para el análisis químico preciso de pH, cloro libre, alcalinidad y dureza.",
    price: "Cotizar ahora",
    tag: "Medición",
    link: waLink("Hola Ingenova, quiero comprar el Kit de Reactivos Taylor K-2006.")
  }
];

const TESTIMONIALS = [
  {
    quote: "Llevamos 3 años con el mantenimiento preventivo de Ingenova en nuestro conjunto. El agua siempre está perfecta y las inspecciones técnicas nos dan total tranquilidad. Su garantía escrita nos respalda.",
    author: "Ing. Mauricio Restrepo",
    role: "Administrador Copropiedad Residencial",
    location: "Chía, Cundinamarca",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "Repararon la caldera y el blower de nuestro jacuzzi campestre de un día para otro. La respuesta de servicio al cliente es espectacular, y el técnico certificado nos explicó todo el diagnóstico paso a paso.",
    author: "María Camila Fonseca",
    role: "Propietaria Finca de Recreo",
    location: "Sopó, Sabana Norte",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  },
  {
    quote: "El sistema de vapor del turco y la automatización de la piscina de nuestro hotel campestre están en sus manos. Son profesionales, limpios en su trabajo y cumplen rigurosamente con la normatividad sanitaria.",
    author: "Alejandro Valenzuela",
    role: "Director de Operaciones Hoteleras",
    location: "Bogotá D.C.",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  }
];

const BRANDS = [
  { name: "AstralPool", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop" },
  { name: "Hayward", logo: "https://images.unsplash.com/photo-1608501078713-8e445a709b39?q=80&w=200&auto=format&fit=crop" },
  { name: "Pentair", logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200&auto=format&fit=crop" },
  { name: "Taylor", logo: "https://images.unsplash.com/photo-1542013936693-8848e5740a7a?q=80&w=200&auto=format&fit=crop" },
  { name: "Lovibond", logo: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&auto=format&fit=crop" },
  { name: "BSV", logo: "https://images.unsplash.com/photo-1585130401366-fe05a8d813c4?q=80&w=200&auto=format&fit=crop" }
];

export default function IngenovaClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const [visibleItems, setVisibleItems] = useState<{ [key: string]: boolean }>({});

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

  // Sticky header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      {/* ══════════ NAVBAR ══════════ */}
      <header className={`${s.header} ${isScrolled ? s.scrolled : ""}`}>
        <div className={s.navContainer}>
          <a href="#inicio" className={s.logoLink}>
            <Image
              src="/ingenova-logo.jpg"
              alt="Ingenova Logo"
              width={160}
              height={65}
              className={s.logoImg}
              priority
              style={{ width: "auto", height: "50px" }}
            />
          </a>

          {/* Desktop Nav */}
          <nav className={s.navMenu}>
            <a href="#inicio" className={s.navLink}>Inicio</a>
            <a href="#bienvenidos" className={s.navLink}>Líneas</a>
            <a href="#soluciones" className={s.navLink}>Soluciones</a>
            <a href="#productos" className={s.navLink}>Productos</a>
            <a href="#opiniones" className={s.navLink}>Opiniones</a>
            <a href="#contacto" className={s.navLink}>Contacto</a>
          </nav>

          {/* CTAs */}
          <div className={s.headerActions}>
            <a href={WA_BASE} target="_blank" rel="noreferrer" className={s.btnNavWa}>
              <span className={s.waDot} /> Cotizar por WhatsApp
            </a>
            <button 
              className={`${s.burger} ${isDrawerOpen ? s.burgerOpen : ""}`} 
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Menú Móvil"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`${s.drawer} ${isDrawerOpen ? s.drawerOpen : ""}`}>
        <nav className={s.drawerNav}>
          <a href="#inicio" className={s.drawerLink} onClick={() => setIsDrawerOpen(false)}>Inicio</a>
          <a href="#bienvenidos" className={s.drawerLink} onClick={() => setIsDrawerOpen(false)}>Líneas de Negocio</a>
          <a href="#soluciones" className={s.drawerLink} onClick={() => setIsDrawerOpen(false)}>Soluciones</a>
          <a href="#productos" className={s.drawerLink} onClick={() => setIsDrawerOpen(false)}>Productos</a>
          <a href="#opiniones" className={s.drawerLink} onClick={() => setIsDrawerOpen(false)}>Opiniones</a>
          <a href="#contacto" className={s.drawerLink} onClick={() => setIsDrawerOpen(false)}>Contacto</a>
          <a href={WA_BASE} target="_blank" rel="noreferrer" className={s.btnDrawerWa} onClick={() => setIsDrawerOpen(false)}>
            Hablar con un Técnico
          </a>
        </nav>
      </div>

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
            <span className={s.subTitle}>Bienvenidos a Ingenova</span>
            <h2 className={s.mainTitle}>Ingenova Soluciones Integrales</h2>
            <p className={s.welcomeParagraph}>
              Somos una compañía colombiana líder en el diseño, mantenimiento y equipamiento de zonas húmedas premium. Con el respaldo de <strong>Soluciones Integrales AS SAS</strong>, nos comprometemos a entregar agua en perfectas condiciones físico-químicas, sanitarias y estéticas. Nuestra pasión es la ingeniería del agua para el confort de tu hogar y de tu comunidad.
            </p>
            <a href="#contacto" className={s.btnPrimaryGold}>Agendar Asesoría</a>
          </div>

          <h3 className={s.waveSectionTitle}>
            Nuestras Líneas de <strong>Negocio</strong>
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
                stroke="#C9A84C" 
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
            <span className={s.subTitle}>Especialidad Técnica</span>
            <h2 className={s.mainTitle}>Soluciones Integrales para Copropiedades y Hogares</h2>
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
                  <a href={sol.link} target="_blank" rel="noreferrer" className={s.solutionBtn}>
                    Solicitar Información
                  </a>
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
            <span className={s.subTitle}>Equipos y Químicos</span>
            <h2 className={s.mainTitle}>Los Más Vendidos</h2>
            <p className={s.sectionSubtext}>
              Distribuimos e instalamos repuestos originales con garantía y respaldo de fábrica directa.
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
              <h3>¿Buscas un equipo específico o repuestos para tu cuarto de máquinas?</h3>
              <p>Habla hoy mismo con un ingeniero certificado. Hacemos despachos e instalaciones técnicas en tiempo récord.</p>
            </div>
            <a 
              href={waLink("Hola Ingenova, necesito asesoría sobre repuestos e instalación de equipos para mi piscina.")} 
              target="_blank" 
              rel="noreferrer" 
              className={s.btnPrimaryGold}
            >
              Asesoría Técnica Inmediata
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
            <span className={s.subTitle}>Nuestros Clientes Opinan</span>
            <h2 className={s.mainTitle}>Casos de Éxito y Respaldo</h2>
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
                style={{ width: "auto", height: "45px" }}
              />
              <p className={s.footerBrandDesc}>
                Expertos en el diseño, mantenimiento y equipamiento de piscinas, jacuzzis y turcos. Respaldo de Soluciones Integrales AS SAS.
              </p>
              <div className={s.footerSocials}>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">FB</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
                <a href={WA_BASE} target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className={s.footerCol}>
              <h4 className={s.footerColTitle}>Enlaces Rápidos</h4>
              <ul className={s.footerLinks}>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#bienvenidos">Líneas de Negocio</a></li>
                <li><a href="#soluciones">Nuestras Soluciones</a></li>
                <li><a href="#productos">Productos Premium</a></li>
                <li><a href="#opiniones">Opiniones de Clientes</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Details */}
            <div className={s.footerCol}>
              <h4 className={s.footerColTitle}>Contacto Comercial</h4>
              <ul className={s.footerContactList}>
                <li>
                  <span className={s.contactIcon}>📞</span>
                  <a href="tel:+573001234567">+57 300 123 4567</a>
                </li>
                <li>
                  <span className={s.contactIcon}>✉️</span>
                  <a href="mailto:gerencia@ingenova.com.co">gerencia@ingenova.com.co</a>
                </li>
                <li>
                  <span className={s.contactIcon}>📍</span>
                  <span>Bogotá & Sabana de Bogotá, Colombia</span>
                </li>
                <li>
                  <span className={s.contactIcon}>🕒</span>
                  <span>Lun - Vie: 8:00 AM - 5:30 PM<br />Sáb: 8:00 AM - 1:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom (Payments / Copyright) */}
        <div className={s.footerBottom}>
          <div className={s.footerBottomContainer}>
            <p className={s.copyright}>
              © {new Date().getFullYear()} INGENOVA · Soluciones Integrales AS SAS. Todos los derechos reservados.
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
    </div>
  );
}
