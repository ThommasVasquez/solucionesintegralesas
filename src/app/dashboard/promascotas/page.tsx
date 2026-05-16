import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import styles from "./promascotas.module.css";

export const runtime = 'edge';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1hLseTl6VfGFoVG8rIND5vDiwbX36xNiaOeMYDxVTl54/edit?usp=sharing";

export default async function ProMascotasPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.iframeWrapper}>
        <iframe 
          src={SHEET_URL}
          className={styles.iframe}
          title="Gestión de Visitas ProMascotas"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div>
    </main>
  );
}
