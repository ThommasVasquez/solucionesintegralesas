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
            <img
              src="/logo_white.png"
              alt="Soluciones Integrales AS SAS"
              className={styles.footerLogo}
            />
          </Link>
          <p className={styles.description}>
            Líderes en mantenimiento de áreas húmedas, administración de
            complejos acuáticos y cuidado especializado de mascotas bajo un solo
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
              <Link href="#servicios">ClubHouse (Capacitación)</Link>
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
          Powered by all the strength of
          <Image
            src="/energysoft_logo.svg"
            alt="EnergySoft Logo"
            width={100}
            height={20}
            className={styles.energyLogo}
          />
          | Software con Energía! ⚡️
        </p>
      </div>
    </footer>
  );
}
