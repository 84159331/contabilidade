const express = require('express');
const router = express.Router();
const BackupService = require('../services/BackupService');
const authenticateToken = require('../middleware/auth');

const backupService = new BackupService();

// Middleware de autenticação para todas as rotas exceto teste
router.use((req, res, next) => {
  if (req.path.startsWith('/test/')) {
    return next();
  }
  return authenticateToken(req, res, next);
});

// Obter status do sistema de backup
router.get('/status', async (req, res) => {
  try {
    const status = backupService.getBackupStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obter configurações de backup
router.get('/config', async (req, res) => {
  try {
    res.json({ success: true, data: backupService.config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Atualizar configurações de backup
router.put('/config', async (req, res) => {
  try {
    const { enabled, frequency, time, retention, cloudStorage, localStorage } = req.body;
    
    const newConfig = {
      enabled: enabled !== undefined ? enabled : backupService.config.enabled,
      frequency: frequency || backupService.config.frequency,
      time: time || backupService.config.time,
      retention: retention || backupService.config.retention,
      cloudStorage: cloudStorage !== undefined ? cloudStorage : backupService.config.cloudStorage,
      localStorage: localStorage !== undefined ? localStorage : backupService.config.localStorage
    };

    backupService.saveConfig(newConfig);
    backupService.scheduleBackups();

    res.json({ success: true, data: newConfig });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Realizar backup manual
router.post('/manual', async (req, res) => {
  try {
    const result = await backupService.performBackup('manual');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obter histórico de backups
router.get('/history', async (req, res) => {
  try {
    const history = backupService.getBackupHistory();
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Restaurar backup
router.post('/restore/:backupId', async (req, res) => {
  try {
    const { backupId } = req.params;
    const result = await backupService.restoreBackup(`${backupId}.zip`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download de backup
router.get('/download/:backupId', async (req, res) => {
  try {
    const { backupId } = req.params;
    const backupPath = require('path').join(__dirname, '../backups', `${backupId}.zip`);
    
    if (!require('fs').existsSync(backupPath)) {
      return res.status(404).json({ success: false, error: 'Backup não encontrado' });
    }

    res.download(backupPath, `${backupId}.zip`);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rotas de teste (sem autenticação)
router.get('/test/status', async (req, res) => {
  try {
    const status = backupService.getBackupStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/test/history', async (req, res) => {
  try {
    const history = backupService.getBackupHistory();
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
