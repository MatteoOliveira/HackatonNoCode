"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function ConnexionClient() {
  const router = useRouter();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const supabase = createClient();
      const { error: authErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authErr) {
        setError(
          authErr.message.includes("Invalid login credentials") ? "Email ou mot de passe incorrect." :
          authErr.message.includes("Email not confirmed") ? "Vérifie ton email pour confirmer ton compte." :
          authErr.message
        );
        setLoading(false);
        return;
      }
      router.push("/profil");
    } catch {
      setError("Une erreur inattendue est survenue.");
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(""); setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error: authErr } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (authErr) { setError(authErr.message); setGoogleLoading(false); }
    } catch {
      setError("Impossible de contacter Google.");
      setGoogleLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto w-full px-4 pt-12 pb-20" style={{ backgroundColor: "var(--color-blanc)" }}>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
            style={{ background: "linear-gradient(135deg, var(--color-rose), var(--color-bleu-clair))" }}>
            🏃
          </div>
          <h1 className="text-3xl font-bold text-center" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
            Bon retour&nbsp;!
          </h1>
          <p className="text-sm opacity-50 mt-1 text-center" style={{ color: "var(--color-noir)" }}>
            Connecte-toi à ta bulle sportive
          </p>
        </div>

        {/* Bouton Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium text-sm mb-5 border-2 transition-opacity disabled:opacity-50"
          style={{ borderColor: "#d1d5db", backgroundColor: "#fff", color: "var(--color-noir)" }}
        >
          <GoogleIcon />
          {googleLoading ? "Redirection…" : "Continuer avec Google"}
        </button>

        {/* Séparateur */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: "#d1d5db" }} />
          <span className="text-xs opacity-40" style={{ color: "var(--color-noir)" }}>ou avec ton email</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "#d1d5db" }} />
        </div>

        {/* Formulaire email */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--color-orange)" }}>Email</label>
            <input id="email" type="email" autoComplete="email" required value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none"
              style={{ borderColor: "var(--color-bleu-fonce)", color: "var(--color-noir)", backgroundColor: "#fff" }}
              placeholder="ton@email.com" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--color-orange)" }}>Mot de passe</label>
            <input id="password" type="password" autoComplete="current-password" required value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none"
              style={{ borderColor: "var(--color-bleu-fonce)", color: "var(--color-noir)", backgroundColor: "#fff" }}
              placeholder="••••••••" />
          </div>

          {error && (
            <p className="text-sm text-center px-3 py-2 rounded-xl" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading || googleLoading || !email || !password}
            className="w-full py-4 rounded-full font-bold text-base mt-2 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}>
            {loading ? "Connexion…" : "Se connecter →"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 opacity-60" style={{ color: "var(--color-noir)" }}>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-semibold underline" style={{ color: "var(--color-bleu-fonce)" }}>
            Créer mon profil
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
