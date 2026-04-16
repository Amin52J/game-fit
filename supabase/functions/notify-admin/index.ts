// REMOVE ME: replaced by Mixpanel analytics on the client side.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "a.jafari.90@gmail.com";
const EMAIL_FROM = Deno.env.get("EMAIL_FROM") ?? "GameFit <onboarding@resend.dev>";

interface NotifyPayload {
  event: "signup" | "starter_analysis";
  user_email?: string;
  user_name?: string;
  game_name?: string;
  analyses_used?: number;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, unknown>;
  old_record?: Record<string, unknown>;
}

function parsePayload(raw: Record<string, unknown>): NotifyPayload {
  if (raw.type && raw.table && raw.record) {
    const wh = raw as unknown as WebhookPayload;
    if (wh.table === "profiles" && wh.type === "INSERT") {
      return {
        event: "signup",
        user_email: (wh.record.display_name as string) ?? undefined,
        user_name: (wh.record.display_name as string) ?? undefined,
      };
    }
  }
  return raw as unknown as NotifyPayload;
}

function buildSubject(p: NotifyPayload): string {
  if (p.event === "signup") {
    return `New signup: ${p.user_email ?? "unknown"}`;
  }
  return `Starter analysis #${p.analyses_used ?? "?"}: ${p.game_name ?? "unknown game"}`;
}

function buildHtml(p: NotifyPayload): string {
  const time = new Date().toUTCString();

  if (p.event === "signup") {
    return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0"><tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:12px;padding:40px;border:1px solid #2a2a4a">
      <tr><td style="color:#6c63ff;font-size:13px;font-weight:700;letter-spacing:1px;padding-bottom:8px">NEW SIGNUP</td></tr>
      <tr><td style="color:#e0e0e0;font-size:18px;font-weight:600;padding-bottom:16px">${p.user_email ?? "Unknown"}</td></tr>
      <tr><td style="color:#888;font-size:13px;line-height:1.6">
        ${p.user_name ? `<strong style="color:#ccc">Name:</strong> ${p.user_name}<br/>` : ""}
        <strong style="color:#ccc">Time:</strong> ${time}
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`.trim();
  }

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0"><tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:12px;padding:40px;border:1px solid #2a2a4a">
      <tr><td style="color:#6c63ff;font-size:13px;font-weight:700;letter-spacing:1px;padding-bottom:8px">STARTER ANALYSIS USED</td></tr>
      <tr><td style="color:#e0e0e0;font-size:18px;font-weight:600;padding-bottom:16px">${p.game_name ?? "Unknown game"}</td></tr>
      <tr><td style="color:#888;font-size:13px;line-height:1.6">
        <strong style="color:#ccc">User:</strong> ${p.user_email ?? "Unknown"}<br/>
        <strong style="color:#ccc">Analysis #:</strong> ${p.analyses_used ?? "?"} of 5<br/>
        <strong style="color:#ccc">Time:</strong> ${time}
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`.trim();
}

Deno.serve(async (req) => {
  try {
    const raw = await req.json();
    const payload = parsePayload(raw);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [ADMIN_EMAIL],
        subject: buildSubject(payload),
        html: buildHtml(payload),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-admin error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
