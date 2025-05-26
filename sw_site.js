const cacheName = "BeliHewanCache_V1";

const cacheAssets = [
    '/503',
    '/data/template/error/503.js',
    '/data/assets/css/error/error.css',
    '/data/assets/javascript/head.js',
    '/data/assets/css/base.css',
    '/data/template/base.js',
    '/data/assets/image/logo/favicon.ico',
    '/data/assets/image/logo/home.png',
    '/data/assets/image/logo/icon/search.svg',
    '/data/assets/image/logo/icon/google.svg',
    '/data/assets/css/font.woff2',
    '/data/assets/javascript/json_data_storage/kategori.json',
    '/data/assets/javascript/json_data_storage/wilayah.json'
];

self.addEventListener('install', e=>{
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                return cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e=>{
    e.waitUntil(
        caches.keys().then(cacheNamesList => {
            return Promise.all(
                cacheNamesList.map(cache => {
                    if(cache !== cacheName){
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            
            return fetch(event.request).catch(function() {
                return caches.match('/503');
            });
        })
    );
});