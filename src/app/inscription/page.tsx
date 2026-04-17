import type { Metadata } from "next";
import { Suspense } from "react";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Rejoindre Solimouv' – Inscription",
  description:
    "Rejoignez la communauté Solimouv' en 5 étapes. Créez votre profil inclusif pour participer au festival du sport pour tous.",
};

export default function InscriptionPage() {
  return (
    <Suspense>
      <OnboardingFlow />
    </Suspense>
  );
}
