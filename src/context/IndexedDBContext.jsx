import { createContext, useEffect, useState } from "react";

export const IndexedDBContext = createContext();

export const IndexedDBProvider = ({ children }) => {
  const [db, setDb] = useState(null);

  useState(() => {
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

  const clearDB = () => {
    db.transaction("cryptoKeyInstances", "readwrite");
    db.transaction("chats", "readwrite");
  };

  return (
    <IndexedDBContext.Provider value={{ db }}>
      {children}
    </IndexedDBContext.Provider>
  );
};
