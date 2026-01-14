import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

interface AppUpdateCheckerProps {
  checkInterval?: number; // Intervalo em minutos para verificar atualizaÃ§Ãµes
}

/**
 * Componente que verifica e notifica sobre atualizaÃ§Ãµes do aplicativo
 * Como o app estÃ¡ configurado para carregar do servidor remoto,
 * as atualizaÃ§Ãµes sÃ£o automÃ¡ticas - este componente apenas informa o usuÃ¡rio
 */
const AppUpdateChecker: React.FC<AppUpdateCheckerProps> = ({ 
  checkInterval = 5 
}) => {
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [lastUpdateCheck, setLastUpdateCheck] = useState<Date | null>(null);

  useEffect(() => {
    // Verificar se estÃ¡ rodando no app nativo
    const platform = Capacitor.getPlatform();
    setIsNativeApp(platform === 'android' || platform === 'ios');

    if (isNativeApp) {
      // Verificar atualizaÃ§Ãµes periodicamente
      const interval = setInterval(() => {
        checkForUpdates();
      }, checkInterval * 60 * 1000); // Converter minutos para milissegundos

      // Verificar imediatamente ao montar
      checkForUpdates();

      return () => clearInterval(interval);
    }
  }, [isNativeApp, checkInterval]);

  const checkForUpdates = async () => {
    try {
      // Como o app carrega do servidor remoto, uma simples recarga jÃ¡ traz atualizaÃ§Ãµes
      // Mas vamos verificar se hÃ¡ uma nova versÃ£o disponÃ­vel
      const response = await fetch('https://comunidaderesgate-82655.web.app/manifest.json', {
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const manifest = await response.json();
        setLastUpdateCheck(new Date());
        
        // Se necessÃ¡rio, podemos comparar versÃµes aqui
        // Por enquanto, apenas registramos que verificamos
        console.log('âœ… VerificaÃ§Ã£o de atualizaÃ§Ã£o concluÃ­da', {
          timestamp: new Date().toISOString(),
          platform: Capacitor.getPlatform()
        });
      }
    } catch (error) {
      console.warn('âš ï¸ Erro ao verificar atualizaÃ§Ãµes:', error);
    }
  };

  const handleAppStateChange = async () => {
    // Quando o app volta para o primeiro plano, verificar atualizaÃ§Ãµes
    if (isNativeApp) {
      await checkForUpdates();
    }
  };

  useEffect(() => {
    if (isNativeApp) {
      // Escutar mudanÃ§as de estado do app
      let listenerPromise: Promise<any>;
      
      App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          handleAppStateChange();
        }
      }).then((listener) => {
        listenerPromise = Promise.resolve(listener);
      });

      return () => {
        if (listenerPromise) {
          listenerPromise.then((listener) => {
            listener.remove();
          }).catch(() => {
            // Ignorar erros ao remover listener
          });
        }
      };
    }
  }, [isNativeApp]);

  // Este componente nÃ£o renderiza nada visualmente
  // Ele apenas executa verificaÃ§Ãµes em background
  return null;
};

export default AppUpdateChecker;
