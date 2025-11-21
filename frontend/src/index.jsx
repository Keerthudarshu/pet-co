import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';
import './styles/index.css';

// Global hook used by ErrorBoundary to report caught errors.
// ErrorBoundary calls `window.__COMPONENT_ERROR__` when it captures an error.
// This helper logs details to console and shows a small alert to aid debugging.
window.__COMPONENT_ERROR__ = (error, errorInfo) => {
  // Be conservative in what we do here — just log and show a minimal alert.
  // Remove or silence this in production.
  // eslint-disable-next-line no-console
  console.error('Component error caught by ErrorBoundary:', error, errorInfo);
  try {
    // Friendly alert for local debugging only
    // eslint-disable-next-line no-alert
    alert('A component error occurred — check the console for details.');
  } catch (e) {}
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <App />
);