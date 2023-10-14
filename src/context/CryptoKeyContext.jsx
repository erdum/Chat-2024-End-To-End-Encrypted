import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { addOrUpdatePublicKey } from "./DatabaseContext";
import IndexedDB from "../indexedDB";
import Crypto from "../crypto";

export const CryptoKeyContext = createContext();

export const CryptoKeyProvider = ({ children }) => {
  const [keyInstance, setKeyInstance] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {

    if (!currentUser) return;
    (async () => {
      getOrGenerateKeyInstance(currentUser.uid);
    })();
  }, [currentUser]);

  const getOrGenerateKeyInstance = async (uid) => {
    const localKeyInstance = await IndexedDB.getKeyInstance(uid);

    if (localKeyInstance === null) {
      const newKeyInstance = await Crypto.generateKeyPairInstance();
      const exportedPublicKey = await Crypto.exportPublicKey(
        newKeyInstance.publicKey
      );
      await IndexedDB.saveKeyInstance(newKeyInstance, uid);

      await addOrUpdatePublicKey(uid, exportedPublicKey);
      
      setKeyInstance(newKeyInstance);
    } else {
      const exportedPublicKey = await Crypto.exportPublicKey(
        localKeyInstance.publicKey
      );

      await addOrUpdatePublicKey(uid, exportedPublicKey);
      
      setKeyInstance(localKeyInstance);
    }
  };

  return (
    <CryptoKeyContext.Provider value={{ keyInstance }}>
      {children}
    </CryptoKeyContext.Provider>
  );
};
