export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const slug = String(url.searchParams.get('slug') || '').trim();
  if (slug) {
    const item = await env.DB.prepare(
      "SELECT * FROM articles WHERE status='published' AND slug=? LIMIT 1"
    ).bind(slug).first();
    if (!item) return Response.json({ error: 'Article introuvable' }, { status: 404 });
    return Response.json({ item }, { headers: { 'Cache-Control': 'public, max-age=60' } });
  }
  const { results } = await env.DB.prepare(
    "SELECT * FROM articles WHERE status='published' ORDER BY published_at DESC, updated_at DESC"
  ).all();
  return Response.json({ items: results }, { headers: { 'Cache-Control': 'public, max-age=60' } });
}
