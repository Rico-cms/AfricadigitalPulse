const clean = value => String(value || '').trim();
const slugify = value => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT * FROM articles ORDER BY updated_at DESC').all();
  return Response.json({ items: results }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function onRequestPost({ request, env }) {
  const data = await request.json();
  const status = data.status === 'published' ? 'published' : 'draft';
  const required = ['title', 'summary', 'body', 'confirmed', 'unknown', 'analysis'];
  if (status === 'published' && (!data.approved || required.some(k => !clean(data[k])))) {
    return Response.json({ error: 'Contrôles éditoriaux incomplets' }, { status: 400 });
  }
  if (!clean(data.title)) return Response.json({ error: 'Titre obligatoire' }, { status: 400 });

  const values = {
    signalId: Number.isInteger(data.signalId) ? data.signalId : null,
    slug: slugify(data.title), title: clean(data.title), summary: clean(data.summary), body: clean(data.body),
    confirmed: clean(data.confirmed), unknown: clean(data.unknown), analysis: clean(data.analysis),
    country: clean(data.country), sector: clean(data.sector), sourceUrl: clean(data.sourceUrl), sourceName: clean(data.sourceName), status
  };
  let item;
  if (Number.isInteger(data.id)) {
    item = await env.DB.prepare(`UPDATE articles SET slug=?,title=?,summary=?,body=?,confirmed=?,unknown_facts=?,analysis=?,country=?,sector=?,source_url=?,source_name=?,status=?,updated_at=CURRENT_TIMESTAMP,published_at=CASE WHEN ?='published' THEN COALESCE(published_at,CURRENT_TIMESTAMP) ELSE published_at END WHERE id=? RETURNING *`).bind(values.slug,values.title,values.summary,values.body,values.confirmed,values.unknown,values.analysis,values.country,values.sector,values.sourceUrl,values.sourceName,status,status,data.id).first();
  } else {
    item = await env.DB.prepare(`INSERT INTO articles(signal_id,slug,title,summary,body,confirmed,unknown_facts,analysis,country,sector,source_url,source_name,status,published_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,CASE WHEN ?='published' THEN CURRENT_TIMESTAMP END) ON CONFLICT(signal_id) DO UPDATE SET slug=excluded.slug,title=excluded.title,summary=excluded.summary,body=excluded.body,confirmed=excluded.confirmed,unknown_facts=excluded.unknown_facts,analysis=excluded.analysis,country=excluded.country,sector=excluded.sector,source_url=excluded.source_url,source_name=excluded.source_name,status=excluded.status,updated_at=CURRENT_TIMESTAMP,published_at=CASE WHEN excluded.status='published' THEN COALESCE(articles.published_at,CURRENT_TIMESTAMP) ELSE articles.published_at END RETURNING *`).bind(values.signalId,values.slug,values.title,values.summary,values.body,values.confirmed,values.unknown,values.analysis,values.country,values.sector,values.sourceUrl,values.sourceName,status,status).first();
  }
  if (!item) return Response.json({ error: 'Article introuvable' }, { status: 404 });
  if (status === 'published' && item.signal_id) await env.DB.prepare("UPDATE signals SET status='used' WHERE id=?").bind(item.signal_id).run();
  return Response.json({ item });
}
