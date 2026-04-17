"use server";

import { createClient } from "@/lib/supabase/server";

const MAX_NOM     = 100;
const MAX_EMAIL   = 200;
const MAX_MESSAGE = 2000;
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  // ── Honeypot anti-bot (champ caché que les humains ne remplissent pas)
  const honey = String(formData.get("website") ?? "");
  if (honey) return { error: "Spam détecté." };

  // ── Extraction + nettoyage
  const nom     = String(formData.get("nom")     ?? "").trim().slice(0, MAX_NOM);
  const email   = String(formData.get("email")   ?? "").trim().slice(0, MAX_EMAIL);
  const message = String(formData.get("message") ?? "").trim().slice(0, MAX_MESSAGE);
  const consent = formData.get("consent") === "on";

  // ── Validation serveur
  if (!nom)              return { error: "Le prénom est requis." };
  if (!email)            return { error: "L'adresse mail est requise." };
  if (!EMAIL_RE.test(email)) return { error: "Adresse mail invalide." };
  if (!message)          return { error: "Le message est requis." };
  if (message.length < 10) return { error: "Message trop court (10 caractères min.)." };
  if (!consent)          return { error: "Le consentement RGPD est requis." };

  // ── Insertion Supabase
  try {
    const supabase = await createClient();
    const { error: dbErr } = await supabase.from("messages_contact").insert({
      nom,
      email,
      message,
      sujet: null,
    });
    if (dbErr) return { error: "Erreur lors de l'envoi. Réessaie." };
    return { success: true };
  } catch {
    return { error: "Erreur inattendue. Réessaie." };
  }
}
