const CACHE_NAME = "app-cache-v2"; // Asegúrate de cambiar el nombre si actualizas el caché
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/logo192.png",
  "/static/js/bundle.js", // Asegúrate de incluir los archivos de React
  "/screens/auth/LoginScreen.js",
  "/screens/auth/RegisterScreen.js",
  "/screens/Splash/SplashScreen.js",
  "/screens/tabs/HomeScreen.js",
  "/screens/tabs/AboutScreen.js",
];

// Instalación del Service Worker (almacenar en caché)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache abierta");
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar peticiones y responder con caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Eliminar caché antiguo cuando haya cambios
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Borrando caché antigua:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
