class Logger {
  private logs: { level: string; timestamp: string; caller: string; message: any[] }[] = [];

  private getCaller() {
    const stack = new Error().stack;
    if (!stack) return 'unknown';

    const lines = stack.split('\n').slice(2);
    const callerLine = lines[0]?.trim();
    return callerLine || 'unknown';
  }

  private save(level: string, message: any[], caller: string) {
    this.logs.push({
      level,
      timestamp: new Date().toISOString(),
      caller,
      message
    });
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  log(message?: any, ...optionalParams: any[]) {
    const caller = this.getCaller();
    console.log(`[LOG ${new Date().toISOString()}] ${caller}:`, message, ...optionalParams);
    this.save('LOG', [message, ...optionalParams], caller);
  }

  error(message?: any, ...optionalParams: any[]) {
    const caller = this.getCaller();
    console.error(`[ERROR ${new Date().toISOString()}] ${caller}:`, message, ...optionalParams);
    this.save('ERROR', [message, ...optionalParams], caller);
  }

  warn(message?: any, ...optionalParams: any[]) {
    const caller = this.getCaller();
    console.warn(`[WARN ${new Date().toISOString()}] ${caller}:`, message, ...optionalParams);
    this.save('WARN', [message, ...optionalParams], caller);
  }
}

const logger = new Logger();
export default logger;
