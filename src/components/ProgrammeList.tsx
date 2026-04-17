"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/* ── Types ── */
export interface AtelierCard {
  id: string;
  titre: string;
  description?: string | null;
  quote?: string | null;
  image_url?: string | null;
  tags?: string[] | null;
  horaire_debut: string;
  horaire_fin: string;
  lieu: string;
  capacite_max: number;
  code_stand: string;
  sport?: { nom: string; image_url?: string | null; tags?: string[] | null } | null;
  association?: { nom: string } | null;
}

/* ── Helpers ── */
const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  "en-équipe":             { bg: "var(--color-bleu-fonce)", color: "#fff" },
  "solo":                  { bg: "var(--color-bleu-fonce)", color: "#fff" },
  "handisport":            { bg: "var(--color-rose)",       color: "#fff" },
  "intense":               { bg: "var(--color-rose)",       color: "#fff" },
  "calme":                 { bg: "var(--color-orange)",     color: "#fff" },
  "handisport-compatible": { bg: "var(--color-rose)",       color: "#fff" },
};
function tagStyle(t: string) {
  return TAG_COLORS[t] ?? { bg: "var(--color-bleu-fonce)", color: "#fff" };
}
function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}
function allTags(a: AtelierCard): string[] {
  return [...(a.tags ?? []), ...(a.sport?.tags ?? [])];
}
function coverImage(a: AtelierCard): string | null {
  return a.image_url ?? a.sport?.image_url ?? null;
}

