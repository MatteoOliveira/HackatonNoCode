import type { Metadata } from "next";
import ConnexionClient from "@/components/ConnexionClient";

export const metadata: Metadata = {
  title: "Se connecter – Solimouv'",
  description: "Connecte-toi à ton profil Solimouv'.",
};

export default function ConnexionPage() {
  return <ConnexionClient />;
}
