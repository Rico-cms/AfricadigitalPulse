export async function onRequestPost({ request, env }) {
  const { signalId } = await request.json();
  if (!Number.isInteger(signalId)) return Response.json({ error: 'signalId invalide' }, { status: 400 });

  const signal = await env.DB.prepare('SELECT id FROM signals WHERE id=?').bind(signalId).first();
  if (!signal) return Response.json({ error: 'Signal introuvable' }, { status: 404 });

  await env.DB.batch([
    env.DB.prepare("UPDATE signals SET status='qualified' WHERE id=?").bind(signalId),
    env.DB.prepare("INSERT OR IGNORE INTO analysis_queue(signal_id,status) VALUES(?,'queued')").bind(signalId)
  ]);
  return Response.json({ ok: true, signalId, status: 'qualified' });
}
