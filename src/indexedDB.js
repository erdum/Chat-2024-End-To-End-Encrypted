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

  const getKeyInstance = async (uid) => {
    const db = await initialize();
    const transaction = db.transaction('cryptoInstance', 'readonly');
    const cryptoInstanceStore = transaction.objectStore('cryptoInstance');
    const request = cryptoInstanceStore.get(uid);
    db.close();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result ?? null);
    });
  };

  const saveKeyInstance = async (object, uid) => {
    const db = await initialize();
    const transaction = db.transaction('cryptoInstance', 'readwrite');
    const cryptoInstanceStore = transaction.objectStore('cryptoInstance');
    const request = cryptoInstanceStore.put(object, uid);
    db.close();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request);
    });
  };

  const clearInstances = async (db) => {
    const transaction = db.transaction('cryptoInstance', 'readwrite');
    const cryptoInstanceStore = transaction.objectStore('cryptoInstance');
    cryptoInstanceStore.clear();
  };

  const saveMessages = async (messages, uid) => {
    const db = await initialize();
    const transaction = db.transaction('messages', 'readwrite');
    const messagesStore = transaction.objectStore('messages');
    const request = messagesStore.put(messages, uid);
    db.close();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request);
    });
  };

  const getMessages = async (uid) => {
    const db = await initialize();
    const transaction = db.transaction('messages', 'readonly');
    const messagesStore = transaction.objectStore('messages');
    const request = messagesStore.get(uid);
    db.close();
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

  const clearOnlyMessages = async () => {
    const db = await initialize();
    clearMessages(db);
    db.close();
  }

  return {
    initialize,
    getKeyInstance,
    saveKeyInstance,
    saveMessages,
    getMessages,
    clearOnlyMessages,
    clear,
  }
})();

export default IndexedDB;
