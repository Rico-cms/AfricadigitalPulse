export async function onRequestPost({ env }) {
  if (!env.COLLECTOR_TOKEN) return Response.json({ error: 'COLLECTOR_TOKEN absent dans Cloudflare Pages' }, { status: 503 });
  try {
    const response = await fetch('https://africa-digital-pulse-collector.dahissihogabriel.workers.dev/run', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.COLLECTOR_TOKEN}` },
      signal: AbortSignal.timeout(25000)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = response.status === 401 ? 'Token du collecteur invalide' : `Worker collecteur indisponible (${response.status})`;
      return Response.json({ error: detail }, { status: 502 });
    }
    return Response.json({ ...payload, refreshedAt: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.name === 'TimeoutError' ? 'Le collecteur a dépassé 25 secondes' : 'Connexion au collecteur impossible' }, { status: 502 });
  }
}
