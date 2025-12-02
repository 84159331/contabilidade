type LogLevel = 'debug' | 'info' | 'warn' | 'error';
const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug ? console.debug.bind(console) : console.log.bind(console)
};

const isProduction = process.env.NODE_ENV === 'production';
const logsExplicitlyEnabled = process.env.REACT_APP_ENABLE_LOGS === 'true';

const shouldLog = (level: LogLevel) => {
  if (logsExplicitlyEnabled) return true;
  if (!isProduction) return true;
  return level === 'warn' || level === 'error';
};

const formatPrefix = (level: LogLevel) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]`;
};

const emit = (level: LogLevel, args: unknown[]) => {
  if (!shouldLog(level)) return;

  const method =
    level === 'debug'
      ? originalConsole.debug
      : level === 'info'
      ? originalConsole.info
      : level === 'warn'
      ? originalConsole.warn
      : originalConsole.error;

  method(formatPrefix(level), ...args);
};

export const logger = {
  debug: (...args: unknown[]) => emit('debug', args),
  info: (...args: unknown[]) => emit('info', args),
  warn: (...args: unknown[]) => emit('warn', args),
  error: (...args: unknown[]) => emit('error', args)
};

export const disableConsoleInProduction = () => {
  if (!isProduction || logsExplicitlyEnabled) {
    return;
  }

  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
};


