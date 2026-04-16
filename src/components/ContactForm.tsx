"use client";

import { useState } from "react";
import type { ContactFormData } from "@/types";

const SUJETS = [
  "Information générale",
  "Programme et ateliers",
  "Partenariat",
  "Bénévolat",
  "Presse & Communication",
  "Autre",
];

const FIELD_STYLE = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "0.75rem",
  border: "2px solid #e5e7eb",
  fontFamily: "inherit",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color 0.2s",
};

export default function ContactForm() {
  const [data, setData] = useState<ContactFormData>({
    nom: "",
    email: "",
    sujet: SUJETS[0],
    message: "",
    consentement: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox"
      ? target.checked
      : target.value;
    setData((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      // TODO: connecter à Supabase ou Make webhook
      await new Promise((r) => setTimeout(r, 1000));
      setStatus("success");
      setData({ nom: "", email: "", sujet: SUJETS[0], message: "", consentement: false });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="p-8 rounded-2xl text-center"
        style={{ backgroundColor: "var(--color-bleu-fonce)", color: "var(--color-blanc)" }}
      >
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl mb-2">Message envoyé !</h3>
        <p className="opacity-70">
          Merci pour votre message. L&apos;équipe d&apos;Up Sport! vous répondra dans les 48h.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 px-6 py-3 rounded-full font-semibold"
          style={{ backgroundColor: "var(--color-orange)", color: "var(--color-blanc)" }}
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="nom">
          Nom complet <span aria-hidden="true" style={{ color: "var(--color-orange)" }}>*</span>
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          value={data.nom}
          onChange={handleChange}
          placeholder="Jean Dupont"
          style={FIELD_STYLE}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="email">
          Email <span aria-hidden="true" style={{ color: "var(--color-orange)" }}>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={data.email}
          onChange={handleChange}
          placeholder="jean@exemple.fr"
          style={FIELD_STYLE}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="sujet">
          Sujet
        </label>
        <select
          id="sujet"
          name="sujet"
          value={data.sujet}
          onChange={handleChange}
          style={FIELD_STYLE}
        >
          {SUJETS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="message">
          Message <span aria-hidden="true" style={{ color: "var(--color-orange)" }}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={data.message}
          onChange={handleChange}
          placeholder="Votre message..."
          style={{ ...FIELD_STYLE, resize: "vertical" }}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consentement"
          name="consentement"
          type="checkbox"
          required
          checked={data.consentement}
          onChange={handleChange}
          className="mt-1 w-4 h-4 cursor-pointer"
        />
        <label htmlFor="consentement" className="text-sm opacity-70 cursor-pointer">
          J&apos;accepte que mes données soient utilisées pour traiter ma demande. Conformément
          au RGPD, vous pouvez exercer vos droits en contactant Up Sport!
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm" style={{ color: "var(--color-orange)" }}>
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !data.consentement}
        className="w-full py-4 rounded-full font-semibold text-lg transition-opacity disabled:opacity-50"
        style={{ backgroundColor: "var(--color-bleu-fonce)", color: "var(--color-blanc)" }}
      >
        {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
