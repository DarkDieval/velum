import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import './App.css';

const Home = () => {
  const { isAuthenticated, user, signout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin');

  const openModal = (mode: 'signin' | 'signup') => {
    setModalMode(mode);
    setModalOpen(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/velum-logo-1.png" alt="Velum" className="app-logo-image" />
        <h1 className="app-logo">VELUM</h1>
        <p className="app-tagline">Zero-Knowledge Password Manager</p>

        {isAuthenticated ? (
          <div className="auth-state">
            <p className="welcome-text">Bienvenido, {user?.name}</p>
            <button className="btn-secondary" onClick={signout}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="auth-actions">
            <button className="btn-primary" onClick={() => openModal('signup')}>
              Crear cuenta
            </button>
            <button className="btn-secondary" onClick={() => openModal('signin')}>
              Iniciar sesión
            </button>
          </div>
        )}
      </header>

      <AuthModal
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