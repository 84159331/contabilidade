// Sistema de fila para ações offline

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
  // Adicionar ação à fila
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
    
    console.log('📦 Ação adicionada à fila offline:', queuedAction);
    return id;
  },

  // Obter todas as ações na fila
  getAll: (): QueuedAction[] => {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao ler fila offline:', error);
      return [];
    }
  },

  // Remover ação da fila
  remove: (id: string): void => {
    const queue = offlineQueue.getAll();
    const filtered = queue.filter(action => action.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    console.log('✅ Ação removida da fila:', id);
  },

  // Limpar fila
  clear: (): void => {
    localStorage.removeItem(QUEUE_KEY);
    console.log('🗑️ Fila offline limpa');
  },

  // Processar fila (executar quando voltar online)
  process: async (processAction: (action: QueuedAction) => Promise<void>): Promise<void> => {
    const queue = offlineQueue.getAll();
    
    if (queue.length === 0) {
      console.log('✅ Nenhuma ação pendente na fila');
      return;
    }

    console.log(`🔄 Processando ${queue.length} ação(ões) da fila offline...`);

    const results = await Promise.allSettled(
      queue.map(async (action) => {
        try {
          await processAction(action);
          offlineQueue.remove(action.id);
          return { success: true, action };
        } catch (error) {
          console.error(`❌ Erro ao processar ação ${action.id}:`, error);
          
          // Incrementar tentativas
          action.retries += 1;
          
          if (action.retries >= MAX_RETRIES) {
            console.error(`❌ Ação ${action.id} excedeu número máximo de tentativas`);
            offlineQueue.remove(action.id);
            return { success: false, action, error };
          } else {
            // Atualizar ação na fila com novo número de tentativas
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

    console.log(`✅ Processamento concluído: ${successful} sucesso, ${failed} falhas`);
  }
};
