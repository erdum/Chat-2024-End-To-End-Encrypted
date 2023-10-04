import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import Crypto from "../crypto";
import IndexedDB from "../indexedDB";

export const AuthContext = createContext();

const syncPublicKeyToRemote = async (uid, publicKey) => {
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists() || !userDocSnap.data().publicKey || publicKey != userDocSnap.data().publicKey) {
    await updateDoc(userDocRef, {
      publicKey,
    });
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportedPublicKey, setExportedPublicKey] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Session gone clear IndexedDB
      if (user === null) {
        const indexedDB = await IndexedDB.initialize();
        IndexedDB.clearInstances(indexedDB);
      } else {
        // Load previous key or generate a new one and save
        (async function () {
          const indexedDB = await IndexedDB.initialize();
          const localKeyPairInstance = await IndexedDB.getCryptoInstance(indexedDB, user.uid);

          if (localKeyPairInstance === null) {
            const newKeyPairInstance = await Crypto.generateKeyPairInstance();
            await IndexedDB.saveCryptoInstance(indexedDB, structuredClone(newKeyPairInstance), user.uid);
            const publicKey = await Crypto.exportPublicKey(newKeyPairInstance.publicKey);
            setExportedPublicKey(publicKey);
            user.keyInstance = newKeyPairInstance;
          } else {
            const publicKey = await Crypto.exportPublicKey(localKeyPairInstance.publicKey);
            setExportedPublicKey(publicKey);
            user.keyInstance = localKeyPairInstance;
          }
        })();
      }

      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {

    if (exportedPublicKey) {
      syncPublicKeyToRemote(currentUser.uid, exportedPublicKey);
    }
  }, [exportedPublicKey]);

  useEffect(() => {

    if (currentUser) {
      (async () => {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const ciphers = userDocSnap.data().unreadCiphers ?? [];

        const unreadMessages = await Crypto.decodeAllCiphers(ciphers, currentUser.keyInstance.privateKey);
        const indexedDB = await IndexedDB.initialize();
        const seenMessages = await IndexedDB.getMessages(indexedDB, currentUser.uid);

        setMessages([...seenMessages, ...unreadMessages]);

        if (unreadMessages.length > 0) {
          await IndexedDB.saveMessages(indexedDB, unreadMessages, currentUser.uid);
          await updateDoc(userDocRef, {
            unreadCiphers: arrayRemove(...ciphers)
          });
        }
      })();
    }
  }, [currentUser]);

  useEffect(() => console.log(messages), [messages]);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
