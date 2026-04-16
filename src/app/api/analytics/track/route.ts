import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const ALLOWED = new Set(["signup", "starter_analysis"]);

async function sendMixpanel(
  event: string,
  distinctId: string,
  properties: Record<string, unknown>,
  insertId?: string,
): Promise<void> {
  const token = process.env.MIXPANEL_TOKEN;
  if (!token) return;

  const baseUrl = process.env.MIXPANEL_API_HOST ?? "https://api.mixpanel.com";
  const payload = [
    {
      event,
      properties: {
        token,
        distinct_id: distinctId,
        time: Math.floor(Date.now() / 1000),
        ...(insertId ? { $insert_id: insertId } : {}),
        ...properties,
      },
    },
  ];

  const res = await fetch(`${baseUrl}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: JSON.stringify(payload) }),
  });

  if (!res.ok) {
    console.error("Mixpanel:", res.status, await res.text());
  }
}

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const authHeader = req.headers.get("Authorization");
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(url, anon);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { event?: string; properties?: Record<string, unknown>; insert_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event;
  if (!event || !ALLOWED.has(event)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  if (!process.env.MIXPANEL_TOKEN) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const props = {
    ...body.properties,
    ...(user.email ? { $email: user.email } : {}),
  };

  const insertId =
    body.insert_id ??
    (event === "signup" ? `${user.id}-signup` : undefined);

  await sendMixpanel(event, user.id, props, insertId);

  return NextResponse.json({ ok: true });
}
