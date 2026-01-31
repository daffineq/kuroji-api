const MAX_LOGS = 500;

class Logger {
  private logs: { level: string; timestamp: string; caller: string; message: any[] }[] = [];

  private getCaller() {
    const stack = new Error().stack;
    if (!stack) return 'unknown';

    const lines = stack.split('\n').slice(3);
    const callerLine = lines[0]?.trim();
    return callerLine ?? 'unknown';
  }

  private save(level: string, message: any[], caller: string) {
    this.logs.push({
      level,
      timestamp: new Date().toISOString(),
      caller,
      message
    });

    if (this.logs.length > MAX_LOGS) {
      this.logs.shift();
    }
  }

  getLogs() {
    return this.logs.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  getLogsPaginated(page = 1, perPage = 50) {
    const sorted = [...this.logs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const start = (page - 1) * perPage;
    const end = start + perPage;

    return sorted.slice(start, end);
  }

  clearLogs() {
    this.logs = [];
  }

  log(...messages: any[]) {
    const caller = this.getCaller();
    console.log(`[LOG ${new Date().toISOString()}] ${caller}:`, ...messages);
    this.save('LOG', messages, caller);
  }

  error(...messages: any[]) {
    const caller = this.getCaller();
    console.error(`[ERROR ${new Date().toISOString()}] ${caller}:`, ...messages);
    this.save('ERROR', messages, caller);
  }

  warn(...messages: any[]) {
    const caller = this.getCaller();
    console.warn(`[WARN ${new Date().toISOString()}] ${caller}:`, ...messages);
    this.save('WARN', messages, caller);
  }
}

const logger = new Logger();

export default logger;
