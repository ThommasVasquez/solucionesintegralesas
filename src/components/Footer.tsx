"use client";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo_white.png"
              alt="Soluciones Integrales AS SAS"
              width={180}
              height={55}
              className={styles.footerLogo}
              style={{ width: 'auto', height: '70px' }}
            />
          </Link>
          <p className={styles.description}>
            Líderes en mantenimiento de áreas húmedas, servicio e instalación de
            calentadores y cuidado especializado de mascotas bajo un solo
            respaldo corporativo.
          </p>
        </div>

        <div className={styles.links}>
          <h4 className={styles.title}>Nuestras Marcas</h4>
          <ul>
            <li>
              <Link href="#servicios">Ingenova (Piscinas)</Link>
            </li>
            <li>
              <Link href="#servicios">Viva Calentadores (Calentadores)</Link>
            </li>
            <li>
              <Link href="#servicios">ProMascotas (Salud Animal)</Link>
            </li>
            <li>
              <Link href="#politicas">Políticas de Privacidad</Link>
            </li>
          </ul>
        </div>

        <div className={styles.contact}>
          <h4 className={styles.title}>Contacto</h4>
          <ul className={styles.contactList}>
            <li>
              <Phone size={16} className={styles.contactIcon} />
              <span>+57 300 123 4567</span>
            </li>
            <li>
              <Mail size={16} className={styles.contactIcon} />
              <span>contacto@solucionesintegralesas.com</span>
            </li>
            <li>
              <MapPin size={16} className={styles.contactIcon} />
              <span>Bogotá, Colombia</span>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.copyrightLine}>
          &copy; {new Date().getFullYear()} Soluciones Integrales AS SAS. Todos
          los derechos reservados.
          <span className={styles.separator}> | </span>
          <a 
            href="https://www.energysoftmedia.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.energyLink}
          >
            Powered by all the strength of
            <Image
              src="/energysoft_logo.svg"
              alt="EnergySoft Logo"
              width={110}
              height={22}
              className={styles.energyLogo}
              style={{ width: 'auto', height: '22px' }}
            />
            | Software con Energía! ⚡️
          </a>
        </p>
      </div>
    </footer>
  );
}
