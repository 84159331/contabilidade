// Sistema de fila para aÃ§Ãµes offline

export interface QueuedAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: string;
  data: any;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'offline-actions-queue';
const MAX_RETRIES = 3;

export const offlineQueue = {
  // Adicionar aÃ§Ã£o Ã  fila
  add: (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>): string => {
    const queue = offlineQueue.getAll();
    const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const queuedAction: QueuedAction = {
      ...action,
      id,
      timestamp: Date.now(),
      retries: 0
    };

    queue.push(queuedAction);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    
    console.log('ðŸ“¦ AÃ§Ã£o adicionada Ã  fila offline:', queuedAction);
    return id;
  },

  // Obter todas as aÃ§Ãµes na fila
  getAll: (): QueuedAction[] => {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao ler fila offline:', error);
      return [];
    }
  },

  // Remover aÃ§Ã£o da fila
  remove: (id: string): void => {
    const queue = offlineQueue.getAll();
    const filtered = queue.filter(action => action.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    console.log('âœ… AÃ§Ã£o removida da fila:', id);
  },

  // Limpar fila
  clear: (): void => {
    localStorage.removeItem(QUEUE_KEY);
    console.log('ðŸ—‘ï¸ Fila offline limpa');
  },

  // Processar fila (executar quando voltar online)
  process: async (processAction: (action: QueuedAction) => Promise<void>): Promise<void> => {
    const queue = offlineQueue.getAll();
    
    if (queue.length === 0) {
      console.log('âœ… Nenhuma aÃ§Ã£o pendente na fila');
      return;
    }

    console.log(`ðŸ”„ Processando ${queue.length} aÃ§Ã£o(Ãµes) da fila offline...`);

    const results = await Promise.allSettled(
      queue.map(async (action) => {
        try {
          await processAction(action);
          offlineQueue.remove(action.id);
          return { success: true, action };
        } catch (error) {
          console.error(`âŒ Erro ao processar aÃ§Ã£o ${action.id}:`, error);
          
          // Incrementar tentativas
          action.retries += 1;
          
          if (action.retries >= MAX_RETRIES) {
            console.error(`âŒ AÃ§Ã£o ${action.id} excedeu nÃºmero mÃ¡ximo de tentativas`);
            offlineQueue.remove(action.id);
            return { success: false, action, error };
          } else {
            // Atualizar aÃ§Ã£o na fila com novo nÃºmero de tentativas
            const updatedQueue = offlineQueue.getAll();
            const index = updatedQueue.findIndex(a => a.id === action.id);
            if (index !== -1) {
              updatedQueue[index] = action;
              localStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
            }
            return { success: false, action, error, willRetry: true };
          }
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`âœ… Processamento concluÃ­do: ${successful} sucesso, ${failed} falhas`);
  }
};
