"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  consent_notifs?: boolean;
  role?: string;
  created_at?: string;
}

interface Checkin {
  id: string;
  horodatage: string;
  palier_debloque?: string;
  atelier?: {
    titre: string;
    lieu: string;
    code_stand: string;
    horaire_debut: string;
  };
}

interface Registration {
  id: string;
  created_at: string;
  atelier?: {
    id: string;
    titre: string;
    lieu: string;
    horaire_debut: string;
    horaire_fin: string;
    code_stand: string;
  } | null;
}

/* ── Labels ── */
const PRONOUN_LABELS: Record<string, string> = {
  iel: "iel", elle: "elle", il: "il", neutre: "neutre",
};
const PRATIQUE_OPTIONS = [
  { value: "equipe", label: "En équipe" },
  { value: "solo",   label: "À mon propre rythme" },
];
const BESOIN_OPTIONS = [
  { value: "depenser",   label: "Me dépenser" },
  { value: "ressourcer", label: "Calme et douceur" },
];
const ACCESS_OPTIONS = [
  { value: "mobilite", label: "Mobilité réduite" },
  { value: "surdite",  label: "Surdité ou malentendance" },
  { value: "cecite",   label: "Cécité ou malvoyance" },
  { value: "aucun",    label: "Pas de besoin spécifique" },
];
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
  if (besoin === "depenser" && pratique === "equipe")   return ["basket", "zumba", "boxe", "athletisme"];
  if (besoin === "depenser" && pratique === "solo")     return ["athletisme", "escalade", "boxe", "natation"];
  if (besoin === "ressourcer" && pratique === "equipe") return ["yoga", "danse", "zumba", "natation"];
  return ["yoga", "danse", "basket", "athletisme"];
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
function formatHour(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/* ── Sous-composants ── */
function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--color-orange)" }}>
      <span aria-hidden="true">{icon}</span>
      {title}
    </h2>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl px-4 py-1" style={{ backgroundColor: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      {children}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b last:border-b-0" style={{ borderColor: "#f0f0f0" }}>
      <span className="text-xs opacity-50 uppercase tracking-wide shrink-0 mr-4" style={{ color: "var(--color-noir)" }}>
        {label}
      </span>
      <span className="text-sm font-semibold text-right" style={{ color: color ?? "var(--color-bleu-fonce)" }}>
        {value}
      </span>
    </div>
  );
}

function Tag({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: bg, color }}>
      {children}
    </span>
  );
}

