export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(`
    SELECT signals.*, sources.name AS source_name, sources.level AS source_level
    FROM signals JOIN sources ON sources.id = signals.source_id
    ORDER BY signals.collected_at DESC LIMIT 200
  `).all();
  return Response.json({ items: results }, { headers: { 'Cache-Control': 'no-store' } });
}
