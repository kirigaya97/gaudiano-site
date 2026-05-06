// ⚠️ INACTIVE — kept as a fallback in case we migrate off Web3Forms back to Resend.
// The landing form posts directly to https://api.web3forms.com/submit (see src/pages/index.astro).
// This endpoint is no longer hit by the UI, but is preserved (deployed and reachable) so we can
// re-point the form here without a redeploy if needed. Reactivation requires:
//   1. Verified sender domain in Resend (blocked today by DNS in Wix — see ../../../dns.txt).
//   2. RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL set in Vercel.
//   3. Revert form action + JS in src/pages/index.astro to /api/contact.
import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const {
    name,
    email,
    phone,
    message,
    website, // honeypot
  } = payload as Record<string, string | undefined>;

  // Honeypot — bots fill this; respond 200 so they think it worked.
  if (website && website.trim() !== "") {
    return json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return json({ error: "Faltan campos requeridos." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Email inválido." }, 400);
  }
  if (name.length > 200 || email.length > 200 || (phone ?? "").length > 50 || message.length > 5000) {
    return json({ error: "Longitud inválida." }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("Contact form missing env config", {
      hasKey: Boolean(apiKey),
      hasTo: Boolean(to),
      hasFrom: Boolean(from),
    });
    return json({ error: "Servicio de correo no configurado." }, 500);
  }

  const resend = new Resend(apiKey);
  const subject = `Nueva consulta — ${name}`;
  const body = [
    `Nombre: ${name}`,
    `Email: ${email}`,
    phone ? `Teléfono: ${phone}` : null,
    "",
    "Mensaje:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject,
    text: body,
  });

  if (error) {
    console.error("Resend error", error);
    return json({ error: "No pudimos enviar tu consulta. Probá de nuevo." }, 502);
  }

  return json({ ok: true });
};
