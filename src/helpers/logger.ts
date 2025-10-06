class Logger {
  private getCaller() {
    const stack = new Error().stack;
    if (!stack) return 'unknown';

    const lines = stack.split('\n').slice(2);
    const callerLine = lines[0]?.trim();
    return callerLine || 'unknown';
  }

  log(message?: any, ...optionalParams: any[]) {
    console.log(`[LOG ${new Date().toISOString()}] ${this.getCaller()}:`, message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]) {
    console.error(`[ERROR ${new Date().toISOString()}] ${this.getCaller()}:`, message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]) {
    console.warn(`[WARN ${new Date().toISOString()}] ${this.getCaller()}:`, message, ...optionalParams);
  }
}

const logger = new Logger();

export default logger;
