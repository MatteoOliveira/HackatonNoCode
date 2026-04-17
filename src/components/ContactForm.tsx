"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/contact";

const INPUT = "w-full px-4 py-4 rounded-2xl text-sm outline-none";
const inputStyle = { backgroundColor: "#f0f0f0", color: "var(--color-noir)", border: "none" };

const initialState: { error?: string; success?: boolean } = {};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center text-center py-10 gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ backgroundColor: "var(--color-rose)" }}>
          ✓
        </div>
        <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
          Message envoyé !
        </h3>
        <p className="text-sm opacity-60" style={{ color: "var(--color-noir)" }}>
          Merci ! L&apos;équipe d&apos;Up Sport! te répondra avec plaisir.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">

      {/* Honeypot — invisible, ne pas toucher */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
      />

      <input
        type="text"
        name="nom"
        required
        maxLength={100}
        placeholder="Ton prénom ou ton pseudo"
        className={INPUT}
        style={inputStyle}
      />
      <input
        type="email"
        name="email"
        required
        maxLength={200}
        placeholder="Adresse mail"
        className={INPUT}
        style={inputStyle}
      />
      <textarea
        name="message"
        required
        rows={5}
        maxLength={2000}
        placeholder="De quoi souhaites tu parler ?"
        className={INPUT}
        style={{ ...inputStyle, resize: "none" }}
      />

      {/* RGPD */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer"
        />
        <span className="text-xs leading-relaxed opacity-60" style={{ color: "var(--color-noir)" }}>
          J&apos;accepte que mes données soient utilisées pour traiter ma demande.
          Conformément au RGPD, vous pouvez exercer vos droits en contactant Up Sport!
        </span>
      </label>

      {state?.error && (
        <p className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 rounded-full font-bold text-base mt-2 transition-opacity disabled:opacity-40"
        style={{ backgroundColor: "var(--color-rose)", color: "#fff" }}
      >
        {pending ? "Envoi…" : "Envoyer !"}
      </button>
    </form>
  );
}
