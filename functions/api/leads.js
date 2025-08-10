export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    if (!env.LEADS_DB) {
      return new Response(JSON.stringify({ ok: false, error: 'LEADS_DB binding missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
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

    // Ensure table exists in case migrations were not applied
    const schema = `CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      product TEXT,
      view TEXT,
      created_at TEXT NOT NULL,
      ip_last4 TEXT,
      ua_hash TEXT,
      utm_source TEXT,
      utm_campaign TEXT,
      notes TEXT
    );`;
    await env.LEADS_DB.exec?.(schema).catch(async () => {
      try { await env.LEADS_DB.prepare(schema).run(); } catch (_) {}
    });

    // Build INSERT dynamically من أعمدة موجودة بالفعل لتجنّب أخطاء "no column named ..."
    const allCols = ['id','name','email','phone','product','view','created_at','ip_last4','ua_hash','utm_source','utm_campaign','notes'];
    const existing = await env.LEADS_DB.prepare("PRAGMA table_info('leads')").all();
    const existingCols = new Set((existing.results || []).map(r => r.name));
    const cols = allCols.filter(c => existingCols.has(c));
    if (!existingCols.has('id')) cols.unshift('id');
    if (!existingCols.has('created_at')) cols.push('created_at');

    const valuesMap = {
      id,
      name: data.name || '',
      email: data.email || null,
      phone: data.phone || null,
      product: data.product || 'LEADGRESS',
      view: data.view || 'waitlist',
      created_at: now,
      ip_last4,
      ua_hash,
      utm_source: data.utm_source || null,
      utm_campaign: data.utm_campaign || null,
      notes: data.notes || null,
    };
    const placeholders = cols.map(() => '?').join(', ');
    const stmt = `INSERT INTO leads (${cols.join(', ')}) VALUES (${placeholders})`;
    const values = cols.map(c => valuesMap[c]);
    await env.LEADS_DB.prepare(stmt).bind(...values).run();

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 201,
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message, stack: e.stack }), {
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
    if (!env.LEADS_DB) {
      return new Response(JSON.stringify({ ok: false, error: 'LEADS_DB binding missing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const url = new URL(request.url);
    const limitParam = Math.max(1, Math.min(200, Number(url.searchParams.get('limit')) || 50));
    const debug = url.searchParams.get('debug') === '1';

    const origin = request.headers.get('Origin') || '';
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Ensure table exists to avoid first-run errors on fresh envs
    const schema = `CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      product TEXT,
      view TEXT,
      created_at TEXT NOT NULL,
      ip_last4 TEXT,
      ua_hash TEXT,
      utm_source TEXT,
      utm_campaign TEXT,
      notes TEXT
    );`;
    try { await env.LEADS_DB.prepare(schema).run(); } catch (_) {}

    const res = await env.LEADS_DB.prepare(
      `SELECT id, name, email, phone, product, view, created_at
       FROM leads
       ORDER BY created_at DESC
       LIMIT ?`
    ).bind(limitParam).all();

    const payload = { ok: true, items: res.results };
    if (debug) {
      const countRes = await env.LEADS_DB.prepare('SELECT COUNT(*) as c FROM leads').all();
      payload.total = countRes.results?.[0]?.c ?? 0;
    }

    return new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes('no such table: leads')) {
      return new Response(JSON.stringify({ ok: true, items: [], total: 0 }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    return new Response(JSON.stringify({ ok: false, error: msg, stack: e.stack }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}


