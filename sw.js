// Wally MK 2 service worker: makes the app installable and keeps a copy of its own
// files so it opens without a connection. Network first, so updates always win.
const CACHE = 'wally-mk2-v3';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request;
  const u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== self.location.origin || u.pathname.indexOf('/api/') === 0) return;   // data calls always go straight to the server
  e.respondWith(
    fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); } return res; })   // a refused (sign-in) page is never stored
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});

// tapping a reminder opens (or focuses) the app on the right tab
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const tab = (e.notification.data && e.notification.data.tab) || 'dashboard';
  const url = tab === 'fitness' ? './fitness/index.html' : './index.html';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const hit = list.find(c => c.url.includes(tab === 'fitness' ? '/fitness/' : 'index.html') || (tab !== 'fitness' && !c.url.includes('/fitness/')));
    return hit ? hit.focus() : self.clients.openWindow(url);
  }));
});
