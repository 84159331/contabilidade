// Firebase Cloud Messaging utilities
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { db } from '../firebase/config';

// VAPID key - vocÃª precisa gerar isso no Firebase Console
// Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
const VAPID_KEY = 'YOUR_VAPID_KEY_HERE'; // Substitua pela sua chave VAPID

let messaging: any = null;

// Inicializar messaging
export const initializeMessaging = async () => {
  if (typeof window === 'undefined') return null;

  // Verificar se o navegador suporta Service Worker
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker nÃ£o suportado');
    return null;
  }

  // Verificar se o navegador suporta notificaÃ§Ãµes
  if (!('Notification' in window)) {
    console.warn('NotificaÃ§Ãµes nÃ£o suportadas');
    return null;
  }

  try {
    // Firebase jÃ¡ estÃ¡ inicializado via config.ts
    // Apenas obter instÃ¢ncia do messaging

    // Obter instÃ¢ncia do messaging
    const { getMessaging } = await import('firebase/messaging');
    messaging = getMessaging();

    return messaging;
  } catch (error) {
    console.error('Erro ao inicializar messaging:', error);
    return null;
  }
};

// Solicitar permissÃ£o de notificaÃ§Ãµes
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      await initializeMessaging();
    }

    if (!messaging) {
      console.warn('Messaging nÃ£o disponÃ­vel');
      return null;
    }

    // Solicitar permissÃ£o
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('âœ… PermissÃ£o de notificaÃ§Ã£o concedida');
      
      // Obter token FCM
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });

      if (token) {
        console.log('âœ… Token FCM obtido:', token);
        
        // Salvar token no Firestore
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          const db = getFirestore();
          await updateDoc(doc(db, 'members', user.uid), {
            fcm_token: token,
            fcm_token_updated_at: new Date(),
          });
          console.log('âœ… Token salvo no Firestore');
        }
        
        return token;
      } else {
        console.warn('âš ï¸ Token FCM nÃ£o disponÃ­vel');
        return null;
      }
    } else {
      console.warn('âš ï¸ PermissÃ£o de notificaÃ§Ã£o negada');
      return null;
    }
  } catch (error) {
    console.error('âŒ Erro ao solicitar permissÃ£o:', error);
    return null;
  }
};

// Escutar mensagens quando o app estÃ¡ em primeiro plano
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
    console.log('ðŸ“¨ Mensagem recebida:', payload);
    
    // Mostrar notificaÃ§Ã£o
    if (payload.notification) {
      const notificationTitle = payload.notification.title || 'Nova notificaÃ§Ã£o';
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

// Verificar se jÃ¡ tem permissÃ£o
export const checkNotificationPermission = (): boolean => {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
};

// Verificar se jÃ¡ tem token salvo
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
