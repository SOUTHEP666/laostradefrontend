self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('laostrade-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/main.js',
        '/src/views/Home.vue',
        '/src/assets/logo.svg'
      ])
    })
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  )
})
