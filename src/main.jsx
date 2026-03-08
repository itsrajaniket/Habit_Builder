import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import './assets/tailwind.css';
import './assets/index.css';

// ─── Tiny hash-based router — no react-router needed ──────────
function Router() {
  const [page, setPage] = useState(() => window.location.hash);

  useEffect(() => {
    const handler = () => setPage(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const goBack = () => {
    window.location.hash = '';
  };

  if (page === '#privacy') return <PrivacyPolicy onBack={goBack} />;
  if (page === '#terms')   return <TermsOfService onBack={goBack} />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
