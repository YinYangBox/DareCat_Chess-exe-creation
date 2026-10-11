const remoteUrl = "https://yinyangbox.github.io/DareCat_Chess/index.html";

function showGame(data) {
    document.open();
    document.write(data);
    document.close();
}

function openLocalFallback() {
    window.location.replace(new URL("game.html", window.location.href).href);
}

fetch(remoteUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.text();
    })
    .then(async data => {
        try {
            const cache = await caches.open("v1");
            await cache.put(remoteUrl, new Response(data));
        } catch (error) {
            console.warn("Could not cache the downloaded game:", error);
        }

        showGame(data);
    })
    .catch(async error => {
        console.warn("Could not download the online game:", error);

        try {
            const cache = await caches.open("v1");
            const response = await cache.match(remoteUrl);

            if (response) {
                showGame(await response.text());
                return;
            }
        } catch (cacheError) {
            console.warn("Could not read the cached game:", cacheError);
        }

        openLocalFallback();
    });
