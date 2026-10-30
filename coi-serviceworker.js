/*! coi-serviceworker v0.1.6 - Guido Zuidhof, licensed under MIT */
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
    async function handleFetch(request) {
        if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
            return;
        }
        let r = await fetch(request).catch(e => console.error(e));
        if (r.status === 0) {
            return r;
        }
        const headers = new Headers(r.headers);
        headers.set("Cross-Origin-Embedder-Policy", "require-corp");
        headers.set("Cross-Origin-Opener-Policy", "same-origin");
        return new Response(r.body, { status: r.status, statusText: r.statusText, headers });
    }
    self.addEventListener("fetch", function(e) {
        e.respondWith(handleFetch(e.request));
    });
} else {
    (async function() {
        if (window.crossOriginIsolated !== false) return;
        let registration = await navigator.serviceWorker.register(window.document.currentScript.src).catch(e => console.error(e));
        if (registration) {
            registration.addEventListener("updatefound", () => { window.location.reload(); });
            if (registration.active && !navigator.serviceWorker.controller) {
                window.location.reload();
            }
        }
    })();
}
