import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// ConfiguraÃ§Ã£o do Firebase - COMUNIDADE RESGATE (CRA)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDW73K6vb7RMdyfsJ6JVzzm1r3sULs4ceY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "comunidaderesgate-82655.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "comunidaderesgate-82655",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "comunidaderesgate-82655.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "587928941365",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:587928941365:web:b788b8c9acf0a20992d27c",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-485FKRFYHE"
};

// Debug: mostrar configuraÃ§Ã£o
console.log('ðŸ”¥ Firebase Config - Comunidade Resgate (CRA):', {
  apiKey: firebaseConfig.apiKey ? 'âœ… Configurado' : 'âŒ NÃ£o configurado',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId ? 'âœ… Configurado' : 'âŒ NÃ£o configurado',
  measurementId: firebaseConfig.measurementId,
  env: process.env.NODE_ENV
});

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviÃ§os
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Inicializar Analytics de forma condicional e segura
// Evita erros 404 quando o Analytics nÃ£o estÃ¡ configurado no Firebase Console
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  // Verificar se o Analytics Ã© suportado e inicializar apenas se estiver disponÃ­vel
  isSupported()
    .then((supported) => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
          console.log('âœ… Firebase Analytics inicializado');
        } catch (error) {
          console.warn('âš ï¸ Firebase Analytics nÃ£o pÃ´de ser inicializado:', error);
        }
      } else {
        console.warn('âš ï¸ Firebase Analytics nÃ£o Ã© suportado neste ambiente');
      }
    })
    .catch((error) => {
      console.warn('âš ï¸ Erro ao verificar suporte do Firebase Analytics:', error);
    });
}

export { analytics };

export default app;
