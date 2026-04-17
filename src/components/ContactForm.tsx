"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const INPUT = "w-full px-4 py-4 rounded-2xl text-sm outline-none transition-colors";
const inputStyle = { backgroundColor: "#f0f0f0", color: "var(--color-noir)", border: "none" };

export default function ContactForm() {
  const [nom, setNom]           = useState("");
  const [email, setEmail]       = useState("");
  const [message, setMessage]   = useState("");
  const [consent, setConsent]   = useState(false);
  const [status, setStatus]     = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.from("messages_contact").insert({
          nom:     nom.trim(),
          email:   email.trim(),
          message: message.trim(),
          sujet:   null,
        });
        if (error) throw new Error(error.message);
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      setStatus("success");
      setNom(""); setEmail(""); setMessage(""); setConsent(false);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue.");
      setStatus("error");
    }
  }

  if (status === "success") {
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
        <button onClick={() => setStatus("idle")}
          className="mt-2 px-6 py-3 rounded-full font-semibold text-sm"
          style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}>
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        required
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Ton prénom ou ton pseudo"
        className={INPUT}
        style={inputStyle}
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Adresse mail"
        className={INPUT}
        style={inputStyle}
      />
      <textarea
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="De quoi souhaites tu parler ?"
        className={INPUT}
        style={{ ...inputStyle, resize: "none" }}
      />

      {/* RGPD */}
      <label className="flex items-start gap-3 cursor-pointer">
        <div className="mt-0.5 shrink-0">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
        </div>
        <span className="text-xs leading-relaxed opacity-60" style={{ color: "var(--color-noir)" }}>
          J&apos;accepte que mes données soient utilisées pour traiter ma demande.
          Conformément au RGPD, vous pouvez exercer vos droits en contactant Up Sport!
        </span>
      </label>

      {status === "error" && (
        <p className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>
          {errorMsg || "Une erreur est survenue. Réessaie."}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !consent || !nom || !email || !message}
        className="w-full py-4 rounded-full font-bold text-base mt-2 transition-opacity disabled:opacity-40"
        style={{ backgroundColor: "var(--color-rose)", color: "#fff" }}
      >
        {status === "sending" ? "Envoi…" : "Envoyer !"}
      </button>
    </form>
  );
}
