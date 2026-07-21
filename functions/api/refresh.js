export async function onRequestPost({ env }) {
  if (!env.COLLECTOR_TOKEN) return Response.json({ error: 'Collecteur non configuré' }, { status: 503 });
  const response = await fetch('https://africa-digital-pulse-collector.dahissihogabriel.workers.dev/run', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.COLLECTOR_TOKEN}` }
  });
  if (!response.ok) return Response.json({ error: 'Échec du collecteur', status: response.status }, { status: 502 });
  return Response.json(await response.json());
}
