import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Crypto from "../crypto";
import IndexedDB from "../indexedDB";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Sync user public-key with the server and IndexedDB
    (async function () {
    
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        // Try to get keyPair from IndexedDB
        const db = await IndexedDB.initialize();
        const localKeyPairInstance = await IndexedDB.getCryptoInstance(db, uid);

        if (localKeyPairInstance === null) {
          // Session gone generate new keyPair
          const newKeyPairInstance = await Crypto.generateKeyPairInstance();
          // Save newKeyPair to IndexedDB
          await IndexedDB.saveCryptoInstance(db, structuredClone(newKeyPairInstance), currentUser.uid);
          const exportedPublicKey = await Crypto.exportPublicKey(newKeyPairInstance.publicKey);
        } else {
          const exportedPublicKey = await Crypto.exportPublicKey(localKeyPairInstance.publicKey);
        }

        if (!userDocSnap.exists() || !userDocSnap.data().publicKey || exportedPublicKey != userDocSnap.data().publicKey) {
          await updateDoc(userDocRef, {
            publicKey: exportedPublicKey,
          });
        }
      }
    })();
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
