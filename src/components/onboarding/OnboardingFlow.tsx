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

const TOTAL = 6;

function isStepValid(step: number, data: OnboardingData): boolean {
  switch (step) {
    case 1:
      return data.pseudo.trim() !== "" && data.email.trim() !== "" && data.password.length >= 6;
    case 2:
      return data.pronouns !== "";
    case 3:
      return data.pratique !== "";
    case 4:
      return data.besoin !== "";
    case 5:
      return data.accessibilite.length > 0;
    case 6:
      return true;
    default:
      return false;
  }
}

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    pseudo: "",
    email: "",
    password: "",
    pronouns: "",
    pratique: "",
    besoin: "",
    accessibilite: [],
  });

  function update(partial: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function handleNext() {
    if (step < TOTAL) {
      setStep((s) => s + 1);
    } else {
      // Persist data (BDD connection later)
      try {
        localStorage.setItem("solimouv_user", JSON.stringify({ ...data, password: undefined }));
      } catch {}
      router.push("/programme");
    }
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
    else router.push("/");
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
      nextDisabled={!isStepValid(step, data)}
    >
      {stepContent()}
    </OnboardingLayout>
  );
}
