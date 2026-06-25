const CACHE_NAME = 'voyage-v1';
const ASSETS = [
    './index.html',
    './game.js', // 본인의 메인 로직 파일명
    './libs/three.min.js',
    './libs/OrbitControls.js',
    './libs/gsap.min.js'
];

// 설치 시 에셋 캐싱
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 오프라인 상태에서도 캐시된 파일 반환
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});