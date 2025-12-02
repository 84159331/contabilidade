// Service Worker para cache de assets estáticos
// Versão do cache - incrementar para invalidar cache antigo
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `comunidade-resgate-${CACHE_VERSION}`;

// Assets para cachear imediatamente
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

// Estratégias de cache
const CACHE_STRATEGIES = {
  // Cache First: Usa cache, depois busca na rede
  CACHE_FIRST: 'cache-first',
  // Network First: Busca na rede primeiro, usa cache se falhar
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate: Retorna cache imediatamente e atualiza em background
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...', CACHE_NAME);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' }))).catch((err) => {
        console.warn('[SW] Failed to cache some assets:', err);
      });
    })
  );
  
  // Ativar imediatamente sem esperar outras abas fecharem
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Limpar caches antigos
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Assumir controle de todas as abas imediatamente
  return self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorar requisições para APIs externas (exceto assets estáticos)
  if (url.origin !== self.location.origin && !url.pathname.startsWith('/static')) {
    return;
  }

  // Estratégia baseada no tipo de recurso
  if (url.pathname.startsWith('/static/')) {
    // Assets estáticos: Cache First
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    // APIs: Network First
    event.respondWith(networkFirst(request));
  } else {
    // Páginas HTML: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Estratégia: Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    // Cachear resposta bem-sucedida
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    // Retornar resposta offline se disponível
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Estratégia: Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cachear resposta bem-sucedida
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Estratégia: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Buscar na rede em background
  const fetchPromise = fetch(request).then((networkResponse) => {
    // Cachear resposta bem-sucedida
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Se falhar, não fazer nada
  });

  // Retornar cache imediatamente se disponível, senão esperar rede
  return cachedResponse || fetchPromise;
}

// Mensagens do Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});

