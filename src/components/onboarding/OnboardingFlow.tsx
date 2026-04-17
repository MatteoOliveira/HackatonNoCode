"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "./OnboardingLayout";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import type { OnboardingData } from "./types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const TOTAL = 6;

function isStepValid(step: number, data: OnboardingData): boolean {
  switch (step) {
    case 1:
      return (
        data.pseudo.trim() !== "" &&
        data.email.trim() !== "" &&
        data.password.length >= 6 &&
        data.password === data.confirmPassword
      );
    case 2: return data.pronouns !== "";
    case 3: return data.pratique !== "";
    case 4: return data.besoin !== "";
    case 5: return data.accessibilite.length > 0;
    case 6: return true;
    default: return false;
  }
}

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [data, setData]       = useState<OnboardingData>({
    pseudo: "", email: "", password: "", confirmPassword: "",
    pronouns: "", pratique: "", besoin: "", accessibilite: [],
  });

  function update(partial: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...partial }));
    setError("");
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
    else router.push("/");
  }

  async function handleNext() {
    if (step < TOTAL) {
      setStep((s) => s + 1);
      return;
    }
    await finish();
  }

  async function finish() {
    setLoading(true);
    setError("");

    // ── Fallback localStorage si Supabase non configuré ──
    if (!isSupabaseConfigured()) {
      try {
        const { confirmPassword: _, password: __, ...safe } = data;
        localStorage.setItem("solimouv_user", JSON.stringify(safe));
      } catch {}
      router.push("/profil");
      return;
    }

    try {
      const supabase = createClient();

      // 1. Création du compte auth
      const { data: auth, error: authErr } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: { data: { pseudo: data.pseudo } },
      });

      if (authErr) {
        if (authErr.message.includes("already registered")) {
          setError("Cet email est déjà utilisé. Essaie de te connecter.");
        } else {
          setError(authErr.message);
        }
        setLoading(false);
        return;
      }

      const userId = auth.user?.id;
      if (!userId) {
        setError("Compte créé. Vérifie ton email pour le confirmer, puis connecte-toi.");
        setLoading(false);
        return;
      }

      // 2. Insertion du profil
      const { error: profileErr } = await supabase.from("profiles").insert({
        id:            userId,
        pseudo:        data.pseudo.trim(),
        email:         data.email.trim(),
        pronouns:      data.pronouns,
        pratique:      data.pratique,
        besoin:        data.besoin,
        accessibilite: data.accessibilite,
      });

      if (profileErr) {
        // Profil existe déjà → update
        if (profileErr.code === "23505") {
          await supabase.from("profiles").update({
            pseudo:        data.pseudo.trim(),
            pronouns:      data.pronouns,
            pratique:      data.pratique,
            besoin:        data.besoin,
            accessibilite: data.accessibilite,
          }).eq("id", userId);
        } else {
          setError("Erreur lors de la sauvegarde du profil : " + profileErr.message);
          setLoading(false);
          return;
        }
      }

      // 3. Cache local pour affichage immédiat
      try {
        const { confirmPassword: _, password: __, ...safe } = data;
        localStorage.setItem("solimouv_user", JSON.stringify(safe));
      } catch {}

      router.push("/profil");

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur inattendue est survenue.";
      setError(message);
      setLoading(false);
    }
  }

  const stepContent = () => {
    switch (step) {
      case 1: return <Step1 data={data} update={update} />;
      case 2: return <Step2 data={data} update={update} />;
      case 3: return <Step3 data={data} update={update} />;
      case 4: return <Step4 data={data} update={update} />;
      case 5: return <Step5 data={data} update={update} />;
      case 6: return <Step6 data={data} />;
    }
  };

  return (
    <OnboardingLayout
      step={step}
      total={TOTAL}
      onBack={handleBack}
      onNext={handleNext}
      nextLabel={step === TOTAL ? "Compris !" : "Suivant"}
      nextDisabled={!isStepValid(step, data) || loading}
      loading={loading}
      error={error}
    >
      {stepContent()}
    </OnboardingLayout>
  );
}
