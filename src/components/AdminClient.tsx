"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/client";

/* ── Types ── */
type Tab = "programmes" | "partenaires" | "evenement" | "utilisateurs";

interface UserProfile {
  id: string;
  pseudo?: string;
  email?: string;
  role: string;
  created_at?: string;
}

interface Atelier {
  id: string; titre: string; description?: string; quote?: string;
  image_url?: string; tags?: string[];
  horaire_debut: string; horaire_fin: string;
  lieu: string; capacite_max: number; code_stand: string; actif: boolean;
  sport_id?: string; association_id?: string;
  sport?: { nom: string } | null;
  association?: { nom: string } | null;
}

interface Association {
  id: string; nom: string; slug: string; description?: string;
  site_web?: string; contact_email?: string; couleur_theme: string; actif: boolean;
}

interface Sport { id: string; nom: string; }

interface Config { date_festival: string; lieu_festival: string; festival_actif: boolean; }

/* ── Helpers ── */
function toDatetimeLocal(iso: string) {
  if (!iso) return "";
  return iso.slice(0, 16); // "2026-07-11T10:00"
}
function toISO(local: string) {
  if (!local) return "";
  return new Date(local).toISOString();
}
function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const INPUT = "w-full px-3 py-2 rounded-xl text-sm border-2 outline-none";
const inputStyle = { borderColor: "#d1d5db", color: "var(--color-noir)", backgroundColor: "#fafafa" };
const focusStyle = { borderColor: "var(--color-bleu-fonce)" };

