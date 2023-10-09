import React, { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "./context/AuthContext";
import { CryptoKeyContext } from "./context/CryptoKeyContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { 
  doc,
  getDocs,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import icon from "./assets/icon.png";
import loader from "./assets/puff.svg";
import Signin from "./Signin";
import Signup from "./Signup";
import Home from "./Home";
import IndexedDB from "./indexedDB";

const App = () => {
  const { currentUser, isUserLoading } = useContext(AuthContext);
  const { keyInstance } = useContext(CryptoKeyContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {

    if (!currentUser) return;
    getUsers();
  }, [currentUser]);

  const getUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = [];
    usersSnapshot.docs.forEach(userDoc => users.push(userDoc.data()));
    setUsers(users);
  };

  useEffect(() => {

    if (!isUserLoading && !currentUser) {
      (async () => IndexedDB.clear())();
    }
  }, [isUserLoading]);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  const isAppLoading = useMemo(() => {
    return (
      isUserLoading || currentUser && (users.length === 0 || !keyInstance)
    );
  }, [isUserLoading, users, keyInstance]);

  if (isAppLoading) {
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
