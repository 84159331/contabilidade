// Sistema de sincronizaÃ§Ã£o offline

import { offlineQueue, QueuedAction } from './offlineQueue';
import { membersAPI, transactionsAPI, categoriesAPI } from '../services/api';

class OfflineSync {
  private isProcessing = false;
  private syncListeners: Array<() => void> = [];

  constructor() {
    // Escutar eventos de conexÃ£o
    window.addEventListener('online', () => {
      console.log('ðŸŒ ConexÃ£o restaurada, iniciando sincronizaÃ§Ã£o...');
      this.sync();
    });

    // Tentar sincronizar ao iniciar se estiver online
    if (navigator.onLine) {
      // Aguardar um pouco para garantir que tudo estÃ¡ carregado
      setTimeout(() => {
        this.sync();
      }, 2000);
    }
  }

  // Adicionar listener para quando sincronizaÃ§Ã£o completar
  onSyncComplete(callback: () => void) {
    this.syncListeners.push(callback);
  }

  // Remover listener
  offSyncComplete(callback: () => void) {
    this.syncListeners = this.syncListeners.filter(cb => cb !== callback);
  }

  // Notificar listeners
  private notifySyncComplete() {
    this.syncListeners.forEach(callback => callback());
  }

  // Sincronizar aÃ§Ãµes pendentes
  async sync(): Promise<void> {
    if (this.isProcessing) {
      console.log('â³ SincronizaÃ§Ã£o jÃ¡ em andamento...');
      return;
    }

    if (!navigator.onLine) {
      console.log('ðŸ“´ Sem conexÃ£o, nÃ£o Ã© possÃ­vel sincronizar');
      return;
    }

    this.isProcessing = true;

    try {
      await offlineQueue.process(async (action) => {
        console.log(`ðŸ”„ Processando aÃ§Ã£o: ${action.type} em ${action.collection}`, action.data);

        switch (action.collection) {
          case 'members':
            await this.syncMemberAction(action);
            break;
          case 'transactions':
            await this.syncTransactionAction(action);
            break;
          case 'categories':
            await this.syncCategoryAction(action);
            break;
          default:
            console.warn(`âš ï¸ Tipo de coleÃ§Ã£o nÃ£o suportado: ${action.collection}`);
        }
      });

      this.notifySyncComplete();
    } catch (error) {
      console.error('âŒ Erro durante sincronizaÃ§Ã£o:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Sincronizar aÃ§Ã£o de membro
  private async syncMemberAction(action: QueuedAction): Promise<void> {
    switch (action.type) {
      case 'create':
        await membersAPI.createMember(action.data);
        break;
      case 'update':
        await membersAPI.updateMember(action.data.id, action.data);
        break;
      case 'delete':
        await membersAPI.deleteMember(action.data.id);
        break;
    }
  }

  // Sincronizar aÃ§Ã£o de transaÃ§Ã£o
  private async syncTransactionAction(action: QueuedAction): Promise<void> {
    switch (action.type) {
      case 'create':
        await transactionsAPI.createTransaction(action.data);
        break;
      case 'update':
        await transactionsAPI.updateTransaction(action.data.id, action.data);
        break;
      case 'delete':
        await transactionsAPI.deleteTransaction(action.data.id);
        break;
    }
  }

  // Sincronizar aÃ§Ã£o de categoria
  private async syncCategoryAction(action: QueuedAction): Promise<void> {
    switch (action.type) {
      case 'create':
        await categoriesAPI.createCategory(action.data);
        break;
      case 'update':
        await categoriesAPI.updateCategory(action.data.id, action.data);
        break;
      case 'delete':
        await categoriesAPI.deleteCategory(action.data.id);
        break;
    }
  }

  // Verificar se hÃ¡ aÃ§Ãµes pendentes
  hasPendingActions(): boolean {
    return offlineQueue.getAll().length > 0;
  }

  // Obter nÃºmero de aÃ§Ãµes pendentes
  getPendingCount(): number {
    return offlineQueue.getAll().length;
  }
}

// InstÃ¢ncia singleton
export const offlineSync = new OfflineSync();
