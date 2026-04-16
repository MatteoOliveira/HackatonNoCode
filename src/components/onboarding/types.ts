export interface OnboardingData {
  pseudo: string;
  email: string;
  password: string;
  confirmPassword: string;
  pronouns: string;
  pratique: string;
  besoin: string;
  accessibilite: string[];
}

export interface StepProps {
  data: OnboardingData;
  update: (partial: Partial<OnboardingData>) => void;
}
