// Logger otimizado que desabilita console.logs em produção para melhor performance

const isDevelopment = process.env.NODE_ENV === 'development';

// Função para log condicional
export const log = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const logError = (...args: any[]) => {
  // Erros sempre são logados, mesmo em produção
  console.error(...args);
};

export const logWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

// Exportar objeto logger para compatibilidade com código existente
export const logger = {
  log,
  error: logError,
  warn: logWarn,
};

// Função para desabilitar console em produção
export const disableConsoleInProduction = () => {
  if (!isDevelopment && typeof window !== 'undefined') {
    // Opcional: desabilitar completamente console.log em produção
    // console.log = () => {};
    // console.warn = () => {};
    // Manter console.error ativo para debugging de erros críticos
  }
};
