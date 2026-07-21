const encoder = new TextEncoder();

async function sessionToken(password) {
  const data = encoder.encode(`africa-digital-pulse:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
}

function cookieValue(request, name) {
  const cookie = request.headers.get('Cookie') || '';
  return cookie.split(';').map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1) || '';
}

function loginPage(message = '') {
  return new Response(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connexion — ADP Studio</title><link rel="icon" href="/favicon-studio.svg"><style>
  :root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#090b10;color:#f4f2e9;font-family:Inter,Arial,sans-serif;background-image:radial-gradient(circle at 15% 15%,#d7ff3f22,transparent 32%),linear-gradient(135deg,#090b10,#15182a)}main{width:min(430px,calc(100% - 32px));padding:36px;border:1px solid #ffffff25;background:#11141ddd;box-shadow:0 28px 80px #0008;backdrop-filter:blur(18px)}small{color:#d7ff3f;letter-spacing:.18em;font-weight:800}h1{font-size:clamp(2.3rem,8vw,4rem);line-height:.9;margin:18px 0 28px}label{display:block;margin:16px 0 7px;font-size:.78rem;letter-spacing:.12em}input{width:100%;padding:14px;border:1px solid #ffffff35;background:#090b10;color:white;font:inherit}button{width:100%;margin-top:24px;padding:15px;border:0;background:#d7ff3f;color:#090b10;font-weight:900;cursor:pointer}.error{padding:12px;background:#ff52631c;border:1px solid #ff5263;color:#ffabb3}p{color:#aeb4c3;line-height:1.5}</style></head><body><main><small>AFRICA DIGITAL PULSE</small><h1>Studio<br>éditorial.</h1><p>Connectez-vous pour accéder à la veille, à l’analyse et aux publications.</p>${message ? `<p class="error">${message}</p>` : ''}<form method="post" action="/studio/login"><label>IDENTIFIANT</label><input name="username" value="gabriel" autocomplete="username" required><label>MOT DE PASSE</label><input name="password" type="password" autocomplete="current-password" required><button type="submit">SE CONNECTER →</button></form></main></body></html>`, { status: message ? 401 : 200, headers: { 'Content-Type': 'text/html; charset=UTF-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'studio.bookemrick.online' && url.pathname === '/') {
    return Response.redirect('https://studio.bookemrick.online/studio', 302);
  }
  if (url.pathname.startsWith('/api/public/')) return context.next();
  if (!url.pathname.startsWith('/studio') && !url.pathname.startsWith('/api/')) return context.next();

  const password = context.env.ADMIN_PASSWORD || '';
  if (!password) return loginPage('Le mot de passe du Studio n’est pas configuré sur Cloudflare.');
  const expectedSession = await sessionToken(password);

  if (url.pathname === '/studio/login' && context.request.method === 'POST') {
    const form = await context.request.formData();
    if (form.get('username') === 'gabriel' && form.get('password') === password) {
      return new Response(null, { status: 303, headers: { Location: '/studio', 'Set-Cookie': `adp_session=${expectedSession}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`, 'Cache-Control': 'no-store' } });
    }
    return loginPage('Identifiant ou mot de passe incorrect.');
  }

  if (url.pathname === '/studio/logout') {
    return new Response(null, { status: 303, headers: { Location: '/studio', 'Set-Cookie': 'adp_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' } });
  }

  const supplied = context.request.headers.get('Authorization') || '';
  const expectedBasic = `Basic ${btoa(`gabriel:${password}`)}`;
  const authenticated = cookieValue(context.request, 'adp_session') === expectedSession || supplied === expectedBasic;
  if (authenticated) return context.next();

  if (url.pathname.startsWith('/api/')) {
    return Response.json({ error: 'Session expirée' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  return loginPage();
}
