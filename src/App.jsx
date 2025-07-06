import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { CryptoKeyContext } from "./context/CryptoKeyContext";
import { Navigate, Route, Routes } from "react-router-dom";
import icon from "./assets/icon.png";
import loader from "./assets/puff.svg";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Home from "./pages/Home";

const App = () => {
  const { currentUser, isUserLoading } = useContext(AuthContext);
  const { keyInstance } = useContext(CryptoKeyContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  const isAppLoading = isUserLoading || currentUser && !keyInstance;

  if (isAppLoading) {
    return (
      <div className="bg-slate-100 min-h-screen flex justify-center items-center text-center flex-col">
        <div className="flex gap-4 items-center mb-8">
          <img src={icon} className="w-10" />
          <h1 className="font-black text-slate-700 text-2xl">End-to-End Encrypted Chat</h1>
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
            <Home />
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
