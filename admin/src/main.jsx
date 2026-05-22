import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import SecretPathGate from './SecretPathGate';
import './styles/admin.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SecretPathGate>
      <App />
    </SecretPathGate>
  </StrictMode>
);
