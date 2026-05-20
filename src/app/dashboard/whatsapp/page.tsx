import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import WhatsAppDashboard from "./WhatsAppDashboard";
import styles from "./whatsapp.module.css";

export const runtime = 'edge';

export default async function WhatsAppReportsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className={styles.main}>
      <Navbar />
      <div className={styles.content}>
        <WhatsAppDashboard userName={session.user?.name || "Usuario"} />
      </div>
    </main>
  );
}
