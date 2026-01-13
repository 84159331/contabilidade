// Sistema de sincronização offline

import { offlineQueue, QueuedAction } from './offlineQueue';
import { membersAPI, transactionsAPI, categoriesAPI } from '../services/api';

class OfflineSync {
  private isProcessing = false;
  private syncListeners: Array<() => void> = [];

  constructor() {
    // Escutar eventos de conexão
    window.addEventListener('online', () => {
      console.log('🌐 Conexão restaurada, iniciando sincronização...');
      this.sync();
    });

    // Tentar sincronizar ao iniciar se estiver online
    if (navigator.onLine) {
      // Aguardar um pouco para garantir que tudo está carregado
      setTimeout(() => {
        this.sync();
      }, 2000);
    }
  }

  // Adicionar listener para quando sincronização completar
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

  // Sincronizar ações pendentes
  async sync(): Promise<void> {
    if (this.isProcessing) {
      console.log('⏳ Sincronização já em andamento...');
      return;
    }

    if (!navigator.onLine) {
      console.log('📴 Sem conexão, não é possível sincronizar');
      return;
    }

    this.isProcessing = true;

    try {
      await offlineQueue.process(async (action) => {
        console.log(`🔄 Processando ação: ${action.type} em ${action.collection}`, action.data);

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
            console.warn(`⚠️ Tipo de coleção não suportado: ${action.collection}`);
        }
      });

      this.notifySyncComplete();
    } catch (error) {
      console.error('❌ Erro durante sincronização:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Sincronizar ação de membro
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

  // Sincronizar ação de transação
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

  // Sincronizar ação de categoria
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

  // Verificar se há ações pendentes
  hasPendingActions(): boolean {
    return offlineQueue.getAll().length > 0;
  }

  // Obter número de ações pendentes
  getPendingCount(): number {
    return offlineQueue.getAll().length;
  }
}

// Instância singleton
export const offlineSync = new OfflineSync();
