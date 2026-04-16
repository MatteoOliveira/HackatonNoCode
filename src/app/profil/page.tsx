import type { Metadata } from "next";
import ProfilClient from "@/components/ProfilClient";

export const metadata: Metadata = {
  title: "Ma bulle sportive – Solimouv'",
  description: "Ton profil sportif personnalisé sur Solimouv'.",
};

export default function ProfilPage() {
  return <ProfilClient />;
}
