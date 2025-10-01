import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const backupAPI = {
  // Obter status do sistema de backup
  getStatus: async (useTestRoute = false) => {
    const endpoint = useTestRoute ? '/backup/test/status' : '/backup/status';
    return api.get(endpoint);
  },

  // Obter configurações de backup
  getConfig: async () => {
    return api.get('/backup/config');
  },

  // Atualizar configurações de backup
  updateConfig: async (config: any) => {
    return api.put('/backup/config', config);
  },

  // Realizar backup manual
  performManualBackup: async () => {
    return api.post('/backup/manual');
  },

  // Obter histórico de backups
  getHistory: async (useTestRoute = false) => {
    const endpoint = useTestRoute ? '/backup/test/history' : '/backup/history';
    return api.get(endpoint);
  },

  // Restaurar backup
  restoreBackup: async (backupId: string) => {
    return api.post(`/backup/restore/${backupId}`);
  },

  // Download de backup
  downloadBackup: async (backupId: string) => {
    return api.get(`/backup/download/${backupId}`, {
      responseType: 'blob'
    });
  }
};

export default api;
