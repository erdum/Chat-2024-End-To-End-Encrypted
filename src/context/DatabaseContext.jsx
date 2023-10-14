import { createContext, useContext, useEffect, useState } from "react";
import { getDatabase, ref, set, push, onValue, off } from "firebase/database";
import { AuthContext } from "./AuthContext";
import { CryptoKeyContext } from "./CryptoKeyContext";
import IndexedDB from "../indexedDB";
import Crypto from "../crypto";

const database = getDatabase();

export const DatabaseContext = createContext();

export const addOrUpdateUser = async (uid, displayName, photoURL) => {
  const userRef = ref(database, 'users/' + uid);
  set(userRef, {
    uid,
    displayName,
    photoURL
  });
};

export const addOrUpdatePublicKey = async (uid, publicKey) => {
  const publicKeyRef = ref(database, 'publicKeys/' + uid);
  set(publicKeyRef, publicKey);
};

export const DatabaseContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [publicKeys, setPublicKeys] = useState({});
  const [ciphers, setCiphers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { keyInstance } = useContext(CryptoKeyContext);

  useEffect(() => {
    const usersRef = ref(database, 'users/');
    const unsubUsers = onValue(usersRef, snapshot => setUsers(Object.values(snapshot.val())));

    const publicKeysRef = ref(database, 'publicKeys/');
    const unsubPublicKeys = onValue(publicKeysRef, snapshot => setPublicKeys(snapshot.val()));

    return () => {
      unsubUsers();
      unsubPublicKeys();
    };
  }, []);

  useEffect(() => {

    if (!currentUser) return;
    const ciphersRef = ref(database, 'ciphers/' + currentUser.uid);
    const unsubCiphers = onValue(ciphersRef, snapshot => setCiphers(Object.values(snapshot.val() ?? {})));

    return () => unsubCiphers();
  }, [currentUser]);

  const sendCipher = async (uid, receiverUid, payload) => {
    const cipher = await Crypto.encodeCipher(
      JSON.stringify(payload),
      publicKeys[receiverUid],
      keyInstance.privateKey
    );

    const receiverRef = ref(database, 'ciphers/' + receiverUid);
    push(receiverRef, cipher);
  }

  const removeDecodedCiphers = async (uid, unsuccessfulCiphers) => {
    const ciphersRef = ref(database, 'ciphers/' + uid);
    set(ciphersRef, null);
  }

  return (
    <DatabaseContext.Provider value={{ users, publicKeys, ciphers, sendCipher, removeDecodedCiphers }}>
      {children}
    </DatabaseContext.Provider>
  );
};
