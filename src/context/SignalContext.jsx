import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "../utils/firebase";
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

export const SignalContext = createContext();

export const SignalProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [sentOffers, setSentOffers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const signalsRef = collection(db, 'signals');
    const unsubSignals = onSnapshot(signalsRef, (querySnapshot) => {
      const signalIds = [];
      querySnapshot.forEach((doc) => {
        signalIds.push(doc.id);
      });
      setUsers(signalIds);
    });

    return () => unsubSignals();
  }, []);

  useEffect(() => {

    if (!currentUser) return;

    const signalRef = doc(db, 'signals', currentUser.email);

    (async () => {
      const signalSnap = await getDoc(signalRef);

      if (!signalSnap.exists()) {
        (async () => {
          const docRef = doc(db, 'signals', currentUser.email);
          await setDoc(docRef, {
            timestamp: Date.now(),
            offers: [],
            answers: [],
          });
        })();
      }
    })();

    const unsubSignal = onSnapshot(signalRef, (doc) => {

      if (!doc.exists()) return;

      const signal = doc.data();
      // Handle answers and offers array
    });

    return () => unsubSignal();
  }, [currentUser]);

  return (
    <SignalContext.Provider
      value={{
        users
      }}
    >
      {children}
    </SignalContext.Provider>
  );
};