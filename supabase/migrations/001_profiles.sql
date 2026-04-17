-- ============================================================
-- TABLE profiles — liée à auth.users (Supabase Auth)
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  pseudo      text        not null,
  email       text,
  pronouns    text        check (pronouns in ('iel','elle','il','neutre')),
  pratique    text        check (pratique in ('equipe','solo')),
  besoin      text        check (besoin in ('depenser','ressourcer')),
  accessibilite text[]   default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Mise à jour automatique de updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ── Row Level Security ──────────────────────────────────────
alter table public.profiles enable row level security;

-- Lecture : uniquement son propre profil
create policy "Lecture profil personnel"
  on public.profiles for select
  using (auth.uid() = id);

-- Insertion : uniquement pour soi-même
create policy "Création profil personnel"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Modification : uniquement son propre profil
create policy "Modification profil personnel"
  on public.profiles for update
  using (auth.uid() = id);
