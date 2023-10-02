import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Crypto from "../crypto";

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
    // Sync user public-key with the server
    (async function () {
    
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const exportedPublicKey = await Crypto.exportPublicKey(currentUser.uid);

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
