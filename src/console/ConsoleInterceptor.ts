import { Injectable } from '@nestjs/common';

export interface LogEntry {
  message: string;
  date: string;
  type: 'log' | 'warn' | 'error';
}

@Injectable()
export class ConsoleInterceptor {
  private logs: LogEntry[] = [];
  private maxSize = 500;

  constructor() {
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = (...args: any[]) => {
      this.addLog(args, 'log');
      origLog(...args);
    };

    console.warn = (...args: any[]) => {
      this.addLog(args, 'warn');
      origWarn(...args);
    };

    console.error = (...args: any[]) => {
      this.addLog(args, 'error');
      origError(...args);
    };
  }

  private addLog(args: any[], type: LogEntry['type']) {
    const entry: LogEntry = {
      message: args
        .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
        .join(' '),
      date: new Date().toISOString(),
      type,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxSize) {
      this.logs.shift();
    }
  }

  private sortLogs(logs: LogEntry[], order: 'asc' | 'desc'): LogEntry[] {
    return logs.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return order === 'asc' ? diff : -diff;
    });
  }

  private paginate<T>(items: T[], page = 1, limit = 50): T[] {
    const start = (page - 1) * limit;
    return items.slice(start, start + limit);
  }

  getAll(order: 'asc' | 'desc' = 'desc', page = 1, limit = 50): LogEntry[] {
    return this.paginate(this.sortLogs([...this.logs], order), page, limit);
  }

  getLogs(order: 'asc' | 'desc' = 'desc', page = 1, limit = 50): LogEntry[] {
    return this.paginate(
      this.sortLogs(
        this.logs.filter((log) => log.type === 'log'),
        order,
      ),
      page,
      limit,
    );
  }

  getWarns(order: 'asc' | 'desc' = 'desc', page = 1, limit = 50): LogEntry[] {
    return this.paginate(
      this.sortLogs(
        this.logs.filter((log) => log.type === 'warn'),
        order,
      ),
      page,
      limit,
    );
  }

  getErrors(order: 'asc' | 'desc' = 'desc', page = 1, limit = 50): LogEntry[] {
    return this.paginate(
      this.sortLogs(
        this.logs.filter((log) => log.type === 'error'),
        order,
      ),
      page,
      limit,
    );
  }
}
