"use client";

import { useState } from "react";
import type { StepProps } from "../types";
import StepImage from "../StepImage";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "1rem",
  borderRadius: "0.75rem",
  border: "2px solid transparent",
  backgroundColor: "#f0f0f0",
  fontSize: "1rem",
  fontFamily: "inherit",
  outline: "none",
  color: "var(--color-noir)",
  transition: "border-color 0.2s",
};

const INPUT_ERROR_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  borderColor: "var(--color-orange)",
  backgroundColor: "#fff5f0",
};

export default function Step1({ data, update }: StepProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError]     = useState("");

  const passwordMismatch = data.confirmPassword.length > 0 && data.password !== data.confirmPassword;
  const passwordTooShort = data.password.length > 0 && data.password.length < 6;

  async function handleGoogle() {
    if (!isSupabaseConfigured()) return;
    setGoogleError(""); setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/profil`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) { setGoogleError(error.message); setGoogleLoading(false); }
    } catch {
      setGoogleError("Impossible de contacter Google.");
      setGoogleLoading(false);
    }
  }

  return (
    <div>
      <StepImage
        src="/images/onboarding-sport.jpg"
        alt="Joueuse de badminton en action"
        fallbackBg="var(--color-bleu-fonce)"
        fallbackEmoji="🏸"
      />

      {/* ── Section 1 : pseudo ── */}
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-noir)" }}>
        Comment devons nous t&apos;appeler&nbsp;?
      </h2>
      <p className="text-sm opacity-50 mb-5" style={{ color: "var(--color-noir)" }}>
        Utilise le nom avec lequel tu te sens le plus à l&apos;aise, nous n&apos;avons
        pas besoin de ton identité officielle pour faire du sport ensemble.
      </p>

      <input
        type="text"
        value={data.pseudo}
        onChange={(e) => update({ pseudo: e.target.value })}
        placeholder="Ton prénom ou pseudo"
        style={INPUT_STYLE}
        autoComplete="nickname"
        aria-label="Ton prénom ou pseudo"
      />

      {/* ── Section 2 : email + mdp ── */}
      <h3 className="text-xl font-bold mt-8 mb-2" style={{ color: "var(--color-noir)" }}>
        Maintenant renseigne ton adresse et ton mot de passe&nbsp;:
      </h3>
      <p className="text-sm opacity-50 mb-5" style={{ color: "var(--color-noir)" }}>
        Ou connecte-toi directement avec Google.
      </p>

      {/* Bouton Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium text-sm mb-2 border-2 transition-opacity disabled:opacity-50"
        style={{ borderColor: "#d1d5db", backgroundColor: "#fff", color: "var(--color-noir)" }}
      >
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        {googleLoading ? "Redirection…" : "S'inscrire avec Google"}
      </button>
      {googleError && (
        <p className="text-xs text-center mb-3 px-2 py-1.5 rounded-xl" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>
          {googleError}
        </p>
      )}

      {/* Séparateur */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ backgroundColor: "#d1d5db" }} />
        <span className="text-xs opacity-40">ou avec ton email</span>
        <div className="flex-1 h-px" style={{ backgroundColor: "#d1d5db" }} />
      </div>

      {/* Champs email + mdp */}
      <div className="flex flex-col gap-3">
        <input
          type="email"
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="Ton adresse email"
          style={INPUT_STYLE}
          autoComplete="email"
          aria-label="Ton adresse email"
        />

        <div>
          <input
            type="password"
            value={data.password}
            onChange={(e) => update({ password: e.target.value })}
            placeholder="Ton mot de passe (6 caractères min.)"
            style={passwordTooShort ? INPUT_ERROR_STYLE : INPUT_STYLE}
            autoComplete="new-password"
            aria-label="Ton mot de passe"
            aria-describedby={passwordTooShort ? "pwd-error" : undefined}
          />
          {passwordTooShort && (
            <p id="pwd-error" className="text-xs mt-1 ml-1" style={{ color: "var(--color-orange)" }}>
              Le mot de passe doit contenir au moins 6 caractères.
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            value={data.confirmPassword}
            onChange={(e) => update({ confirmPassword: e.target.value })}
            placeholder="Confirme ton mot de passe"
            style={passwordMismatch ? INPUT_ERROR_STYLE : INPUT_STYLE}
            autoComplete="new-password"
            aria-label="Confirme ton mot de passe"
            aria-describedby={passwordMismatch ? "confirm-error" : undefined}
          />
          {passwordMismatch && (
            <p id="confirm-error" className="text-xs mt-1 ml-1" style={{ color: "var(--color-orange)" }}>
              Les mots de passe ne correspondent pas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
