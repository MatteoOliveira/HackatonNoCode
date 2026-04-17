"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/* ── Types ── */
interface Profile {
  pseudo: string;
  email?: string;
  pronouns?: string;
  pratique?: string;
  besoin?: string;
  accessibilite?: string[];
}

/* ── Labels ── */
const PRONOUN_LABELS: Record<string, string> = {
  iel: "iel", elle: "elle", il: "il", neutre: "neutre",
};
const PRATIQUE_LABELS: Record<string, string> = {
  equipe: "En équipe",
  solo:   "Je préfère progresser à mon propre rythme",
};
const BESOIN_LABELS: Record<string, string> = {
  depenser:   "Se dépenser",
  ressourcer: "Je recherche avant tout le calme et la douceur",
};
const ACCESS_LABELS: Record<string, string> = {
  mobilite: "Mobilité réduite",
  surdite:  "Surdité ou malentendance",
  cecite:   "Cécité ou malvoyance",
  aucun:    "Pas de besoin spécifique pour mes déplacements",
};
const ACTIVITIES: Record<string, { emoji: string; bg: string }> = {
  yoga:       { emoji: "🧘", bg: "#fce4ec" },
  basket:     { emoji: "🏀", bg: "#e8eaf6" },
  danse:      { emoji: "🎵", bg: "#fce4ec" },
  athletisme: { emoji: "🏃", bg: "#fce4ec" },
  natation:   { emoji: "🏊", bg: "#e3f2fd" },
  boxe:       { emoji: "🥊", bg: "#fff3e0" },
  escalade:   { emoji: "🧗", bg: "#e8f5e9" },
  zumba:      { emoji: "💃", bg: "#fce4ec" },
};

function getReco(profile: Profile): string[] {
  const { pratique, besoin } = profile;
  if (besoin === "depenser" && pratique === "equipe")   return ["basket","zumba","boxe","athletisme"];
  if (besoin === "depenser" && pratique === "solo")     return ["athletisme","escalade","boxe","natation"];
  if (besoin === "ressourcer" && pratique === "equipe") return ["yoga","danse","zumba","natation"];
  return ["yoga","danse","basket","athletisme"];
}

/* ── Sous-composants ── */
function ProfileRow({ label, value, color = "var(--color-bleu-fonce)" }: {
  label: string; value: string; color?: string;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b" style={{ borderColor: "#f0f0f0" }}>
      <span className="text-xs opacity-50 uppercase tracking-wide shrink-0 mr-4" style={{ color: "var(--color-noir)" }}>
        {label}
      </span>
      <span className="text-sm font-semibold text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--color-orange)" }}>
        {title}
      </h2>
      <div className="rounded-2xl px-4 py-1" style={{ backgroundColor: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        {children}
      </div>
    </section>
  );
}

/* ── Page principale ── */
export default function ProfilClient() {
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [loaded, setLoaded]     = useState(false);
  const [source, setSource]     = useState<"supabase" | "local" | "none">("none");

  useEffect(() => {
    async function load() {
      // 1. Essai Supabase
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { data } = await supabase
              .from("profiles")
              .select("pseudo, email, pronouns, pratique, besoin, accessibilite")
              .eq("id", user.id)
              .single();

            if (data) {
              setProfile(data);
              setSource("supabase");
              setLoaded(true);
              return;
            }
          }
        } catch {}
      }

      // 2. Fallback localStorage
      try {
        const raw = localStorage.getItem("solimouv_user");
        if (raw) {
          setProfile(JSON.parse(raw));
          setSource("local");
        }
      } catch {}

      setLoaded(true);
    }
    load();
  }, []);

  /* ── État : pas de profil ── */
  if (loaded && !profile) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto w-full px-4 py-20 flex flex-col items-center text-center" style={{ backgroundColor: "var(--color-blanc)" }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6" style={{ backgroundColor: "#f0f0f0" }}>
            🏃
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
            Ma bulle sportive
          </h1>
          <p className="text-sm opacity-60 mb-8" style={{ color: "var(--color-noir)" }}>
            Tu n&apos;as pas encore créé ton profil. Rejoins-nous pour découvrir les
            activités faites pour toi&nbsp;!
          </p>
          <Link href="/inscription" className="px-8 py-4 rounded-full font-bold text-base" style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}>
            Créer mon profil →
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (!loaded) return null;

  const reco    = getReco(profile!);
  const initial = profile!.pseudo?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto w-full px-4 pt-8 pb-16" style={{ backgroundColor: "var(--color-blanc)" }}>

        {/* Badge source */}
        {source === "supabase" && (
          <div className="flex justify-end mb-4">
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>
              ✓ Profil synchronisé
            </span>
          </div>
        )}

        {/* ── Avatar + nom ── */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--color-rose), var(--color-bleu-clair))",
              color: "#fff",
              fontFamily: "var(--font-titre)",
            }}
          >
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
              {profile!.pseudo}
            </h1>
            {profile!.pronouns && (
              <span className="inline-block mt-1 text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "var(--color-rose)", color: "#fff" }}>
                {PRONOUN_LABELS[profile!.pronouns] ?? profile!.pronouns}
              </span>
            )}
            <p className="text-xs opacity-40 mt-1" style={{ color: "var(--color-noir)" }}>
              Ma bulle sportive
            </p>
          </div>
        </div>

        {/* ── Préférences ── */}
        {(profile!.pratique || profile!.besoin) && (
          <Card title="Ce qui me fait du bien en ce moment">
            {profile!.pratique && (
              <ProfileRow
                label="Comment je pratique"
                value={PRATIQUE_LABELS[profile!.pratique] ?? profile!.pratique}
              />
            )}
            {profile!.besoin && (
              <ProfileRow
                label="Ce dont j'ai besoin"
                value={BESOIN_LABELS[profile!.besoin] ?? profile!.besoin}
                color="var(--color-orange)"
              />
            )}
          </Card>
        )}

        {/* ── Accessibilité ── */}
        {profile!.accessibilite && profile!.accessibilite.length > 0 && (
          <Card title="Mes besoins spécifiques">
            {profile!.accessibilite.map((a) => (
              <ProfileRow key={a} label="" value={ACCESS_LABELS[a] ?? a} />
            ))}
          </Card>
        )}

        {/* ── Activités recommandées ── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--color-orange)" }}>
            Mes prochaines rencontres
          </h2>
          <p className="text-xs opacity-50 mb-4" style={{ color: "var(--color-noir)" }}>
            Parce que chaque parcours est unique, nous avons sélectionné pour toi ces activités
            où tu pourras t&apos;épanouir en toute sérénité.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {reco.map((id) => {
              const act = ACTIVITIES[id];
              if (!act) return null;
              return (
                <div key={id} className="flex flex-col items-center gap-2 p-4 rounded-2xl shadow-sm" style={{ backgroundColor: "#fff" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: act.bg }} aria-hidden="true">
                    {act.emoji}
                  </div>
                  <p className="text-sm font-medium capitalize text-center" style={{ color: "var(--color-noir)" }}>
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="flex gap-3 mt-8">
          <Link
            href="/inscription"
            className="flex-1 py-3 rounded-xl text-center text-sm font-semibold border-2"
            style={{ borderColor: "var(--color-bleu-fonce)", color: "var(--color-bleu-fonce)" }}
          >
            Modifier mon profil
          </Link>
          <Link
            href="/programme"
            className="flex-1 py-3 rounded-xl text-center text-sm font-semibold"
            style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
          >
            Voir les activités
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
