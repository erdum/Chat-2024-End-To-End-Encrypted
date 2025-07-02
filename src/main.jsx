import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { CryptoKeyProvider } from "./context/CryptoKeyContext";
import { DatabaseContextProvider } from "./context/DatabaseContext";
import { WebRTCContextProvider } from "./context/WebRTCContext";
import { IndexedDBProvider } from "./context/IndexedDBContext";
import { SignalProvider } from "./context/SignalContext";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <IndexedDBProvider>
      <AuthProvider>
        <CryptoKeyProvider>
          <WebRTCContextProvider>
            <SignalProvider>
              {/*<DatabaseContextProvider>*/}
                <App />
              {/*</DatabaseContextProvider>*/}
            </SignalProvider>
          </WebRTCContextProvider>
        </CryptoKeyProvider>
      </AuthProvider>
    </IndexedDBProvider>
  </Router>
);
