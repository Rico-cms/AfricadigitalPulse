export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'studio.bookemrick.online' && url.pathname === '/') {
    return Response.redirect('https://studio.bookemrick.online/studio', 302);
  }
  if (url.pathname.startsWith('/api/public/')) return context.next();
  if (!url.pathname.startsWith('/studio') && !url.pathname.startsWith('/api/')) return context.next();

  const supplied = context.request.headers.get('Authorization') || '';
  const expected = `Basic ${btoa(`gabriel:${context.env.ADMIN_PASSWORD || ''}`)}`;
  if (context.env.ADMIN_PASSWORD && supplied === expected) return context.next();

  return new Response('Authentification requise pour le studio éditorial.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Africa Digital Pulse — Studio", charset="UTF-8"',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  });
}
