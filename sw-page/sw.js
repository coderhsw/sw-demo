const cacheStorageKey = 'my-test-cache-v1';

this.addEventListener('install', event => {
	event.waitUntil(this.skipWaiting());
});

this.addEventListener('activate', event => {
	const cacheDeletePromises = caches.keys().then(cacheNames => {
		return Promise.all(
			cacheNames.map(name => {
				if (name !== cacheStorageKey) {
					return caches.delete(name);
				} else {
					return Promise.resolve();
				}
			})
		);
	});

	event.waitUntil(
		this.clients.claim(),
		Promise.all([cacheDeletePromises]),
		caches
			.open(cacheStorageKey)
			.then(cache => {
				return cache.addAll(['/js/index.js', '/style/style.css', '/favicon.ico']);
			})
			.catch(err => {
				console.log(err);
			})
	);
});

this.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			if (response) {
				return response;
			}

			return fetch(event.request).then(httpRes => {
				if (!httpRes || httpRes.status !== 200) {
					return httpRes;
				}

				const responseClone = httpRes.clone();
				caches.open('my-test-cache-v1').then(cache => {
					cache.put(event.request, responseClone);
				});

				return httpRes;
			});
		})
	);
});
