const CACHE="lecomigo-v2";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",function(e){ e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();})); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}).then(function(){return self.clients.claim();})); });
self.addEventListener("fetch",function(e){
  var url=new URL(e.request.url);
  if(url.origin!==location.origin) return;            // audio do CDN vai direto pra rede
  var isDoc = e.request.mode==="navigate" || url.pathname==="/" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html");
  if(isDoc){
    // HTML: rede primeiro (sempre a versao mais nova), cache so como reserva offline
    e.respondWith(
      fetch(e.request).then(function(r){ var c=r.clone(); caches.open(CACHE).then(function(cache){cache.put(e.request,c);}); return r; })
      .catch(function(){ return caches.match(e.request).then(function(r){ return r || caches.match("./index.html"); }); })
    );
    return;
  }
  // demais arquivos (icones, manifest): cache primeiro
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
});
