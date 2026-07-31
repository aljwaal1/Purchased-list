const CACHE_NAME='smart-shopping-pwa-v3';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./safari-mode.js'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))
  );
  self.clients.claim();
});

async function injectSafariMode(response){
  try{
    const type=response.headers.get('content-type')||'';
    if(!type.includes('text/html'))return response;
    let html=await response.text();
    if(!html.includes('safari-mode.js'))html=html.replace('</body>','<script src="safari-mode.js"></script></body>');
    const headers=new Headers(response.headers);
    headers.delete('content-length');
    return new Response(html,{status:response.status,statusText:response.statusText,headers});
  }catch(e){return response}
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  const isNavigation=event.request.mode==='navigate';

  if(isNavigation&&url.origin===self.location.origin){
    event.respondWith((async()=>{
      try{
        const network=await fetch(event.request,{cache:'no-store'});
        const cache=await caches.open(CACHE_NAME);
        cache.put('./index.html',network.clone());
        return injectSafariMode(network);
      }catch(e){
        const cached=await caches.match('./index.html');
        return cached?injectSafariMode(cached):Response.error();
      }
    })());
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request).catch(()=>caches.match('./index.html')))
  );
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL('./index.html#open',self.location.href).href;
  event.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(windows=>{
      for(const client of windows){
        if('focus' in client){client.navigate(target);return client.focus();}
      }
      return clients.openWindow?clients.openWindow(target):undefined;
    })
  );
});