const IndexedDB = (() => {
	const initialize = async () => {
		const request = window.indexedDB.open('dchat-store', 1);

		request.onupgradeneeded = () => {
			const db = request.result;

			if (!db.objectStoreNames.contains('cryptoInstance')) {
				db.createObjectStore('cryptoInstance');
			}
		};
		return new Promise((resolve, reject) => {
			request.onerror = (event) => console.error(event);
			request.onsuccess = () => resolve(request.result);
		});
	};

	const getCryptoInstance = async (db, uid) => {
		const transaction = db.transaction('cryptoInstance', 'readonly');
		const cryptoInstanceStore = transaction.objectStore('cryptoInstance');
		const request = cryptoInstanceStore.get(uid);
		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request.result ?? null);
		});
	};

	const saveCryptoInstance = async (db, object, uid) => {
		const transaction = db.transaction('cryptoInstance', 'readwrite');
		const cryptoInstanceStore = transaction.objectStore('cryptoInstance');
		const request = cryptoInstanceStore.put(object, uid);
		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request);
		});
	};

	return {
		initialize,
		getCryptoInstance,
		saveCryptoInstance,
	}
})();

export default IndexedDB;
