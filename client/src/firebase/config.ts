import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase - COMUNIDADE RESGATE (CRA)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDW73K6vb7RMdyfsJ6JVzzm1r3sULs4ceY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "comunidaderesgate-82655.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "comunidaderesgate-82655",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "comunidaderesgate-82655.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "587928941365",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:587928941365:web:b788b8c9acf0a20992d27c",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-485FKRFYHE"
};

// Debug: mostrar configuração
console.log('🔥 Firebase Config - Comunidade Resgate (CRA):', {
  apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Não configurado',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId ? '✅ Configurado' : '❌ Não configurado',
  measurementId: firebaseConfig.measurementId,
  env: process.env.NODE_ENV
});

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);

export default app;