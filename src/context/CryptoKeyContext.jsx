import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { IndexedDBContext } from "./IndexedDBContext";
import Crypto from "../crypto";

export const CryptoKeyContext = createContext();

export const CryptoKeyProvider = ({ children }) => {
  const [keyInstance, setKeyInstance] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const {
    saveCryptoKeyInstance,
    getCryptoKeyInstance
  } = useContext(IndexedDBContext);

  useEffect(() => {

    if (!currentUser) return;

    (async () => {
      getOrGenerateKeyInstance(currentUser.email);
    })();
  }, [currentUser]);

  const getOrGenerateKeyInstance = async (email) => {
    const localKeyInstance = await getCryptoKeyInstance(email);

    if (localKeyInstance === null) {
      const newKeyInstance = await Crypto.generateKeyPairInstance();
      // const exportedPublicKey = await Crypto.exportPublicKey(
      //   newKeyInstance.publicKey
      // );
      await saveCryptoKeyInstance(newKeyInstance, email);
      setKeyInstance(newKeyInstance);
    } else {
      // const exportedPublicKey = await Crypto.exportPublicKey(
      //   localKeyInstance.publicKey
      // );
      setKeyInstance(localKeyInstance);
    }
  };

  return (
    <CryptoKeyContext.Provider value={{ keyInstance }}>
      {children}
    </CryptoKeyContext.Provider>
  );
};
