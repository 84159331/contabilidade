// Firebase Cloud Messaging utilities
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { db } from '../firebase/config';

// VAPID key - você precisa gerar isso no Firebase Console
// Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
const VAPID_KEY = 'YOUR_VAPID_KEY_HERE'; // Substitua pela sua chave VAPID

let messaging: any = null;

// Inicializar messaging
export const initializeMessaging = async () => {
  if (typeof window === 'undefined') return null;

  // Verificar se o navegador suporta Service Worker
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker não suportado');
    return null;
  }

  // Verificar se o navegador suporta notificações
  if (!('Notification' in window)) {
    console.warn('Notificações não suportadas');
    return null;
  }

  try {
    // Firebase já está inicializado via config.ts
    // Apenas obter instância do messaging

    // Obter instância do messaging
    const { getMessaging } = await import('firebase/messaging');
    messaging = getMessaging();

    return messaging;
  } catch (error) {
    console.error('Erro ao inicializar messaging:', error);
    return null;
  }
};

// Solicitar permissão de notificações
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      await initializeMessaging();
    }

    if (!messaging) {
      console.warn('Messaging não disponível');
      return null;
    }

    // Solicitar permissão
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Permissão de notificação concedida');
      
      // Obter token FCM
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });

      if (token) {
        console.log('✅ Token FCM obtido:', token);
        
        // Salvar token no Firestore
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          const db = getFirestore();
          await updateDoc(doc(db, 'members', user.uid), {
            fcm_token: token,
            fcm_token_updated_at: new Date(),
          });
          console.log('✅ Token salvo no Firestore');
        }
        
        return token;
      } else {
        console.warn('⚠️ Token FCM não disponível');
        return null;
      }
    } else {
      console.warn('⚠️ Permissão de notificação negada');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao solicitar permissão:', error);
    return null;
  }
};

// Escutar mensagens quando o app está em primeiro plano
export const setupMessageListener = () => {
  if (!messaging) {
    initializeMessaging().then(() => {
      if (messaging) {
        setupListener();
      }
    });
    return;
  }

  setupListener();
};

const setupListener = () => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log('📨 Mensagem recebida:', payload);
    
    // Mostrar notificação
    if (payload.notification) {
      const notificationTitle = payload.notification.title || 'Nova notificação';
      const notificationOptions = {
        body: payload.notification.body || '',
        icon: '/img/icons/icon-192x192.png',
        badge: '/img/icons/icon-72x72.png',
        tag: payload.data?.escala_id || 'notification',
        requireInteraction: false,
      };

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(notificationTitle, notificationOptions);
        });
      } else {
        new Notification(notificationTitle, notificationOptions);
      }
    }
  });
};

// Verificar se já tem permissão
export const checkNotificationPermission = (): boolean => {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
};

// Verificar se já tem token salvo
export const getStoredToken = async (): Promise<string | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return null;

    const db = getFirestore();
    const userDoc = await import('firebase/firestore').then(m => 
      m.getDoc(m.doc(db, 'members', user.uid))
    );
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.fcm_token || null;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao obter token armazenado:', error);
    return null;
  }
};
