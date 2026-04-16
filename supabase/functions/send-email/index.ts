// @ts-nocheck — Deno Edge Function; not checked by project tsconfig
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

interface HookPayload {
  user: {
    id: string;
    email: string;
    user_metadata: Record<string, unknown>;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

const SUBJECTS: Record<string, string> = {
  signup: "Confirm your GameFit account",
  recovery: "Reset your GameFit password",
  magiclink: "Your GameFit login link",
  email_change: "Confirm your new email address",
  invite: "You've been invited to GameFit",
};

const CTA_LABELS: Record<string, string> = {
  signup: "Confirm Email",
  recovery: "Reset Password",
  magiclink: "Sign In",
  email_change: "Confirm New Email",
  invite: "Accept Invite",
};

function buildVerifyUrl(data: HookPayload["email_data"]): string {
  const params = new URLSearchParams({
    token_hash: data.token_hash,
    type: data.email_action_type,
  });
  if (data.redirect_to) params.set("redirect_to", data.redirect_to);
  return `${SUPABASE_URL}/auth/v1/verify?${params}`;
}

function html(type: string, url: string, name: string): string {
  const cta = CTA_LABELS[type] ?? "Continue";
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:12px;padding:40px;border:1px solid #2a2a4a">
        <tr><td align="center" style="padding-bottom:24px">
          <h1 style="color:#e0e0e0;font-size:22px;margin:0">GameFit</h1>
        </td></tr>
        <tr><td style="color:#cccccc;font-size:15px;line-height:1.6;padding-bottom:24px">
          Hi${name ? ` ${name}` : ""},<br/><br/>
          ${type === "signup" ? "Thanks for signing up! Please confirm your email address to get started." : ""}
          ${type === "recovery" ? "We received a request to reset your password. Click below to choose a new one." : ""}
          ${type === "magiclink" ? "Click below to sign in to your account." : ""}
          ${type === "email_change" ? "Please confirm your new email address by clicking below." : ""}
          ${type === "invite" ? "You've been invited to join GameFit. Click below to accept." : ""}
        </td></tr>
        <tr><td align="center" style="padding-bottom:24px">
          <a href="${url}" style="display:inline-block;background:#6c63ff;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600">${cta}</a>
        </td></tr>
        <tr><td style="color:#888888;font-size:12px;line-height:1.5">
          If you didn't request this, you can safely ignore this email.<br/>
          This link expires in 24 hours.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

Deno.serve(async (req) => {
  try {
    const payload: HookPayload = await req.json();
    const { user, email_data } = payload;

    const verifyUrl = buildVerifyUrl(email_data);
    const name =
      (user.user_metadata?.full_name as string) ?? (user.user_metadata?.name as string) ?? "";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: Deno.env.get("EMAIL_FROM") ?? "GameFit <onboarding@resend.dev>",
        to: [user.email],
        subject: SUBJECTS[email_data.email_action_type] ?? "GameFit",
        html: html(email_data.email_action_type, verifyUrl, name),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-email error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
