import { createContext, useEffect, useState } from "react";

export const IndexedDBContext = createContext();

export const IndexedDBProvider = ({ children }) => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const request = window.indexedDB.open("dchat-store", 1);
    request.onerror = (event) => {
      console.error(`Database error: ${event.target.error?.message}`);
    };
    request.onsuccess = (event) => {

      if (!db) setDb(event.target.result);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("cryptoKeyInstances");
      const chatStore = db.createObjectStore("chats", { keyPath: "email" });
      chatStore.createIndex("emailIdx", "email", { unique: true });

      setDb(db);
    }

    return () => db.close();
  }, []);

  const clearCryptoKeyInstanceStore = () => {
    const trx = db.transaction("cryptoKeyInstances", "readwrite");
    const store = trx.objectStore("cryptoKeyInstances");
    store.clear();
  };

  const clearChatStore = () => {
    const trx = db.transaction("chats", "readwrite");
    const store = trx.objectStore("chats");
    store.clear();
  };

  const clearDB = () => {
    clearCryptoKeyInstanceStore();
    clearChatStore();
  };

  const saveCryptoKeyInstance = async (email, cryptoKeyInstance) => {
    const trx = db.transaction("cryptoKeyInstances", "readwrite");
    const store = trx.objectStore("cryptoKeyInstances");
    const request = store.put(cryptoKeyInstance, email);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getCryptoKeyInstance = async (email) => {
    const trx = db.transaction("cryptoKeyInstances", "readonly");
    const store = trx.objectStore("cryptoKeyInstances");
    const request = store.get(email);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const saveChat = (email, chatObject) => {
    const trx = db.transaction("chats", "readwrite");
    const store = trx.objectStore("chats");
    const request = store.put(chatObject, email);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getChat = (email) => {
    const trx = db.transaction("chats", "readonly");
    const store = trx.objectStore("chats");
    const request = store.get(email);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getAllChats = () => {
    const trx = db.transaction("chats", "readonly");
    const store = trx.objectStore("chats");
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  return (
    <IndexedDBContext.Provider
      value={{
        clearDB,
        saveCryptoKeyInstance,
        getCryptoKeyInstance,
        saveChat,
        getChat,
        getAllChats
      }}
    >
      {children}
    </IndexedDBContext.Provider>
  );
};