/* ── Petit composant champ ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-wide opacity-50" style={{ color: "var(--color-noir)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Page admin ── */
export default function AdminClient() {
  const router = useRouter();
  const [tab, setTab]         = useState<Tab>("programmes");
  const [checking, setChecking] = useState(true);
  const [denied, setDenied]   = useState(false);

  /* Programmes */
  const [ateliers, setAteliers]   = useState<Atelier[]>([]);
  const [sports, setSports]       = useState<Sport[]>([]);
  const [assocs, setAssocs]       = useState<Association[]>([]);
  const [showAddA, setShowAddA]   = useState(false);
  const [newA, setNewA]           = useState({ titre: "", description: "", quote: "", tags: "", image_url: "", horaire_debut: "", horaire_fin: "", lieu: "", capacite_max: 30, code_stand: "", sport_id: "", association_id: "", actif: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const [savingA, setSavingA]     = useState(false);
  const [errA, setErrA]           = useState("");
  const [inscritsByAtelier, setInscritsByAtelier] = useState<Record<string, { count: number; users: { pseudo?: string; email?: string }[] }>>({});
  const [expandedAtelier, setExpandedAtelier] = useState<string | null>(null);
  const [editingAtelier, setEditingAtelier]   = useState<string | null>(null);
  const [editDraft, setEditDraft]             = useState<{ titre: string; description: string; quote: string; tags: string; image_url: string; horaire_debut: string; horaire_fin: string; lieu: string; capacite_max: number; code_stand: string; sport_id: string; association_id: string } | null>(null);
  const [editImageFile, setEditImageFile]     = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [uploadingEditImg, setUploadingEditImg] = useState(false);
  const [savingEdit, setSavingEdit]           = useState(false);
  const [errEdit, setErrEdit]                 = useState("");


  /* Partenaires */
  const [partenaires, setPartenaires] = useState<Association[]>([]);
  const [showAddP, setShowAddP]       = useState(false);
  const [newP, setNewP]               = useState({ nom: "", badge: "", description: "", tags: "", icon: "", site_web: "", contact_email: "", couleur_theme: "#013bb8", actif: true });
  const [partImageFile, setPartImageFile]   = useState<File | null>(null);
  const [partImagePreview, setPartImagePreview] = useState<string>("");
  const [uploadingPartImg, setUploadingPartImg] = useState(false);
  const [savingP, setSavingP]         = useState(false);
  const [errP, setErrP]               = useState("");
  const [editingPartenaire, setEditingPartenaire] = useState<string | null>(null);
  const [editPartDraft, setEditPartDraft]         = useState<{ nom: string; badge: string; description: string; tags: string; icon: string; image_url: string; site_web: string; contact_email: string; couleur_theme: string } | null>(null);
  const [editPartImageFile, setEditPartImageFile] = useState<File | null>(null);
  const [editPartImagePreview, setEditPartImagePreview] = useState<string>("");
  const [uploadingEditPartImg, setUploadingEditPartImg] = useState(false);
  const [savingEditP, setSavingEditP]             = useState(false);
  const [errEditP, setErrEditP]                   = useState("");

  /* Utilisateurs */
  const [users, setUsers]           = useState<UserProfile[]>([]);
  const [search, setSearch]         = useState("");
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [myRole, setMyRole]         = useState<string>("");

  /* Événement */
  const [config, setConfig]     = useState<Config>({ date_festival: "", lieu_festival: "", festival_actif: false });
  const [savingC, setSavingC]   = useState(false);
  const [savedC, setSavedC]     = useState(false);
  const [errC, setErrC]         = useState("");

  /* ── Auth check ── */
  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/connexion"); return; }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        setDenied(true);
      } else {
        setMyRole(profile.role);
      }
      setChecking(false);
    }
    check();
  }, [router]);

  /* ── Chargement données ── */
  useEffect(() => {
    if (checking || denied) return;
    const supabase = createClient();

    supabase.from("ateliers")
      .select("id, titre, description, horaire_debut, horaire_fin, lieu, capacite_max, code_stand, actif, sport_id, association_id, sport:sport_id(nom), association:association_id(nom)")
      .order("horaire_debut")
      .then(({ data }) => data && setAteliers(data as unknown as Atelier[]));

    supabase.from("sports").select("id, nom").order("nom")
      .then(({ data }) => data && setSports(data));

    supabase.from("associations").select("id, nom, slug, description, site_web, contact_email, couleur_theme, actif").order("nom")
      .then(({ data }) => { if (data) { setAssocs(data); setPartenaires(data); } });

    supabase.from("profiles")
      .select("id, pseudo, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => data && setUsers(data as unknown as UserProfile[]));

    supabase.from("config").select("key, value")
      .in("key", ["date_festival", "lieu_festival", "festival_actif"])
      .then(({ data }) => {
        if (!data) return;
        const map: Record<string, unknown> = {};
        data.forEach((r) => { map[r.key] = r.value; });
        setConfig({
          date_festival: toDatetimeLocal((map.date_festival as string) ?? ""),
          lieu_festival: (map.lieu_festival as string) ?? "",
          festival_actif: (map.festival_actif as boolean) ?? false,
        });
      });
  }, [checking, denied]);

  /* ── Upload image ── */
  async function uploadImage(
    file: File,
    setLoading: (v: boolean) => void,
    setErr: (v: string) => void
  ): Promise<string | null> {
    setLoading(true);
    try {
      const supabase = createClient();
      const ext  = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("ateliers").upload(path, file, { upsert: true });
      if (error) { setErr("Upload image : " + error.message); return null; }
      const { data } = supabase.storage.from("ateliers").getPublicUrl(path);
      return data.publicUrl;
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erreur upload");
      return null;
    } finally {
      setLoading(false);
    }
  }

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  /* ── Inscrits par atelier ── */
  async function loadInscrits(atelierId: string) {
    if (expandedAtelier === atelierId) { setExpandedAtelier(null); return; }
    setExpandedAtelier(atelierId);
    if (inscritsByAtelier[atelierId]) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("atelier_registrations")
      .select("user_id, profile:user_id(pseudo, email)")
      .eq("atelier_id", atelierId);
    const users = (data ?? []).map((r: { profile: unknown }) => (Array.isArray((r as { profile: unknown }).profile) ? ((r as { profile: unknown[] }).profile[0] ?? {}) : (r as { profile: unknown }).profile ?? {}) as { pseudo?: string; email?: string });
    setInscritsByAtelier((prev) => ({ ...prev, [atelierId]: { count: users.length, users } }));
  }

  /* ── Actions programmes ── */
  async function addAtelier() {
    setErrA(""); setSavingA(true);
    const supabase = createClient();

    let finalImageUrl = newA.image_url || null;
    if (imageFile) {
      finalImageUrl = await uploadImage(imageFile, setUploadingImg, setErrA);
      if (!finalImageUrl && newA.image_url) finalImageUrl = newA.image_url;
    }

    const tagsArray = newA.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const { error } = await supabase.from("ateliers").insert({
      titre:          newA.titre.trim(),
      description:    newA.description.trim() || null,
      quote:          newA.quote.trim() || null,
      image_url:      finalImageUrl,
      tags:           tagsArray,
      horaire_debut:  toISO(newA.horaire_debut),
      horaire_fin:    toISO(newA.horaire_fin),
      lieu:           newA.lieu.trim(),
      capacite_max:   Number(newA.capacite_max),
      code_stand:     newA.code_stand.trim().toUpperCase(),
      sport_id:       newA.sport_id || null,
      association_id: newA.association_id || null,
      actif:          newA.actif,
    });
    if (error) { setErrA(error.message); setSavingA(false); return; }
    const { data } = await supabase.from("ateliers")
      .select("id, titre, description, horaire_debut, horaire_fin, lieu, capacite_max, code_stand, actif, sport_id, association_id, sport:sport_id(nom), association:association_id(nom)")
      .order("horaire_debut");
    if (data) setAteliers(data as unknown as Atelier[]);
    setNewA({ titre: "", description: "", quote: "", tags: "", image_url: "", horaire_debut: "", horaire_fin: "", lieu: "", capacite_max: 30, code_stand: "", sport_id: "", association_id: "", actif: true });
    setImageFile(null); setImagePreview("");
    setShowAddA(false); setSavingA(false);
  }

  function startEdit(a: Atelier) {
    if (editingAtelier === a.id) { setEditingAtelier(null); setEditDraft(null); return; }
    setEditingAtelier(a.id);
    setEditDraft({
      titre:          a.titre,
      description:    a.description ?? "",
      quote:          a.quote ?? "",
      tags:           (a.tags ?? []).join(", "),
      image_url:      a.image_url ?? "",
      horaire_debut:  toDatetimeLocal(a.horaire_debut),
      horaire_fin:    toDatetimeLocal(a.horaire_fin),
      lieu:           a.lieu,
      capacite_max:   a.capacite_max,
      code_stand:     a.code_stand,
      sport_id:       a.sport_id ?? "",
      association_id: a.association_id ?? "",
    });
    setEditImageFile(null);
    setEditImagePreview(a.image_url ?? "");
    setErrEdit("");
  }

  function onEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
    setEditDraft((d) => d ? { ...d, image_url: "" } : d);
  }

  async function updateAtelier(id: string) {
    if (!editDraft) return;
    setErrEdit(""); setSavingEdit(true);
    const supabase = createClient();

    let finalImageUrl = editDraft.image_url || null;
    if (editImageFile) {
      const uploaded = await uploadImage(editImageFile, setUploadingEditImg, setErrEdit);
      if (uploaded) finalImageUrl = uploaded;
    }

    const tagsArray = editDraft.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const { error } = await supabase.from("ateliers").update({
      titre:          editDraft.titre.trim(),
      description:    editDraft.description.trim() || null,
      quote:          editDraft.quote.trim() || null,
      image_url:      finalImageUrl,
      tags:           tagsArray,
      horaire_debut:  toISO(editDraft.horaire_debut),
      horaire_fin:    toISO(editDraft.horaire_fin),
      lieu:           editDraft.lieu.trim(),
      capacite_max:   Number(editDraft.capacite_max),
      code_stand:     editDraft.code_stand.trim().toUpperCase(),
      sport_id:       editDraft.sport_id || null,
      association_id: editDraft.association_id || null,
    }).eq("id", id);

    if (error) { setErrEdit(error.message); setSavingEdit(false); return; }

    // Rafraîchir la liste
    const { data } = await supabase.from("ateliers")
      .select("id, titre, description, quote, image_url, tags, horaire_debut, horaire_fin, lieu, capacite_max, code_stand, actif, sport_id, association_id, sport:sport_id(nom), association:association_id(nom)")
      .order("horaire_debut");
    if (data) setAteliers(data as unknown as Atelier[]);

    setEditingAtelier(null); setEditDraft(null);
    setEditImageFile(null); setEditImagePreview("");
    setSavingEdit(false);
  }

  async function deleteAtelier(id: string) {
    if (!confirm("Supprimer ce programme ?")) return;
    const supabase = createClient();
    await supabase.from("ateliers").delete().eq("id", id);
    setAteliers((prev) => prev.filter((a) => a.id !== id));
  }

  async function toggleAtelier(id: string, actif: boolean) {
    const supabase = createClient();
    await supabase.from("ateliers").update({ actif: !actif }).eq("id", id);
    setAteliers((prev) => prev.map((a) => a.id === id ? { ...a, actif: !actif } : a));
  }

  /* ── Actions partenaires ── */
  function onPartImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPartImageFile(file);
    setPartImagePreview(URL.createObjectURL(file));
  }

  async function addPartenaire() {
    setErrP(""); setSavingP(true);
    const supabase = createClient();
    const slug = slugify(newP.nom);

    let finalImageUrl: string | null = null;
    if (partImageFile) {
      finalImageUrl = await uploadImage(partImageFile, setUploadingPartImg, setErrP);
    }

    const tagsArray = newP.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const { error } = await supabase.from("associations").insert({
      nom:           newP.nom.trim(),
      slug,
      badge:         newP.badge.trim() || null,
      description:   newP.description.trim() || null,
      tags:          tagsArray,
      icon:          newP.icon.trim() || null,
      image_url:     finalImageUrl,
      site_web:      newP.site_web.trim() || null,
      contact_email: newP.contact_email.trim() || null,
      couleur_theme: newP.couleur_theme,
      actif:         newP.actif,
    });
    if (error) { setErrP(error.message); setSavingP(false); return; }
    const { data } = await supabase.from("associations").select("id, nom, slug, description, site_web, contact_email, couleur_theme, actif").order("nom");
    if (data) { setAssocs(data); setPartenaires(data); }
    setNewP({ nom: "", badge: "", description: "", tags: "", icon: "", site_web: "", contact_email: "", couleur_theme: "#013bb8", actif: true });
    setPartImageFile(null); setPartImagePreview("");
    setShowAddP(false); setSavingP(false);
  }

  function startEditPartenaire(p: Association & { badge?: string; tags?: string[]; icon?: string; image_url?: string; site_web?: string; contact_email?: string }) {
    if (editingPartenaire === p.id) { setEditingPartenaire(null); setEditPartDraft(null); return; }
    setEditingPartenaire(p.id);
    setEditPartDraft({
      nom:           p.nom,
      badge:         (p as { badge?: string }).badge ?? "",
      description:   p.description ?? "",
      tags:          ((p as { tags?: string[] }).tags ?? []).join(", "),
      icon:          (p as { icon?: string }).icon ?? "",
      image_url:     (p as { image_url?: string }).image_url ?? "",
      site_web:      p.site_web ?? "",
      contact_email: p.contact_email ?? "",
      couleur_theme: p.couleur_theme,
    });
    setEditPartImageFile(null);
    setEditPartImagePreview((p as { image_url?: string }).image_url ?? "");
    setErrEditP("");
  }

  function onEditPartImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditPartImageFile(file);
    setEditPartImagePreview(URL.createObjectURL(file));
  }

  async function updatePartenaire(id: string) {
    if (!editPartDraft) return;
    setErrEditP(""); setSavingEditP(true);
    const supabase = createClient();

    let finalImageUrl = editPartDraft.image_url || null;
    if (editPartImageFile) {
      const uploaded = await uploadImage(editPartImageFile, setUploadingEditPartImg, setErrEditP);
      if (uploaded) finalImageUrl = uploaded;
    }

    const tagsArray = editPartDraft.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const { error } = await supabase.from("associations").update({
      nom:           editPartDraft.nom.trim(),
      badge:         editPartDraft.badge.trim() || null,
      description:   editPartDraft.description.trim() || null,
      tags:          tagsArray,
      icon:          editPartDraft.icon.trim() || null,
      image_url:     finalImageUrl,
      site_web:      editPartDraft.site_web.trim() || null,
      contact_email: editPartDraft.contact_email.trim() || null,
      couleur_theme: editPartDraft.couleur_theme,
    }).eq("id", id);

    if (error) { setErrEditP(error.message); setSavingEditP(false); return; }

    const { data } = await supabase.from("associations")
      .select("id, nom, slug, description, site_web, contact_email, couleur_theme, actif")
      .order("nom");
    if (data) { setAssocs(data); setPartenaires(data); }

    setEditingPartenaire(null); setEditPartDraft(null);
    setEditPartImageFile(null); setEditPartImagePreview("");
    setSavingEditP(false);
  }

  async function deletePartenaire(id: string) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    const supabase = createClient();
    await supabase.from("associations").delete().eq("id", id);
    setPartenaires((prev) => prev.filter((p) => p.id !== id));
  }

  async function togglePartenaire(id: string, actif: boolean) {
    const supabase = createClient();
    await supabase.from("associations").update({ actif: !actif }).eq("id", id);
    setPartenaires((prev) => prev.map((p) => p.id === id ? { ...p, actif: !actif } : p));
  }

  /* ── Actions utilisateurs ── */
  async function changeRole(userId: string, newRole: string) {
    setUpdatingRole(userId);
    const supabase = createClient();
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    setUpdatingRole(null);
  }

  /* ── Action config ── */
  async function saveConfig() {
    setErrC(""); setSavingC(true); setSavedC(false);
    const supabase = createClient();
    const upserts = [
      { key: "date_festival",  value: toISO(config.date_festival) },
      { key: "lieu_festival",  value: config.lieu_festival },
      { key: "festival_actif", value: config.festival_actif },
    ];
    for (const u of upserts) {
      const { error } = await supabase.from("config").update({ value: u.value }).eq("key", u.key);
      if (error) { setErrC(error.message); setSavingC(false); return; }
    }
    setSavingC(false); setSavedC(true);
    setTimeout(() => setSavedC(false), 3000);
  }

  /* ── Rendu ── */
  if (checking) return null;

  if (denied) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center" style={{ backgroundColor: "var(--color-blanc)" }}>
          <span className="text-5xl mb-4">🚫</span>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
            Accès refusé
          </h1>
          <p className="text-sm opacity-60" style={{ color: "var(--color-noir)" }}>
            Tu n&apos;as pas les droits pour accéder à cette page.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto w-full px-4 pt-6 pb-20" style={{ backgroundColor: "var(--color-blanc)" }}>

        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-titre)", color: "var(--color-bleu-fonce)" }}>
          Administration
        </h1>
        <p className="text-xs opacity-50 mb-6" style={{ color: "var(--color-noir)" }}>Solimouv&apos; — Back-office</p>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ backgroundColor: "#f0f0f0" }}>
          {([["programmes", "📅"], ["partenaires", "🤝"], ["evenement", "📍"], ["utilisateurs", "👥"]] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                backgroundColor: tab === t ? "#fff" : "transparent",
                color: tab === t ? "var(--color-bleu-fonce)" : "var(--color-noir)",
                boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ══════════════════ TAB PROGRAMMES ══════════════════ */}
        {tab === "programmes" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: "var(--color-noir)" }}>
                {ateliers.length} programme{ateliers.length > 1 ? "s" : ""}
              </p>
              <button
                onClick={() => setShowAddA(!showAddA)}
                className="text-xs font-bold px-4 py-2 rounded-full"
                style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
              >
                {showAddA ? "Annuler" : "+ Ajouter"}
              </button>
            </div>

            {/* Formulaire ajout */}
            {showAddA && (
              <div className="rounded-2xl p-4 mb-5 flex flex-col gap-3" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--color-bleu-fonce)" }}>Nouveau programme</h3>
                <Field label="Titre *">
                  <input className={INPUT} style={inputStyle} value={newA.titre} onChange={(e) => setNewA((n) => ({ ...n, titre: e.target.value }))} placeholder="Ex: Yoga du matin" onFocus={(e) => Object.assign(e.target.style, focusStyle)} />
                </Field>

                <Field label="Image de couverture">
                  <div className="flex flex-col gap-2">
                    {imagePreview && (
                      <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(""); }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full text-xs flex items-center justify-center"
                          style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}>✕</button>
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium"
                      style={{ backgroundColor: "#f0f0f0", color: "var(--color-bleu-fonce)" }}>
                      {uploadingImg ? "Upload…" : "📷 Choisir une image"}
                      <input type="file" accept="image/*" className="hidden" onChange={onImageChange} disabled={uploadingImg} />
                    </label>
                  </div>
                </Field>

                <Field label="Citation / Accroche">
                  <textarea className={INPUT} style={{ ...inputStyle, resize: "none" }} rows={2} value={newA.quote} onChange={(e) => setNewA((n) => ({ ...n, quote: e.target.value }))} placeholder='Ex: "Le parquet est à vous !"' />
                </Field>
                <Field label="Description (détail)">
                  <textarea className={INPUT} style={{ ...inputStyle, resize: "none" }} rows={2} value={newA.description} onChange={(e) => setNewA((n) => ({ ...n, description: e.target.value }))} placeholder="Description plus longue…" />
                </Field>
                <Field label="Tags (séparés par des virgules)">
                  <input className={INPUT} style={inputStyle} value={newA.tags} onChange={(e) => setNewA((n) => ({ ...n, tags: e.target.value }))} placeholder="en-équipe, handisport, intense" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Début *">
                    <input type="datetime-local" className={INPUT} style={inputStyle} value={newA.horaire_debut} onChange={(e) => setNewA((n) => ({ ...n, horaire_debut: e.target.value }))} />
                  </Field>
                  <Field label="Fin *">
                    <input type="datetime-local" className={INPUT} style={inputStyle} value={newA.horaire_fin} onChange={(e) => setNewA((n) => ({ ...n, horaire_fin: e.target.value }))} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Lieu *">
                    <input className={INPUT} style={inputStyle} value={newA.lieu} onChange={(e) => setNewA((n) => ({ ...n, lieu: e.target.value }))} placeholder="Ex: Gymnase A" />
                  </Field>
                  <Field label="Code stand *">
                    <input className={INPUT} style={inputStyle} value={newA.code_stand} onChange={(e) => setNewA((n) => ({ ...n, code_stand: e.target.value }))} placeholder="Ex: YOG001" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Sport">
                    <select className={INPUT} style={inputStyle} value={newA.sport_id} onChange={(e) => setNewA((n) => ({ ...n, sport_id: e.target.value }))}>
                      <option value="">— Aucun —</option>
                      {sports.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
                    </select>
                  </Field>
                  <Field label="Association">
                    <select className={INPUT} style={inputStyle} value={newA.association_id} onChange={(e) => setNewA((n) => ({ ...n, association_id: e.target.value }))}>
                      <option value="">— Aucune —</option>
                      {assocs.map((a) => <option key={a.id} value={a.id}>{a.nom}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Capacité max">
                  <input type="number" className={INPUT} style={inputStyle} value={newA.capacite_max} onChange={(e) => setNewA((n) => ({ ...n, capacite_max: Number(e.target.value) }))} min={1} />
                </Field>
                {errA && <p className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>{errA}</p>}
                <button
                  onClick={addAtelier}
                  disabled={savingA || !newA.titre || !newA.horaire_debut || !newA.lieu || !newA.code_stand}
                  className="w-full py-3 rounded-xl text-sm font-bold disabled:opacity-40"
                  style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
                >
                  {savingA ? "Enregistrement…" : "Ajouter le programme ✓"}
                </button>
              </div>
            )}

            {/* Liste */}
            <div className="flex flex-col gap-3">
              {ateliers.map((a) => (
                <div key={a.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <div className="px-4 py-3 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--color-bleu-fonce)" }}>{a.titre}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0" style={{ backgroundColor: "var(--color-rose)", color: "#fff" }}>{a.code_stand}</span>
                      </div>
                      <p className="text-xs opacity-50 mt-0.5" style={{ color: "var(--color-noir)" }}>
                        {a.lieu} · {new Date(a.horaire_debut).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        {a.sport?.nom ? ` · ${a.sport.nom}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => loadInscrits(a.id)}
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: "#e8eaf6", color: "#3949ab" }}
                      >
                        👥 Inscrits
                      </button>
                      <button
                        onClick={() => startEdit(a)}
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: editingAtelier === a.id ? "var(--color-orange)" : "#fff3e0", color: editingAtelier === a.id ? "#fff" : "#e65100" }}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => toggleAtelier(a.id, a.actif)}
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: a.actif ? "#e8f5e9" : "#f0f0f0", color: a.actif ? "#2e7d32" : "#999" }}
                      >
                        {a.actif ? "Actif" : "Inactif"}
                      </button>
                      <button onClick={() => deleteAtelier(a.id)} className="text-lg leading-none opacity-40 hover:opacity-100 transition-opacity" aria-label="Supprimer">🗑️</button>
                    </div>
                  </div>

                  {/* Panel édition */}
                  {editingAtelier === a.id && editDraft && (
                    <div className="border-t px-4 py-4 flex flex-col gap-3" style={{ borderColor: "#f0f0f0", backgroundColor: "#fffbf5" }}>
                      <p className="text-xs font-bold" style={{ color: "var(--color-orange)" }}>✏️ Modifier le programme</p>

                      <Field label="Titre *">
                        <input className={INPUT} style={inputStyle} value={editDraft.titre}
                          onChange={(e) => setEditDraft((d) => d ? { ...d, titre: e.target.value } : d)} />
                      </Field>

                      <Field label="Image de couverture">
                        <div className="flex flex-col gap-2">
                          {editImagePreview && (
                            <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={editImagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <button type="button" onClick={() => { setEditImageFile(null); setEditImagePreview(""); setEditDraft((d) => d ? { ...d, image_url: "" } : d); }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full text-xs flex items-center justify-center"
                                style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}>✕</button>
                            </div>
                          )}
                          <label className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium"
                            style={{ backgroundColor: "#f0f0f0", color: "var(--color-bleu-fonce)" }}>
                            {uploadingImg ? "Upload…" : "📷 Changer l'image"}
                            <input type="file" accept="image/*" className="hidden" onChange={onEditImageChange} disabled={uploadingImg} />
                          </label>
                        </div>
                      </Field>

                      <Field label="Citation / Accroche">
                        <textarea className={INPUT} style={{ ...inputStyle, resize: "none" }} rows={2} value={editDraft.quote}
                          onChange={(e) => setEditDraft((d) => d ? { ...d, quote: e.target.value } : d)} />
                      </Field>

                      <Field label="Description">
                        <textarea className={INPUT} style={{ ...inputStyle, resize: "none" }} rows={2} value={editDraft.description}
                          onChange={(e) => setEditDraft((d) => d ? { ...d, description: e.target.value } : d)} />
                      </Field>

                      <Field label="Tags (séparés par des virgules)">
                        <input className={INPUT} style={inputStyle} value={editDraft.tags}
                          onChange={(e) => setEditDraft((d) => d ? { ...d, tags: e.target.value } : d)}
                          placeholder="en-équipe, handisport, intense" />
                      </Field>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Début *">
                          <input type="datetime-local" className={INPUT} style={inputStyle} value={editDraft.horaire_debut}
                            onChange={(e) => setEditDraft((d) => d ? { ...d, horaire_debut: e.target.value } : d)} />
                        </Field>
                        <Field label="Fin *">
                          <input type="datetime-local" className={INPUT} style={inputStyle} value={editDraft.horaire_fin}
                            onChange={(e) => setEditDraft((d) => d ? { ...d, horaire_fin: e.target.value } : d)} />
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Lieu *">
                          <input className={INPUT} style={inputStyle} value={editDraft.lieu}
                            onChange={(e) => setEditDraft((d) => d ? { ...d, lieu: e.target.value } : d)} />
                        </Field>
                        <Field label="Code stand *">
                          <input className={INPUT} style={inputStyle} value={editDraft.code_stand}
                            onChange={(e) => setEditDraft((d) => d ? { ...d, code_stand: e.target.value } : d)} />
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Sport">
                          <select className={INPUT} style={inputStyle} value={editDraft.sport_id}
                            onChange={(e) => setEditDraft((d) => d ? { ...d, sport_id: e.target.value } : d)}>
                            <option value="">— Aucun —</option>
                            {sports.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
                          </select>
                        </Field>
                        <Field label="Association">
                          <select className={INPUT} style={inputStyle} value={editDraft.association_id}
                            onChange={(e) => setEditDraft((d) => d ? { ...d, association_id: e.target.value } : d)}>
                            <option value="">— Aucune —</option>
                            {assocs.map((as) => <option key={as.id} value={as.id}>{as.nom}</option>)}
                          </select>
                        </Field>
                      </div>

                      <Field label="Capacité max">
                        <input type="number" className={INPUT} style={inputStyle} value={editDraft.capacite_max} min={1}
                          onChange={(e) => setEditDraft((d) => d ? { ...d, capacite_max: Number(e.target.value) } : d)} />
                      </Field>

                      {errEdit && <p className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>{errEdit}</p>}

                      <div className="flex gap-3">
                        <button onClick={() => { setEditingAtelier(null); setEditDraft(null); }}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2"
                          style={{ borderColor: "#d1d5db", color: "var(--color-noir)" }}>
                          Annuler
                        </button>
                        <button onClick={() => updateAtelier(a.id)} disabled={savingEdit || !editDraft.titre}
                          className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
                          style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}>
                          {savingEdit ? "Enregistrement…" : "Enregistrer ✓"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Panel inscrits */}
                  {expandedAtelier === a.id && (
                    <div className="border-t px-4 py-3" style={{ borderColor: "#f0f0f0", backgroundColor: "#fafafa" }}>
                      {!inscritsByAtelier[a.id] ? (
                        <p className="text-xs opacity-50" style={{ color: "var(--color-noir)" }}>Chargement…</p>
                      ) : (
                        <>
                          <p className="text-xs font-bold mb-2" style={{ color: "var(--color-bleu-fonce)" }}>
                            {inscritsByAtelier[a.id].count} inscrit{inscritsByAtelier[a.id].count > 1 ? "s" : ""} / {a.capacite_max} places
                          </p>
                          {/* Barre de remplissage */}
                          <div className="w-full h-2 rounded-full mb-3" style={{ backgroundColor: "#e0e0e0" }}>
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${Math.min(100, (inscritsByAtelier[a.id].count / a.capacite_max) * 100)}%`,
                                backgroundColor: inscritsByAtelier[a.id].count >= a.capacite_max ? "#c62828" : "var(--color-bleu-fonce)",
                              }}
                            />
                          </div>
                          {inscritsByAtelier[a.id].users.length === 0 ? (
                            <p className="text-xs opacity-40" style={{ color: "var(--color-noir)" }}>Aucun inscrit pour l&apos;instant.</p>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {inscritsByAtelier[a.id].users.map((u, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-noir)" }}>
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                    style={{ background: "linear-gradient(135deg, var(--color-rose), var(--color-bleu-clair))", color: "#fff" }}>
                                    {(u.pseudo ?? u.email ?? "?")[0].toUpperCase()}
                                  </div>
                                  <span className="font-medium">{u.pseudo ?? "—"}</span>
                                  {u.email && <span className="opacity-40 truncate">{u.email}</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════ TAB PARTENAIRES ══════════════════ */}
        {tab === "partenaires" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: "var(--color-noir)" }}>
                {partenaires.length} partenaire{partenaires.length > 1 ? "s" : ""}
              </p>
              <button
                onClick={() => setShowAddP(!showAddP)}
                className="text-xs font-bold px-4 py-2 rounded-full"
                style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
              >
                {showAddP ? "Annuler" : "+ Ajouter"}
              </button>
            </div>

            {/* Formulaire ajout */}
            {showAddP && (
              <div className="rounded-2xl p-4 mb-5 flex flex-col gap-3" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--color-bleu-fonce)" }}>Nouveau partenaire</h3>

                <Field label="Image de couverture">
                  <div className="flex flex-col gap-2">
                    {partImagePreview && (
                      <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={partImagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => { setPartImageFile(null); setPartImagePreview(""); }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full text-xs flex items-center justify-center"
                          style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}>✕</button>
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium"
                      style={{ backgroundColor: "#f0f0f0", color: "var(--color-bleu-fonce)" }}>
                      {uploadingPartImg ? "Upload…" : "📷 Choisir une image"}
                      <input type="file" accept="image/*" className="hidden" onChange={onPartImageChange} disabled={uploadingPartImg} />
                    </label>
                  </div>
                </Field>

                <Field label="Nom *">
                  <input className={INPUT} style={inputStyle} value={newP.nom} onChange={(e) => setNewP((n) => ({ ...n, nom: e.target.value }))} placeholder="Ex: Yoga Solidaire Paris" />
                </Field>
                <Field label="Badge (ex: Expert handisport)">
                  <input className={INPUT} style={inputStyle} value={newP.badge} onChange={(e) => setNewP((n) => ({ ...n, badge: e.target.value }))} placeholder="Ex: Santé mentale & bien-être" />
                </Field>
                <Field label="Description">
                  <textarea className={INPUT} style={{ ...inputStyle, resize: "none" }} rows={3} value={newP.description} onChange={(e) => setNewP((n) => ({ ...n, description: e.target.value }))} placeholder="Présentation de l'association..." />
                </Field>
                <Field label="Tags (séparés par des virgules)">
                  <input className={INPUT} style={inputStyle} value={newP.tags} onChange={(e) => setNewP((n) => ({ ...n, tags: e.target.value }))} placeholder="InclusionMoteur, EspritDequipe" />
                </Field>
                <Field label="Icône (emoji)">
                  <input className={INPUT} style={inputStyle} value={newP.icon} onChange={(e) => setNewP((n) => ({ ...n, icon: e.target.value }))} placeholder="🏀" maxLength={4} />
                </Field>
                <Field label="Site web">
                  <input className={INPUT} style={inputStyle} value={newP.site_web} onChange={(e) => setNewP((n) => ({ ...n, site_web: e.target.value }))} placeholder="https://..." />
                </Field>
                <Field label="Email contact">
                  <input type="email" className={INPUT} style={inputStyle} value={newP.contact_email} onChange={(e) => setNewP((n) => ({ ...n, contact_email: e.target.value }))} placeholder="contact@asso.fr" />
                </Field>
                <Field label="Couleur thème (fond carte)">
                  <div className="flex items-center gap-3">
                    <input type="color" value={newP.couleur_theme} onChange={(e) => setNewP((n) => ({ ...n, couleur_theme: e.target.value }))} className="w-10 h-10 rounded-lg border-2 cursor-pointer" style={{ borderColor: "#d1d5db" }} />
                    <span className="text-sm font-mono opacity-60" style={{ color: "var(--color-noir)" }}>{newP.couleur_theme}</span>
                  </div>
                </Field>
                {errP && <p className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>{errP}</p>}
                <button
                  onClick={addPartenaire}
                  disabled={savingP || !newP.nom}
                  className="w-full py-3 rounded-xl text-sm font-bold disabled:opacity-40"
                  style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
                >
                  {savingP ? "Enregistrement…" : "Ajouter le partenaire ✓"}
                </button>
              </div>
            )}

            {/* Liste */}
            <div className="flex flex-col gap-3">
              {partenaires.map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  {/* Ligne résumé */}
                  <div className="px-4 py-3 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ backgroundColor: p.couleur_theme, color: "#fff" }}>
                      {p.nom[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--color-bleu-fonce)" }}>{p.nom}</p>
                      {p.contact_email && <p className="text-xs opacity-50 truncate" style={{ color: "var(--color-noir)" }}>{p.contact_email}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEditPartenaire(p as Association & { badge?: string; tags?: string[]; icon?: string; image_url?: string; site_web?: string; contact_email?: string })}
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: editingPartenaire === p.id ? "var(--color-orange)" : "#fff3e0", color: editingPartenaire === p.id ? "#fff" : "#e65100" }}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => togglePartenaire(p.id, p.actif)}
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: p.actif ? "#e8f5e9" : "#f0f0f0", color: p.actif ? "#2e7d32" : "#999" }}
                      >
                        {p.actif ? "Actif" : "Inactif"}
                      </button>
                      <button onClick={() => deletePartenaire(p.id)} className="text-lg leading-none opacity-40 hover:opacity-100 transition-opacity" aria-label="Supprimer">🗑️</button>
                    </div>
                  </div>

                  {/* Panel édition */}
                  {editingPartenaire === p.id && editPartDraft && (
                    <div className="border-t px-4 py-4 flex flex-col gap-3" style={{ borderColor: "#f0f0f0", backgroundColor: "#fffbf5" }}>
                      <p className="text-xs font-bold" style={{ color: "var(--color-orange)" }}>✏️ Modifier le partenaire</p>

                      <Field label="Image de couverture">
                        <div className="flex flex-col gap-2">
                          {editPartImagePreview && (
                            <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={editPartImagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              <button type="button" onClick={() => { setEditPartImageFile(null); setEditPartImagePreview(""); setEditPartDraft((d) => d ? { ...d, image_url: "" } : d); }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full text-xs flex items-center justify-center"
                                style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}>✕</button>
                            </div>
                          )}
                          <label className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium"
                            style={{ backgroundColor: "#f0f0f0", color: "var(--color-bleu-fonce)" }}>
                            {uploadingEditPartImg ? "Upload…" : "📷 Changer l'image"}
                            <input type="file" accept="image/*" className="hidden" onChange={onEditPartImageChange} disabled={uploadingEditPartImg} />
                          </label>
                        </div>
                      </Field>

                      <Field label="Nom *">
                        <input className={INPUT} style={inputStyle} value={editPartDraft.nom}
                          onChange={(e) => setEditPartDraft((d) => d ? { ...d, nom: e.target.value } : d)} />
                      </Field>
                      <Field label="Badge">
                        <input className={INPUT} style={inputStyle} value={editPartDraft.badge}
                          onChange={(e) => setEditPartDraft((d) => d ? { ...d, badge: e.target.value } : d)}
                          placeholder="Ex: Expert handisport" />
                      </Field>
                      <Field label="Description">
                        <textarea className={INPUT} style={{ ...inputStyle, resize: "none" }} rows={3} value={editPartDraft.description}
                          onChange={(e) => setEditPartDraft((d) => d ? { ...d, description: e.target.value } : d)} />
                      </Field>
                      <Field label="Tags (séparés par des virgules)">
                        <input className={INPUT} style={inputStyle} value={editPartDraft.tags}
                          onChange={(e) => setEditPartDraft((d) => d ? { ...d, tags: e.target.value } : d)}
                          placeholder="InclusionMoteur, EspritDequipe" />
                      </Field>
                      <Field label="Icône (emoji)">
                        <input className={INPUT} style={inputStyle} value={editPartDraft.icon}
                          onChange={(e) => setEditPartDraft((d) => d ? { ...d, icon: e.target.value } : d)}
                          placeholder="🏀" maxLength={4} />
                      </Field>
                      <Field label="Site web">
                        <input className={INPUT} style={inputStyle} value={editPartDraft.site_web}
                          onChange={(e) => setEditPartDraft((d) => d ? { ...d, site_web: e.target.value } : d)}
                          placeholder="https://..." />
                      </Field>
                      <Field label="Email contact">
                        <input type="email" className={INPUT} style={inputStyle} value={editPartDraft.contact_email}
                          onChange={(e) => setEditPartDraft((d) => d ? { ...d, contact_email: e.target.value } : d)}
                          placeholder="contact@asso.fr" />
                      </Field>
                      <Field label="Couleur thème">
                        <div className="flex items-center gap-3">
                          <input type="color" value={editPartDraft.couleur_theme}
                            onChange={(e) => setEditPartDraft((d) => d ? { ...d, couleur_theme: e.target.value } : d)}
                            className="w-10 h-10 rounded-lg border-2 cursor-pointer" style={{ borderColor: "#d1d5db" }} />
                          <span className="text-sm font-mono opacity-60" style={{ color: "var(--color-noir)" }}>{editPartDraft.couleur_theme}</span>
                        </div>
                      </Field>

                      {errEditP && <p className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>{errEditP}</p>}

                      <div className="flex gap-3">
                        <button onClick={() => { setEditingPartenaire(null); setEditPartDraft(null); }}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2"
                          style={{ borderColor: "#d1d5db", color: "var(--color-noir)" }}>
                          Annuler
                        </button>
                        <button onClick={() => updatePartenaire(p.id)}
                          disabled={savingEditP || uploadingEditPartImg || !editPartDraft.nom}
                          className="flex-1 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
                          style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}>
                          {savingEditP ? "Enregistrement…" : "Enregistrer ✓"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════ TAB ÉVÉNEMENT ══════════════════ */}
        {tab === "evenement" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: "var(--color-bleu-fonce)" }}>Prochain rassemblement</h3>

              <div className="flex flex-col gap-4">
                <Field label="Date & heure de l'événement">
                  <input
                    type="datetime-local"
                    className={INPUT}
                    style={inputStyle}
                    value={config.date_festival}
                    onChange={(e) => setConfig((c) => ({ ...c, date_festival: e.target.value }))}
                  />
                  <p className="text-xs opacity-40 mt-1" style={{ color: "var(--color-noir)" }}>
                    Cette date alimente le compteur sur la page d&apos;accueil.
                  </p>
                </Field>

                <Field label="Lieu">
                  <input
                    className={INPUT}
                    style={inputStyle}
                    value={config.lieu_festival}
                    onChange={(e) => setConfig((c) => ({ ...c, lieu_festival: e.target.value }))}
                    placeholder="Ex: Centre Sportif Charles Moureu, Paris"
                  />
                </Field>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-noir)" }}>Festival actif</p>
                    <p className="text-xs opacity-50" style={{ color: "var(--color-noir)" }}>Active les fonctionnalités du jour J</p>
                  </div>
                  <button
                    onClick={() => setConfig((c) => ({ ...c, festival_actif: !c.festival_actif }))}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-11 h-6 rounded-full relative transition-colors"
                      style={{ backgroundColor: config.festival_actif ? "var(--color-bleu-fonce)" : "#d1d5db" }}
                    >
                      <div
                        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: config.festival_actif ? "calc(100% - 1.25rem)" : "0.25rem" }}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {errC && <p className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: "#fdecea", color: "#c62828" }}>{errC}</p>}
            {savedC && <p className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>✓ Configuration enregistrée</p>}

            <button
              onClick={saveConfig}
              disabled={savingC}
              className="w-full py-4 rounded-xl text-sm font-bold disabled:opacity-40"
              style={{ backgroundColor: "var(--color-orange)", color: "#fff" }}
            >
              {savingC ? "Enregistrement…" : "Enregistrer la configuration ✓"}
            </button>
          </div>
        )}

        {/* ══════════════════ TAB UTILISATEURS ══════════════════ */}
        {tab === "utilisateurs" && (() => {
          const ROLE_OPTIONS = myRole === "super_admin"
            ? ["user", "admin", "super_admin"]
            : ["user", "admin"];

          const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
            user:        { bg: "#f0f0f0",  color: "#555" },
            admin:       { bg: "#e8eaf6",  color: "#3949ab" },
            super_admin: { bg: "#fff3e0",  color: "#e65100" },
          };

          const filtered = users.filter((u) => {
            const q = search.toLowerCase();
            return !q || (u.pseudo ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q);
          });

          return (
            <div>
              {/* Barre de recherche */}
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">🔍</span>
                <input
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border-2 outline-none"
                  style={{ borderColor: "#d1d5db", color: "var(--color-noir)", backgroundColor: "#fafafa" }}
                  placeholder="Rechercher par pseudo ou email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <p className="text-xs opacity-50 mb-3" style={{ color: "var(--color-noir)" }}>
                {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
                {search ? ` pour « ${search} »` : ""}
              </p>

              <div className="flex flex-col gap-3">
                {filtered.length === 0 && (
                  <p className="text-center py-10 text-sm opacity-40" style={{ color: "var(--color-noir)" }}>
                    Aucun utilisateur trouvé.
                  </p>
                )}
                {filtered.map((u) => {
                  const roleStyle = ROLE_STYLE[u.role] ?? ROLE_STYLE.user;
                  const initial = (u.pseudo ?? u.email ?? "?")[0].toUpperCase();
                  const isUpdating = updatingRole === u.id;
                  return (
                    <div
                      key={u.id}
                      className="rounded-2xl px-4 py-3 flex items-center gap-3"
                      style={{ backgroundColor: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
                    >
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--color-rose), var(--color-bleu-clair))", color: "#fff" }}
                      >
                        {initial}
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--color-bleu-fonce)" }}>
                          {u.pseudo ?? "—"}
                        </p>
                        <p className="text-xs opacity-50 truncate" style={{ color: "var(--color-noir)" }}>
                          {u.email ?? "email non renseigné"}
                        </p>
                      </div>

                      {/* Sélecteur de rôle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{ backgroundColor: roleStyle.bg, color: roleStyle.color }}
                        >
                          {u.role}
                        </span>
                        <select
                          value={u.role}
                          disabled={isUpdating}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className="text-xs rounded-lg px-2 py-1.5 border outline-none cursor-pointer disabled:opacity-50"
                          style={{ borderColor: "#d1d5db", color: "var(--color-noir)", backgroundColor: "#f8f8f8" }}
                          aria-label={`Changer le rôle de ${u.pseudo}`}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        {isUpdating && <span className="text-xs opacity-50">…</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </main>
    </>
  );
}
