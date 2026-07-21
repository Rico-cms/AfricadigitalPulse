export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT * FROM sources ORDER BY level, name').all();
  return Response.json({ items: results }, { headers: { 'Cache-Control': 'no-store' } });
}
