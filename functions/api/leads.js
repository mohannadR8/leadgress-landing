export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    // CORS: allow same-origin and preconfigured frontend
    const origin = request.headers.get('Origin') || '';
    const allowed = [origin];

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const data = await request.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const ip = request.headers.get('CF-Connecting-IP') || '';
    const ip_last4 = ip.split('.').slice(-1)[0] || '';
    const ua = request.headers.get('User-Agent') || '';
    const ua_hash = await sha256Hex(ua);

    const stmt = `INSERT INTO leads (id, name, email, phone, product, view, created_at, ip_last4, ua_hash, utm_source, utm_campaign, notes)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      id,
      data.name || '',
      data.email || null,
      data.phone || null,
      data.product || 'LEADGRESS',
      data.view || 'waitlist',
      now,
      ip_last4,
      ua_hash,
      data.utm_source || null,
      data.utm_campaign || null,
      data.notes || null,
    ];

    await env.LEADS_DB.prepare(stmt).bind(...values).run();

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 201,
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

async function sha256Hex(input) {
  const enc = new TextEncoder();
  const buf = enc.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const limitParam = Math.max(1, Math.min(200, Number(url.searchParams.get('limit')) || 50));

    const origin = request.headers.get('Origin') || '';
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const res = await env.LEADS_DB.prepare(
      `SELECT id, name, email, phone, product, view, created_at
       FROM leads
       ORDER BY created_at DESC
       LIMIT ?`
    ).bind(limitParam).all();

    return new Response(JSON.stringify({ ok: true, items: res.results }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}


