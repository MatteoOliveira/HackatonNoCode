export interface Atelier {
  id: string;
  titre: string;
  description: string;
  association: string;
  lieu: string;
  horaire_debut: string;
  horaire_fin: string;
  capacite: number;
  inscrits: number;
  programme: "exile" | "feminin" | "apa" | "insertion" | "general";
  image_url?: string;
}

export interface Partenaire {
  id: string;
  nom: string;
  logo_url: string;
  description: string;
  site_url?: string;
  type: "association" | "institutionnel" | "sponsor";
}

export interface Don {
  id: string;
  prenom: string;
  email: string;
  montant: number;
  message?: string;
  anonymous: boolean;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  choix: string[];
  bonne_reponse: number;
  explication: string;
}

export interface Quiz {
  id: string;
  titre: string;
  description: string;
  questions: QuizQuestion[];
  actif: boolean;
}

export interface SportMatch {
  id: string;
  nom: string;
  description: string;
  type: "interieur" | "exterieur" | "mixte";
  intensite: "faible" | "moderee" | "elevee";
  collectif: boolean;
  association: string;
  tags: string[];
}

export interface ContactFormData {
  nom: string;
  email: string;
  sujet: string;
  message: string;
  consentement: boolean;
}
