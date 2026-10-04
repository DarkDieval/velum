import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { AuthModal } from "./components/AuthModal";
import { UnlockVaultModal } from "./components/UnlockVaultModal";
import { Dashboard } from "./components/Dashboard";
import "./App.css";

const Home = () => {
  const { isAuthenticated, isVaultLocked } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"signin" | "signup">("signin");
  const [modalKey, setModalKey] = useState(0);

  const openModal = (mode: "signin" | "signup") => {
    setModalMode(mode);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  if (isAuthenticated && isVaultLocked) {
    return <UnlockVaultModal isOpen={true} />;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/velum-logo-1.png" alt="Velum" className="app-logo-image" />
        <h1 className="app-logo">VELUM</h1>
        <p className="app-tagline">Zero-Knowledge Password Manager</p>

        <div className="auth-actions">
          <button className="btn-primary" onClick={() => openModal("signup")}>
            Crear cuenta
          </button>
          <button className="btn-secondary" onClick={() => openModal("signin")}>
            Iniciar sesión
          </button>
        </div>
      </header>

      <AuthModal
        key={modalKey}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMode={modalMode}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}

export default App;
