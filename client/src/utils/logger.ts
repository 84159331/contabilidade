// Logger otimizado que desabilita console.logs em produÃ§Ã£o para melhor performance

const isDevelopment = process.env.NODE_ENV === 'development';

// FunÃ§Ã£o para log condicional
export const log = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

export const logError = (...args: any[]) => {
  // Erros sempre sÃ£o logados, mesmo em produÃ§Ã£o (mas apenas em desenvolvimento detalhado)
  if (isDevelopment) {
  console.error(...args);
  } else {
    // Em produÃ§Ã£o, apenas erros crÃ­ticos
    console.error('[ERROR]', ...args);
  }
};

export const logWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

export const logInfo = (...args: any[]) => {
  if (isDevelopment) {
    console.info(...args);
  }
};

// Exportar objeto logger para compatibilidade com cÃ³digo existente
export const logger = {
  log,
  error: logError,
  warn: logWarn,
  info: logInfo,
};

// FunÃ§Ã£o para desabilitar console em produÃ§Ã£o (opcional)
export const disableConsoleInProduction = () => {
  if (!isDevelopment && typeof window !== 'undefined') {
    // Desabilitar console.log e console.warn em produÃ§Ã£o
    // Manter console.error para erros crÃ­ticos
    const noop = () => {};
    if (process.env.REACT_APP_DISABLE_CONSOLE === 'true') {
      console.log = noop;
      console.log = noop;
      console.warn = noop;
    }
  }
};

// Inicializar ao carregar
if (typeof window !== 'undefined') {
  disableConsoleInProduction();
}
