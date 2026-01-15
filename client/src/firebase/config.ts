import { getApps, getApp, initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Configuração do Firebase - usar apenas variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validar configuração obrigatória
const requiredConfig: (keyof typeof firebaseConfig)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
let missingConfig = requiredConfig.filter(key => !firebaseConfig[key]);

if (missingConfig.length > 0) {
  // Observação: Firebase config NÃO é segredo. Em produção no Firebase Hosting,
  // variáveis REACT_APP_* precisam estar embutidas no build. Se não estiverem,
  // usamos fallback para evitar tela branca.
  firebaseConfig.apiKey = firebaseConfig.apiKey || 'AIzaSyDW73K6vb7RMdyfsJ6JVzzm1r3sULs4ceY';
  firebaseConfig.authDomain = firebaseConfig.authDomain || 'comunidaderesgate-82655.firebaseapp.com';
  firebaseConfig.projectId = firebaseConfig.projectId || 'comunidaderesgate-82655';
  firebaseConfig.storageBucket = firebaseConfig.storageBucket || 'comunidaderesgate-82655.firebasestorage.app';
  firebaseConfig.messagingSenderId = firebaseConfig.messagingSenderId || '587928941365';
  firebaseConfig.appId = firebaseConfig.appId || '1:587928941365:web:b788b8c9acf0a20992d27c';
  firebaseConfig.measurementId = firebaseConfig.measurementId || 'G-485FKRFYHE';
  missingConfig = requiredConfig.filter(key => !firebaseConfig[key]);

  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Firebase Config - Variáveis obrigatórias ausentes via env. Usando fallback:', missingConfig);
  }
}

if (missingConfig.length > 0) {
  console.error('❌ Firebase Config - Variáveis obrigatórias não configuradas:', missingConfig);
  // Não derrubar a UI em produção com tela branca por um problema de configuração.
  // Se ainda faltou algo até aqui, continuaremos e os serviços podem falhar de forma explícita.
}

export const firebaseConfigStatus = {
  ok: missingConfig.length === 0,
  missing: missingConfig,
};

// Debug: mostrar configuração (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Não configurado',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId ? '✅ Configurado' : '❌ Não configurado',
    measurementId: firebaseConfig.measurementId,
    env: process.env.NODE_ENV
  });
}

// Inicializar Firebase (singleton para evitar problemas no hot-reload)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Exportar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Persistência do Auth (web)
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Ignorar falhas de persistência; o Auth ainda funciona em memória
  });
}

// Inicializar Analytics de forma condicional e segura
// Evita erros 404 quando o Analytics nÃ£o estÃ¡ configurado no Firebase Console
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  // Verificar se o Analytics Ã© suportado e inicializar apenas se estiver disponÃ­vel
  isSupported()
    .then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Firebase Analytics inicializado');
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Firebase Analytics não pôde ser inicializado:', error);
          }
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Firebase Analytics não foi inicializado (não suportado ou measurementId ausente)');
      }
    })
    .catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Erro ao verificar suporte do Firebase Analytics:', error);
      }
    });
}

export { analytics };

export default app;
