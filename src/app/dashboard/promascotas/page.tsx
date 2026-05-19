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

  // Si el usuario es Sergio, mostrar su enlace específico, de lo contrario, el general
  const isSergio = session.user?.email === "sergio@ingenova.com.co";
  const currentSheetUrl = isSergio
    ? "https://docs.google.com/spreadsheets/d/1d0yCW0dVJjlhk4X4rQVVs_G62K8QEhEIgZQZHzltaqI/edit?usp=sharing"
    : SHEET_URL;

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.iframeWrapper}>
        <iframe 
          src={currentSheetUrl}
          className={styles.iframe}
          title="Gestión de Visitas ProMascotas"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div>
    </main>
  );
}
