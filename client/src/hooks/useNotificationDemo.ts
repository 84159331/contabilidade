import { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

// Hook para demonstrar notificaÃ§Ãµes automÃ¡ticas
export const useNotificationDemo = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // NotificaÃ§Ã£o de boas-vindas
    const welcomeTimer = setTimeout(() => {
      addNotification({
        title: 'Bem-vindo ao Sistema de Tesouraria!',
        message: 'Seu dashboard estÃ¡ atualizado com as Ãºltimas informaÃ§Ãµes financeiras.',
        type: 'info',
        priority: 'medium',
        category: 'system',
        autoHide: true,
        duration: 5000
      });
    }, 2000);

    // NotificaÃ§Ã£o de meta atingida (exemplo)
    const goalTimer = setTimeout(() => {
      addNotification({
        title: 'ðŸŽ‰ Meta Atingida!',
        message: 'VocÃª alcanÃ§ou 80% da sua meta mensal de receitas!',
        type: 'achievement',
        priority: 'high',
        category: 'goals',
        action: {
          label: 'Ver Detalhes',
          onClick: () => console.log('Ver detalhes da meta')
        }
      });
    }, 8000);

    // NotificaÃ§Ã£o de transaÃ§Ã£o importante
    const transactionTimer = setTimeout(() => {
      addNotification({
        title: 'Nova TransaÃ§Ã£o Importante',
        message: 'Receita de R$ 5.000,00 registrada com sucesso.',
        type: 'success',
        priority: 'medium',
        category: 'financial',
        autoHide: true,
        duration: 4000
      });
    }, 12000);

    // NotificaÃ§Ã£o de alerta
    const alertTimer = setTimeout(() => {
      addNotification({
        title: 'Alerta de Saldo Baixo',
        message: 'Seu saldo atual estÃ¡ abaixo do recomendado. Considere revisar as despesas.',
        type: 'warning',
        priority: 'urgent',
        category: 'financial',
        persistent: true,
        action: {
          label: 'Revisar Despesas',
          onClick: () => console.log('Ir para despesas')
        }
      });
    }, 15000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(goalTimer);
      clearTimeout(transactionTimer);
      clearTimeout(alertTimer);
    };
  }, [addNotification]);
};

export default useNotificationDemo;
