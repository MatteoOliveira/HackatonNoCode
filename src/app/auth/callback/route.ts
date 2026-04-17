import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${origin}/connexion?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      // Si une destination explicite est demandée, on y va directement
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Sinon on détecte si c'est une nouvelle inscription ou une reconnexion
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("pratique")
          .eq("id", user.id)
          .single();

        // Profil sans données onboarding = nouvel inscrit → poursuivre le parcours
        if (!profile?.pratique) {
          return NextResponse.redirect(`${origin}/inscription?oauth=1`);
        }
      }

      // Utilisateur existant → profil
      return NextResponse.redirect(`${origin}/profil`);
    }
  }

  return NextResponse.redirect(`${origin}/connexion?error=auth_error`);
}
