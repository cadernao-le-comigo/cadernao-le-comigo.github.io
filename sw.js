const CACHE="lecomigo-v1";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",function(e){ e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();})); });
self.addEventListener("activate",function(e){ e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}).then(function(){return self.clients.claim();})); });
self.addEventListener("fetch",function(e){
  var url=new URL(e.request.url);
  if(url.origin!==location.origin) return;            // audio do CDN vai direto pra rede
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
});