interface NewUserPayload {
  email:      string;
  pseudo:     string;
  created_at: string;
  source:     "email" | "google";
}

export async function notifyMakeNewUser(payload: NewUserPayload): Promise<void> {
  const url = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL;
  if (!url) return; // webhook non configuré, on skip silencieusement

  try {
    await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
  } catch {
    // Ne pas bloquer l'inscription si Make est indisponible
  }
}
