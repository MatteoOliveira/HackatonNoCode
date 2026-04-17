"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

export default function ConnexionClient() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authErr) {
        if (authErr.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect.");
        } else if (authErr.message.includes("Email not confirmed")) {
          setError("Vérifie ton email pour confirmer ton compte avant de te connecter.");
        } else {
          setError(authErr.message);
        }
        setLoading(false);
        return;
      }

      router.push("/profil");
    } catch {
      setError("Une erreur inattendue est survenue.");
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main
        className="max-w-md mx-auto w-full px-4 pt-12 pb-20"
        style={{ backgroundColor: "var(--color-blanc)" }}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
            style={{ background: "linear-gradient(135deg, var(--color-rose), var(--color-bleu-clair))" }}
          >
            🏃
          </div>
          <h1
            className="text-3xl font-bold text-center"
            style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}
          >
            Bon retour&nbsp;!
          </h1>
          <p className="text-sm opacity-50 mt-1 text-center" style={{ color: "var(--color-noir)" }}>
            Connecte-toi à ta bulle sportive
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--color-orange)" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-colors"
              style={{
                borderColor: "var(--color-bleu-fonce)",
                color: "var(--color-noir)",
                backgroundColor: "#fff",
              }}
              placeholder="ton@email.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--color-orange)" }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-colors"
              style={{
                borderColor: "var(--color-bleu-fonce)",
                color: "var(--color-noir)",
                backgroundColor: "#fff",
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p
              className="text-sm text-center px-3 py-2 rounded-xl"
              style={{ backgroundColor: "#fdecea", color: "#c62828" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-4 rounded-full font-bold text-base mt-2 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
          >
            {loading ? "Connexion…" : "Se connecter →"}
          </button>
        </form>

        {/* Lien inscription */}
        <p className="text-center text-sm mt-6 opacity-60" style={{ color: "var(--color-noir)" }}>
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="font-semibold underline"
            style={{ color: "var(--color-bleu-fonce)" }}
          >
            Créer mon profil
          </Link>
        </p>
      </main>

      <Footer />
    </>
  );
}
