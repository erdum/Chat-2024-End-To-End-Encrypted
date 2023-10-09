import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import IndexedDB from "../indexedDB";
import Crypto from "../crypto";

export const CryptoKeyContext = createContext();

export const CryptoKeyProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [keyInstance, setKeyInstance] = useState(null);

  const getOrGenerateKeyInstance = async (uid) => {
    const localKeyInstance = await IndexedDB.getKeyInstance(uid);

    if (localKeyInstance === null) {
      const newKeyInstance = await Crypto.generateKeyPairInstance();
      const exportedPublicKey = await Crypto.exportPublicKey(
        newKeyInstance.publicKey
      );
      await IndexedDB.saveKeyInstance(newKeyInstance, uid);
      
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, {
        publicKey: exportedPublicKey
      });
      
      setKeyInstance(newKeyInstance);
    } else {
      const exportedPublicKey = await Crypto.exportPublicKey(
        localKeyInstance.publicKey
      );

      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, {
        publicKey: exportedPublicKey
      });
      
      setKeyInstance(localKeyInstance);
    }
  };

  useEffect(() => {

    if (!currentUser) return;
    (async () => {
      getOrGenerateKeyInstance(currentUser.uid);
    })();
  }, [currentUser]);

  return (
    <CryptoKeyContext.Provider value={{ keyInstance }}>
      {children}
    </CryptoKeyContext.Provider>
  );
};