/* ── Composants d'édition ── */
function ToggleGroup({
  options, value, onChange, multi = false,
}: {
  options: { value: string; label: string }[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  function isSelected(v: string) {
    return multi ? (value as string[]).includes(v) : value === v;
  }
  function toggle(v: string) {
    if (!multi) { onChange(v); return; }
    const arr = value as string[];
    onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  }
  return (
    <div className="flex flex-col gap-2 py-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => toggle(opt.value)}
          className="w-full py-3 px-4 rounded-xl text-sm font-medium text-left transition-all"
          style={{
            backgroundColor: isSelected(opt.value) ? "var(--color-bleu-fonce)" : "#f5f5f5",
            color:           isSelected(opt.value) ? "#fff" : "var(--color-noir)",
            border: `2px solid ${isSelected(opt.value) ? "var(--color-bleu-fonce)" : "transparent"}`,
          }}
          aria-pressed={isSelected(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-2 border-b last:border-b-0" style={{ borderColor: "#f0f0f0" }}>
      <p className="text-xs opacity-50 uppercase tracking-wide mb-1" style={{ color: "var(--color-noir)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

/* ── Page principale ── */
export default function ProfilClient() {
  const router = useRouter();

  const [profile, setProfile]     = useState<Profile | null>(null);
  const [checkins, setCheckins]           = useState<Checkin[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [authEmail, setAuthEmail] = useState<string | undefined>();
  const [userId, setUserId]       = useState<string | undefined>();
  const [loaded, setLoaded]       = useState(false);
  const [source, setSource]       = useState<"supabase" | "local" | "none">("none");

  /* édition */
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState<Profile | null>(null);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveOk, setSaveOk]     = useState(false);

  useEffect(() => {
    async function load() {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            setAuthEmail(user.email);
            setUserId(user.id);

            const { data } = await supabase
              .from("profiles")
              .select("pseudo, email, pronouns, pratique, besoin, accessibilite, consent_notifs, role, created_at")
              .eq("id", user.id)
              .single();

            if (data) {
              setProfile(data);
              setSource("supabase");
            }

            const { data: inscription } = await supabase
              .from("inscriptions")
              .select("id")
              .eq("user_id", user.id)
              .single();

            if (inscription) {
              const { data: ckData } = await supabase
                .from("checkins")
                .select("id, horodatage, palier_debloque, atelier:atelier_id(titre, lieu, code_stand, horaire_debut)")
                .eq("inscription_id", inscription.id)
                .order("horodatage", { ascending: false });
              if (ckData) setCheckins(ckData as Checkin[]);
            }

            // Inscriptions aux ateliers
            const { data: regData } = await supabase
              .from("atelier_registrations")
              .select("id, created_at, atelier:atelier_id(id, titre, lieu, horaire_debut, horaire_fin, code_stand)")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false });
            if (regData) setRegistrations(regData as Registration[]);

            setLoaded(true);
            return;
          }
        } catch {}
      }

      try {
        const raw = localStorage.getItem("solimouv_user");
        if (raw) { setProfile(JSON.parse(raw)); setSource("local"); }
      } catch {}
      setLoaded(true);
    }
    load();
  }, []);

  function startEditing() {
    setDraft({ ...profile! });
    setSaveError("");
    setSaveOk(false);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setDraft(null);
    setSaveError("");
  }

  async function saveProfile() {
    if (!draft) return;
    setSaving(true);
    setSaveError("");
    setSaveOk(false);

    if (source === "supabase" && userId) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("profiles")
          .update({
            pseudo:        draft.pseudo?.trim(),
            pronouns:      draft.pronouns,
            pratique:      draft.pratique,
            besoin:        draft.besoin,
            accessibilite: draft.accessibilite,
            consent_notifs: draft.consent_notifs,
          })
          .eq("id", userId);

        if (error) {
          setSaveError("Erreur : " + error.message);
          setSaving(false);
          return;
        }
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : "Erreur inattendue");
        setSaving(false);
        return;
      }
    } else {
      try {
        localStorage.setItem("solimouv_user", JSON.stringify(draft));
      } catch {}
    }

    setProfile({ ...draft });
    setSaving(false);
    setSaveOk(true);
    setEditing(false);
    setDraft(null);
  }

  async function unregister(registrationId: string) {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.from("atelier_registrations").delete().eq("id", registrationId);
    setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
  }

  async function handleLogout() {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem("solimouv_user");
      router.push("/");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  /* ── État : pas de profil ── */
  if (loaded && !profile) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto w-full px-4 py-20 flex flex-col items-center text-center" style={{ backgroundColor: "var(--color-blanc)" }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6" style={{ backgroundColor: "#f0f0f0" }}>🏃</div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
            Ma bulle sportive
          </h1>
          <p className="text-sm opacity-60 mb-8" style={{ color: "var(--color-noir)" }}>
            Tu n&apos;as pas encore créé ton profil.
          </p>
          <Link href="/inscription" className="px-8 py-4 rounded-full font-bold text-base" style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}>
            Créer mon profil →
          </Link>
          <Link href="/connexion" className="mt-4 text-sm underline opacity-60" style={{ color: "var(--color-bleu-fonce)" }}>
            J&apos;ai déjà un compte
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (!loaded) return null;

  const current = editing ? draft! : profile!;
  const reco    = getReco(profile!);
  const initial = profile!.pseudo?.[0]?.toUpperCase() ?? "?";
  const email   = profile!.email ?? authEmail;

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto w-full px-4 pt-8 pb-24" style={{ backgroundColor: "var(--color-blanc)" }}>

        {/* Badge sync */}
        <div className="flex justify-between items-center mb-3">
          {source === "supabase"
            ? <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>✓ Synchronisé</span>
            : <span />
          }
          {saveOk && !editing && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>
              ✓ Modifications enregistrées
            </span>
          )}
        </div>

        {/* ── Avatar ── */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, var(--color-rose), var(--color-bleu-clair))", color: "#fff", fontFamily: "var(--font-titre)" }}
          >
            {initial}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
              {profile!.pseudo}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile!.pronouns && (
                <Tag bg="var(--color-rose)" color="#fff">{PRONOUN_LABELS[profile!.pronouns] ?? profile!.pronouns}</Tag>
              )}
              {profile!.role === "admin" && <Tag bg="var(--color-bleu-fonce)" color="#fff">Admin</Tag>}
              {profile!.role === "super_admin" && <Tag bg="var(--color-orange)" color="#fff">Super Admin</Tag>}
            </div>
          </div>
        </div>

        {/* ── Mon compte (lecture seule) ── */}
        <section className="mb-5">
          <SectionTitle icon="👤" title="Mon compte" />
          <Card>
            {email && <Row label="Email" value={email} />}
            <Row label="Membre depuis" value={formatDate(profile!.created_at)} />
          </Card>
        </section>

        {/* ── Infos modifiables ── */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <SectionTitle icon="✏️" title="Mon profil" />
            {!editing && (
              <button
                onClick={startEditing}
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-bleu-fonce)", color: "#fff" }}
              >
                Modifier
              </button>
            )}
          </div>

          {!editing ? (
            /* ── Vue lecture ── */
            <Card>
              <Row label="Pseudo" value={current.pseudo || "—"} />
              <Row label="Pronoms" value={current.pronouns ? (PRONOUN_LABELS[current.pronouns] ?? current.pronouns) : "—"} />
              <Row label="Comment je pratique" value={current.pratique ? (PRATIQUE_OPTIONS.find(o => o.value === current.pratique)?.label ?? current.pratique) : "—"} />
              <Row label="Ce dont j'ai besoin" value={current.besoin ? (BESOIN_OPTIONS.find(o => o.value === current.besoin)?.label ?? current.besoin) : "—"} color="var(--color-orange)" />
              <Row
                label="Besoins spécifiques"
                value={current.accessibilite && current.accessibilite.length > 0
                  ? current.accessibilite.map(a => ACCESS_OPTIONS.find(o => o.value === a)?.label ?? a).join(", ")
                  : "—"}
              />
              <Row
                label="Notifications"
                value={current.consent_notifs ? "Activées" : "Désactivées"}
                color={current.consent_notifs ? "#2e7d32" : "#999"}
              />
            </Card>
          ) : (
            /* ── Vue édition ── */
            <div className="rounded-2xl px-4 py-2" style={{ backgroundColor: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>

              <EditField label="Pseudo">
                <input
                  type="text"
                  value={draft!.pseudo ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d!, pseudo: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm border-2 outline-none"
                  style={{ borderColor: "var(--color-bleu-fonce)", color: "var(--color-noir)", backgroundColor: "#f8f8f8" }}
                />
              </EditField>

              <EditField label="Pronoms">
                <ToggleGroup
                  options={Object.entries(PRONOUN_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                  value={draft!.pronouns ?? ""}
                  onChange={(v) => setDraft((d) => ({ ...d!, pronouns: v as string }))}
                />
              </EditField>

              <EditField label="Comment je pratique">
                <ToggleGroup
                  options={PRATIQUE_OPTIONS}
                  value={draft!.pratique ?? ""}
                  onChange={(v) => setDraft((d) => ({ ...d!, pratique: v as string }))}
                />
              </EditField>

              <EditField label="Ce dont j'ai besoin">
                <ToggleGroup
                  options={BESOIN_OPTIONS}
                  value={draft!.besoin ?? ""}
                  onChange={(v) => setDraft((d) => ({ ...d!, besoin: v as string }))}
                />
              </EditField>

              <EditField label="Besoins spécifiques">
                <ToggleGroup
                  options={ACCESS_OPTIONS}
                  value={draft!.accessibilite ?? []}
                  onChange={(v) => setDraft((d) => ({ ...d!, accessibilite: v as string[] }))}
                  multi
                />
              </EditField>

              <EditField label="Notifications push">
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d!, consent_notifs: !d!.consent_notifs }))}
                  className="flex items-center gap-3 py-3"
                >
                  <div
                    className="w-11 h-6 rounded-full relative transition-colors"
                    style={{ backgroundColor: draft!.consent_notifs ? "var(--color-bleu-fonce)" : "#d1d5db" }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                      style={{ left: draft!.consent_notifs ? "calc(100% - 1.25rem)" : "0.25rem" }}
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--color-noir)" }}>
                    {draft!.consent_notifs ? "Activées" : "Désactivées"}
                  </span>
                </button>
              </EditField>

              {saveError && (
                <p className="text-xs py-2 px-3 rounded-xl mb-2" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>
                  {saveError}
                </p>
              )}

              {/* Boutons */}
              <div className="flex gap-3 py-4">
                <button
                  onClick={cancelEditing}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border-2"
                  style={{ borderColor: "#d1d5db", color: "var(--color-noir)" }}
                >
                  Annuler
                </button>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
                >
                  {saving ? "Enregistrement…" : "Enregistrer ✓"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Activités recommandées ── */}
        <section className="mb-5">
          <SectionTitle icon="⚡" title="Mes activités recommandées" />
          <p className="text-xs opacity-50 mb-4" style={{ color: "var(--color-noir)" }}>
            Mises à jour selon tes préférences.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {reco.map((id) => {
              const act = ACTIVITIES[id];
              if (!act) return null;
              return (
                <div key={id} className="flex flex-col items-center gap-2 p-4 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
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

        {/* ── Inscriptions ateliers ── */}
        <section className="mb-5">
          <SectionTitle icon="📅" title="Mes ateliers inscrits" />
          {registrations.length === 0 ? (
            <div className="rounded-2xl px-4 py-6 flex flex-col items-center text-center" style={{ backgroundColor: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <span className="text-3xl mb-2" aria-hidden="true">🗓️</span>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-bleu-fonce)" }}>Aucun atelier pour l&apos;instant</p>
              <p className="text-xs opacity-50 mb-3" style={{ color: "var(--color-noir)" }}>
                Parcours le programme et inscris-toi aux activités qui t&apos;intéressent.
              </p>
              <a href="/programme" className="text-xs font-bold px-4 py-2 rounded-full" style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}>
                Voir le programme →
              </a>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              {registrations.map((r, i) => (
                <div key={r.id} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: i < registrations.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold mt-0.5" style={{ backgroundColor: "var(--color-bleu-fonce)", color: "#fff" }}>
                    {r.atelier?.code_stand?.slice(0, 2) ?? "🏅"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-bleu-fonce)" }}>{r.atelier?.titre ?? "Atelier"}</p>
                    <p className="text-xs opacity-50 mt-0.5" style={{ color: "var(--color-noir)" }}>
                      {r.atelier?.lieu}
                      {r.atelier?.horaire_debut ? ` · ${new Date(r.atelier.horaire_debut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} – ${new Date(r.atelier.horaire_fin ?? r.atelier.horaire_debut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => unregister(r.id)}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ backgroundColor: "#fdecea", color: "#c62828" }}
                  >
                    Se désinscrire
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Participations (checkins jour J) ── */}
        <section className="mb-5">
          <SectionTitle icon="🎟️" title="Mes participations" />
          {checkins.length === 0 ? (
            <div className="rounded-2xl px-4 py-6 flex flex-col items-center text-center" style={{ backgroundColor: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <span className="text-3xl mb-2" aria-hidden="true">🏟️</span>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-bleu-fonce)" }}>Aucune participation pour l&apos;instant</p>
              <p className="text-xs opacity-50" style={{ color: "var(--color-noir)" }}>
                Scanne les QR codes des stands le jour J.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              {checkins.map((ck, i) => (
                <div key={ck.id} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: i < checkins.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 font-bold mt-0.5" style={{ backgroundColor: "var(--color-jaune)", color: "var(--color-noir)" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-bleu-fonce)" }}>{ck.atelier?.titre ?? "Atelier"}</p>
                    <p className="text-xs opacity-50 mt-0.5" style={{ color: "var(--color-noir)" }}>
                      {ck.atelier?.lieu} · {ck.atelier?.horaire_debut ? formatHour(ck.atelier.horaire_debut) : ""}
                    </p>
                    {ck.palier_debloque && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "var(--color-jaune)", color: "var(--color-noir)" }}>
                        🏆 {ck.palier_debloque}
                      </span>
                    )}
                  </div>
                  <span className="text-xs opacity-40 shrink-0 mt-1" style={{ color: "var(--color-noir)" }}>{formatHour(ck.horodatage)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Voir les activités ── */}
        <Link
          href="/programme"
          className="block w-full py-3 rounded-xl text-center text-sm font-semibold mb-3"
          style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
        >
          Voir les activités
        </Link>

        {/* ── Déconnexion ── */}
        {source === "supabase" && (
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl text-sm font-medium text-center"
            style={{ color: "#c62828", backgroundColor: "#fdecea" }}
          >
            Se déconnecter
          </button>
        )}
      </main>

      <Footer />
    </>
  );
}
