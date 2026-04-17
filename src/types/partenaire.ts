export interface PartenaireData {
  id: string;
  nom: string;
  description?: string | null;
  badge?: string | null;
  tags?: string[] | null;
  icon?: string | null;
  image_url?: string | null;
  couleur_theme: string;
}
