import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { 
  doc,
  getDocs,
  getDoc,
  updateDoc,
  collection
} from "firebase/firestore";
import { db } from "./firebase";
import icon from "./assets/icon.png";
import loader from "./assets/puff.svg";
import Signin from "./Signin";
import Signup from "./Signup";
import Home from "./Home";
import IndexedDB from "./indexedDB";
import Crypto from "./crypto";

const App = () => {
  const { currentUser, isUserLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [keyInstance, setKeyInstance] = useState(null);

  useEffect(() => {

    if (isUserLoading) return;

    if (currentUser === null) {
      (async () => await IndexedDB.clear())();
      setLoading(false);
    } else {
      (async () => {
        await getUsers();
        await getOrGenerateKeyInstance();
        setLoading(false);
      })();
    }
  }, [isUserLoading, currentUser]);

  const getUsers = async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const usersData = usersSnapshot.docs.map((doc) => doc.data());
    setUsers(usersData);
  };

  const getOrGenerateKeyInstance = async () => {
    const localKeyInstance = await IndexedDB.getKeyInstance(currentUser.uid);

    if (localKeyInstance === null) {
      const newKeyInstance = await Crypto.generateKeyPairInstance();
      const exportedPublicKey = await Crypto.exportPublicKey(
        newKeyInstance.publicKey
      );
      await IndexedDB.saveKeyInstance(newKeyInstance, currentUser.uid);
      
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        publicKey: exportedPublicKey
      });
      
      setKeyInstance(newKeyInstance);
    } else {
      const exportedPublicKey = await Crypto.exportPublicKey(
        localKeyInstance.publicKey
      );

      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        publicKey: exportedPublicKey
      });
      
      setKeyInstance(localKeyInstance);
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  if (loading) {
    return (
      <div className="bg-slate-100 min-h-screen flex justify-center items-center text-center flex-col">
        <div className="flex gap-4 items-center mb-8">
          <img src={icon} className="w-10" />
          <h1 className="font-black text-slate-700 text-2xl">De-Centralize Chat</h1>
        </div>
        <img src={loader} alt="Loader" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home users={users} />
          </ProtectedRoute>
        }
      />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
