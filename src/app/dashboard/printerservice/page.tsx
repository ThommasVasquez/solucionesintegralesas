import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PrinterServiceClient from "./PrinterServiceClient";

export const runtime = 'edge';

export default async function PrinterServicePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const isSergio = session.user?.email === "sergio@ingenova.com.co";

  return (
    <PrinterServiceClient 
      user={{ name: session.user?.name, email: session.user?.email }}
      isSergio={isSergio}
    />
  );
}
