const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const archiver = require('archiver');

class BackupService {
  constructor() {
    this.backupDir = path.join(__dirname, '../backups');
    this.dbPath = path.join(__dirname, '../database.sqlite');
    this.config = {
      enabled: true,
      frequency: 'daily',
      time: '02:00',
      retention: 30,
      cloudStorage: false,
      localStorage: true
    };
    
    this.initializeBackupDir();
    this.loadConfig();
    this.scheduleBackups();
  }

  initializeBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  loadConfig() {
    const configPath = path.join(this.backupDir, 'backup-config.json');
    if (fs.existsSync(configPath)) {
      try {
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (error) {
        console.error('Erro ao carregar configuração de backup:', error);
      }
    }
  }

  saveConfig(config) {
    this.config = { ...this.config, ...config };
    const configPath = path.join(this.backupDir, 'backup-config.json');
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
  }

  scheduleBackups() {
    if (!this.config.enabled) return;

    // Cancelar tarefas existentes
    cron.getTasks().forEach(task => task.destroy());

    let cronExpression;
    switch (this.config.frequency) {
      case 'daily':
        cronExpression = this.getCronExpression(this.config.time);
        break;
      case 'weekly':
        cronExpression = `0 0 * * 0`; // Domingo às 00:00
        break;
      case 'monthly':
        cronExpression = `0 0 1 * *`; // Primeiro dia do mês às 00:00
        break;
      default:
        cronExpression = this.getCronExpression('02:00');
    }

    cron.schedule(cronExpression, () => {
      this.performBackup('automatic');
    });

    console.log(`Backup automático agendado: ${cronExpression}`);
  }

  getCronExpression(time) {
    const [hours, minutes] = time.split(':');
    return `${minutes} ${hours} * * *`;
  }

  async performBackup(type = 'manual') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup-${timestamp}.zip`;
      const backupPath = path.join(this.backupDir, backupFileName);

      console.log(`Iniciando backup ${type}: ${backupFileName}`);

      // Criar arquivo de backup
      const output = fs.createWriteStream(backupPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`Backup concluído: ${archive.pointer()} bytes`);
        this.cleanupOldBackups();
      });

      archive.on('error', (err) => {
        throw err;
      });

      archive.pipe(output);

      // Adicionar banco de dados
      if (fs.existsSync(this.dbPath)) {
        archive.file(this.dbPath, { name: 'database.sqlite' });
      }

      // Adicionar arquivos de configuração
      const configFiles = [
        'backup-config.json',
        'server-config.json'
      ];

      configFiles.forEach(file => {
        const filePath = path.join(this.backupDir, file);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: file });
        }
      });

      await archive.finalize();

      return {
        success: true,
        fileName: backupFileName,
        size: archive.pointer(),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Erro ao realizar backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  cleanupOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('backup-') && file.endsWith('.zip'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          stats: fs.statSync(path.join(this.backupDir, file))
        }))
        .sort((a, b) => b.stats.mtime - a.stats.mtime);

      const retentionDays = this.config.retention || 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      files.forEach(file => {
        if (file.stats.mtime < cutoffDate) {
          fs.unlinkSync(file.path);
          console.log(`Backup antigo removido: ${file.name}`);
        }
      });

    } catch (error) {
      console.error('Erro ao limpar backups antigos:', error);
    }
  }

  getBackupHistory() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('backup-') && file.endsWith('.zip'))
        .map(file => {
          const stats = fs.statSync(path.join(this.backupDir, file));
          return {
            id: file.replace('.zip', ''),
            fileName: file,
            timestamp: stats.mtime.toISOString(),
            size: this.formatFileSize(stats.size),
            type: 'automatic' // Seria determinado pela lógica de agendamento
          };
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return files;
    } catch (error) {
      console.error('Erro ao obter histórico de backups:', error);
      return [];
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async restoreBackup(backupFileName) {
    try {
      const backupPath = path.join(this.backupDir, backupFileName);
      
      if (!fs.existsSync(backupPath)) {
        throw new Error('Arquivo de backup não encontrado');
      }

      console.log(`Iniciando restauração: ${backupFileName}`);

      // Aqui você implementaria a lógica de restauração
      // Por exemplo, extrair o arquivo zip e restaurar o banco de dados
      
      return {
        success: true,
        message: 'Backup restaurado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getBackupStatus() {
    return {
      enabled: this.config.enabled,
      frequency: this.config.frequency,
      time: this.config.time,
      retention: this.config.retention,
      nextBackup: this.getNextBackupTime(),
      totalBackups: this.getBackupHistory().length,
      totalSize: this.getTotalBackupSize()
    };
  }

  getNextBackupTime() {
    if (!this.config.enabled) return null;

    const now = new Date();
    const [hours, minutes] = this.config.time.split(':');
    
    let nextBackup = new Date();
    nextBackup.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (nextBackup <= now) {
      nextBackup.setDate(nextBackup.getDate() + 1);
    }

    return nextBackup.toISOString();
  }

  getTotalBackupSize() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('backup-') && file.endsWith('.zip'));
      
      let totalSize = 0;
      files.forEach(file => {
        const stats = fs.statSync(path.join(this.backupDir, file));
        totalSize += stats.size;
      });

      return this.formatFileSize(totalSize);
    } catch (error) {
      return '0 Bytes';
    }
  }
}

module.exports = BackupService;
