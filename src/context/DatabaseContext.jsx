import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { CryptoKeyContext } from "./CryptoKeyContext";
import Crypto from "../crypto";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

export const DatabaseContext = createContext();

export const addOrUpdateUser = async (uid, displayName, photoURL) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      uid,
      displayName,
      photoURL
    });
  } else {
    await setDoc(docRef, {
      uid,
      displayName,
      photoURL
    });
  }
};

export const addOrUpdatePublicKey = async (uid, publicKey) => {
  const docRef = doc(db, 'publicKeys', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, publicKey);
  } else {
    await setDoc(docRef, publicKey);
  }
};

export const DatabaseContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [publicKeys, setPublicKeys] = useState({});
  const [ciphers, setCiphers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { keyInstance } = useContext(CryptoKeyContext);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsubUsers = onSnapshot(usersRef, (querySnapshot) => {
      const newUsers = [];
      querySnapshot.forEach((doc) => {
        newUsers.push(doc.data());
      });
      setUsers(newUsers);
    });

    const publicKeysRef = collection(db, 'publicKeys');
    const unsubPublicKeys = onSnapshot(publicKeysRef, (querySnapshot) => {
      const newPublicKeys = {};
      querySnapshot.forEach((doc) => {
        newPublicKeys[doc.id] = doc.data();
      });
      setPublicKeys(newPublicKeys);
    });

    return () => {
      unsubUsers();
      unsubPublicKeys();
    };
  }, []);

  useEffect(() => {

    if (!currentUser) return;
    const ciphersRef = doc(db, 'ciphers', currentUser.uid);
    const unsubCiphers = onSnapshot(ciphersRef, (doc) => {
      const data = doc.data();
      if (data?.ciphers) setCiphers(data.ciphers);
    });

    return () => unsubCiphers();
  }, [currentUser]);

  const sendCipher = async (uid, receiverUid, payload) => {
    const cipher = await Crypto.encodeCipher(
      JSON.stringify(payload),
      publicKeys[receiverUid],
      keyInstance.privateKey
    );

    const docRef = doc(db, 'ciphers', receiverUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { ciphers: arrayUnion(cipher) });
    } else {
      await setDoc(docRef, { ciphers: arrayUnion(cipher) });
    }
  }

  const removeDecodedCiphers = async (uid, unsuccessfulCiphers) => {
    const docRef = doc(db, 'ciphers', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { ciphers: arrayRemove(...unsuccessfulCiphers) });
    }
  }

  return (
    <DatabaseContext.Provider value={{ users, publicKeys, ciphers, sendCipher, removeDecodedCiphers }}>
      {children}
    </DatabaseContext.Provider>
  );
};
