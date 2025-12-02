import React from 'react';
import ReactDOM from 'react-dom/client';
import './setupLogger';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerServiceWorker } from './utils/registerServiceWorker';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </React.StrictMode>
);

// Registrar Service Worker em produção
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}
