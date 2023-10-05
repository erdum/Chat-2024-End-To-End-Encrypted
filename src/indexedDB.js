const IndexedDB = (() => {
	const initialize = async () => {
		const request = window.indexedDB.open('dchat-store', 1);

		request.onupgradeneeded = ({ target: { result: db }}) => {
			db.createObjectStore('cryptoInstance');
			db.createObjectStore('messages');
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

	const clearInstances = async (db) => {
		const transaction = db.transaction('cryptoInstance', 'readwrite');
		const cryptoInstanceStore = transaction.objectStore('cryptoInstance');
		cryptoInstanceStore.clear();
	};

	const saveMessages = async (db, messages, uid) => {
		const transaction = db.transaction('messages', 'readwrite');
		const messagesStore = transaction.objectStore('messages');
		const request = messagesStore.put(messages, uid);
		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request);
		});
	};

	const getMessages = async (db, uid) => {
		const transaction = db.transaction('messages', 'readonly');
		const messagesStore = transaction.objectStore('messages');
		const request = messagesStore.get(uid);
		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request.result ?? []);
		});
	};

	const clearMessages = async (db) => {
		const transaction = db.transaction('messages', 'readwrite');
		const messagesStore = transaction.objectStore('messages');
		messagesStore.clear();
	};

	const clear = async () => {
		const db = await initialize();
		clearInstances(db);
		clearMessages(db);
		db.close();
	};

	return {
		initialize,
		getCryptoInstance,
		saveCryptoInstance,
		saveMessages,
		getMessages,
		clear,
	}
})();

export default IndexedDB;
