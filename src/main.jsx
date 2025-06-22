import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { CryptoKeyProvider } from "./context/CryptoKeyContext";
import { DatabaseContextProvider } from "./context/DatabaseContext";
import { WebRTCContextProvider } from "./context/WebRTCContext";
import { IndexedDBProvider } from "./context/IndexedDBContext";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    {/*<AuthProvider>*/}
      <IndexedDBProvider>
      {/*<CryptoKeyProvider>*/}
        {/*<DatabaseContextProvider>*/}
          {/*<WebRTCContextProvider>*/}
            <App />
          {/*</WebRTCContextProvider>*/}
        {/*</DatabaseContextProvider>*/}
      {/*</CryptoKeyProvider>*/}
      </IndexedDBProvider>
    {/*</AuthProvider>*/}
  </Router>
);
