import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';

/**
 * Hook que forÃ§a recarregamento de dados quando:
 * - A rota muda
 * - O usuÃ¡rio autentica
 * - A pÃ¡gina ganha foco apÃ³s estar inativa
 */
export const useDataReload = (reloadCallback: () => void) => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const previousPathnameRef = useRef<string>(location.pathname);
  const previousUserRef = useRef<any>(user);
  const isFirstMountRef = useRef(true);
  const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ForÃ§a recarregamento quando rota muda
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      previousPathnameRef.current = location.pathname;
      previousUserRef.current = user;
      return;
    }

    // Se a rota mudou
    if (previousPathnameRef.current !== location.pathname) {
      previousPathnameRef.current = location.pathname;
      
      // Aguardar auth terminar antes de recarregar
      if (!authLoading) {
        // Pequeno delay para garantir que a nova rota foi renderizada
        reloadTimeoutRef.current = setTimeout(() => {
          console.log('ðŸ”„ Recarregando dados - rota mudou:', location.pathname);
          reloadCallback();
        }, 150);
      }
    }

    // Se o usuÃ¡rio mudou (login/logout)
    if (previousUserRef.current !== user && !authLoading) {
      previousUserRef.current = user;
      reloadTimeoutRef.current = setTimeout(() => {
        console.log('ðŸ”„ Recarregando dados - usuÃ¡rio mudou');
        reloadCallback();
      }, 150);
    }

    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, [location.pathname, user, authLoading, reloadCallback]);

  // Recarregar quando a pÃ¡gina ganha foco (se estava inativa por mais de 1 minuto)
  useEffect(() => {
    let lastFocusTime = Date.now();

    const handleFocus = () => {
      const now = Date.now();
      const timeSinceLastFocus = now - lastFocusTime;
      
      // Se passou mais de 1 minuto desde a Ãºltima vez que teve foco, recarregar
      if (timeSinceLastFocus > 60000 && !authLoading) {
        console.log('ðŸ”„ Recarregando dados - pÃ¡gina voltou ao foco apÃ³s', Math.round(timeSinceLastFocus / 1000), 'segundos');
        reloadCallback();
      }
      
      lastFocusTime = now;
    };

    const handleBlur = () => {
      lastFocusTime = Date.now();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [reloadCallback, authLoading]);

  // Limpar cache de dados antigos ao montar
  useEffect(() => {
    try {
      const cacheKeys = [
        'dashboard_cache',
        'transactions_cache',
        'members_cache',
        'categories_cache',
      ];

      const now = Date.now();
      const MAX_CACHE_AGE = 300000; // 5 minutos

      cacheKeys.forEach(key => {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.lastFetch && (now - parsed.lastFetch) > MAX_CACHE_AGE) {
              sessionStorage.removeItem(key);
              console.log('ðŸ§¹ Cache antigo removido:', key);
            }
          } catch (e) {
            // Se nÃ£o conseguir parsear, remove
            sessionStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Erro ao limpar cache:', error);
    }
  }, []);
};

