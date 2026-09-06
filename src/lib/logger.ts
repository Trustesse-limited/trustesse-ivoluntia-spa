/**
 * Production-safe logger utility
 * Logs are only active in development and test environments
 */

const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

const logger = {
  log: (...args: unknown[]) => {
    if (isDevOrTest) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevOrTest) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (isDevOrTest) {
      console.error(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDevOrTest) {
      console.info(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (isDevOrTest) {
      console.debug(...args);
    }
  }
};

export default logger;