/* ── Composant carte ── */
function Card({ a, onClick }: { a: AtelierCard; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  const cover = coverImage(a);
  const tags  = allTags(a);

  return (
    <article
      className="rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-98"
      style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Voir les détails : ${a.titre}`}
    >
      {/* ── Image ── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", backgroundColor: "var(--color-bleu-fonce)" }}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl" aria-hidden="true">
          🏅
        </div>
        {cover && !imgErr && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={a.titre}
            onError={() => setImgErr(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
          />
        )}
      </div>

      {/* ── Contenu ── */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-noir)" }}>
          {a.titre}
        </h2>

        {(a.quote ?? a.description) && (
          <p className="text-sm leading-relaxed mb-4 opacity-60 italic" style={{ color: "var(--color-noir)" }}>
            &ldquo;{a.quote ?? a.description}&rdquo;
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {[...new Set(tags)].map((t) => {
              const s = tagStyle(t.replace(/^#/, ""));
              return (
                <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
                  #{t.replace(/^#/, "")}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

/* ── Modal ── */
function Modal({ a, onClose }: { a: AtelierCard; onClose: () => void }) {
  const [imgErr, setImgErr]       = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loggedIn, setLoggedIn]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [regCount, setRegCount]   = useState<number | null>(null);
  const cover = coverImage(a);
  const tags  = allTags(a);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    // Count registrations
    supabase.from("atelier_registrations").select("id", { count: "exact", head: true }).eq("atelier_id", a.id)
      .then(({ count }) => setRegCount(count ?? 0));

    // Check if user is logged in + already registered
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setLoggedIn(true);
      supabase.from("atelier_registrations").select("id").eq("atelier_id", a.id).eq("user_id", user.id).single()
        .then(({ data }) => setRegistered(!!data));
    });
  }, [a.id]);

  async function toggleRegistration() {
    if (!isSupabaseConfigured()) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/connexion"; return; }

    if (registered) {
      await supabase.from("atelier_registrations").delete().eq("atelier_id", a.id).eq("user_id", user.id);
      setRegistered(false);
      setRegCount((c) => (c ?? 1) - 1);
    } else {
      await supabase.from("atelier_registrations").insert({ atelier_id: a.id, user_id: user.id });
      setRegistered(true);
      setRegCount((c) => (c ?? 0) + 1);
    }
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,8,20,0.7)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-t-3xl overflow-y-auto"
        style={{ backgroundColor: "var(--color-blanc)", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Poignée */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "#d1d5db" }} />
        </div>

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm z-10"
          style={{ backgroundColor: "#f0f0f0", color: "var(--color-noir)" }}
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* Image */}
        <div className="relative w-full" style={{ aspectRatio: "16/9", backgroundColor: "var(--color-bleu-fonce)" }}>
          <div className="absolute inset-0 flex items-center justify-center text-6xl" aria-hidden="true">🏅</div>
          {cover && !imgErr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={a.titre} onError={() => setImgErr(true)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
          )}
          {/* Badge code stand */}
          <span
            className="absolute bottom-3 right-3 text-xs font-bold px-3 py-1 rounded-full z-10"
            style={{ backgroundColor: "var(--color-rose)", color: "#fff" }}
          >
            Stand {a.code_stand}
          </span>
        </div>

        {/* Contenu */}
        <div className="px-5 pt-5 pb-8 flex flex-col gap-4">

          {/* Titre + sport */}
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
              {a.titre}
            </h2>
            {a.sport?.nom && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: "var(--color-bleu-fonce)", color: "#fff" }}>
                {a.sport.nom}
              </span>
            )}
          </div>

          {/* Infos pratiques */}
          <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ backgroundColor: "#f8f8f8" }}>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-noir)" }}>
              <span>📅</span>
              <span className="capitalize">{fmtDate(a.horaire_debut)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-noir)" }}>
              <span>🕐</span>
              <span>{fmt(a.horaire_debut)} – {fmt(a.horaire_fin)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-noir)" }}>
              <span>📍</span>
              <span>{a.lieu}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-noir)" }}>
              <span>👥</span>
              <span>
                {regCount !== null ? `${regCount} / ${a.capacite_max} inscrits` : `${a.capacite_max} places`}
              </span>
            </div>
            {a.association?.nom && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-noir)" }}>
                <span>🤝</span>
                <span>{a.association.nom}</span>
              </div>
            )}
          </div>

          {/* Quote */}
          {(a.quote ?? a.description) && (
            <p className="text-sm leading-relaxed italic opacity-70" style={{ color: "var(--color-noir)" }}>
              &ldquo;{a.quote ?? a.description}&rdquo;
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {[...new Set(tags)].map((t) => {
                const s = tagStyle(t.replace(/^#/, ""));
                return (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
                    #{t.replace(/^#/, "")}
                  </span>
                );
              })}
            </div>
          )}

          {/* Bouton inscription */}
          <div className="mt-2">
            {!loggedIn ? (
              <a
                href="/connexion"
                className="block w-full py-4 rounded-full text-center font-bold text-base"
                style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
              >
                Se connecter pour s&apos;inscrire →
              </a>
            ) : (
              <button
                onClick={toggleRegistration}
                disabled={loading || (!registered && regCount !== null && regCount >= a.capacite_max)}
                className="w-full py-4 rounded-full font-bold text-base transition-all disabled:opacity-40"
                style={{
                  backgroundColor: registered ? "#fdecea" : "var(--color-orange)",
                  color: registered ? "#c62828" : "#fff",
                  border: registered ? "2px solid #c62828" : "none",
                }}
              >
                {loading ? "…" : registered ? "Se désinscrire" : regCount !== null && regCount >= a.capacite_max ? "Complet" : "S'inscrire à cet atelier →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Liste principale ── */
export default function ProgrammeList({ ateliers }: { ateliers: AtelierCard[] }) {
  const [selected, setSelected] = useState<AtelierCard | null>(null);

  if (ateliers.length === 0) {
    return (
      <div className="text-center py-12 opacity-50 text-sm" style={{ color: "var(--color-noir)" }}>
        Aucun programme disponible pour le moment.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {ateliers.map((a) => (
          <Card key={a.id} a={a} onClick={() => setSelected(a)} />
        ))}
      </div>

      {selected && <Modal a={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
