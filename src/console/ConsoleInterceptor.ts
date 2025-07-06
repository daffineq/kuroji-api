import { Injectable } from '@nestjs/common';

export interface FileTrace {
  fullPath: string;
  relativePath: string;
  fileName: string;
  line: number;
  column: number;
}

export interface LogEntry {
  message: string;
  date: string;
  type: 'log' | 'warn' | 'error';
  trace?: FileTrace;
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
    const stack = new Error().stack?.split('\n') ?? [];
    const callerLine = stack[3] || 'unknown';

    const traceMatch = callerLine.match(/\((.*):(\d+):(\d+)\)/);

    let file: FileTrace | undefined = undefined;

    if (traceMatch) {
      const fullPath = traceMatch[1].replace(/\\/g, '/');
      const line = Number(traceMatch[2]);
      const column = Number(traceMatch[3]);

      const fileNameMatch = fullPath.match(/([^/]+)$/);
      const fileName = fileNameMatch ? fileNameMatch[1] : fullPath;

      const projectRoot = process.cwd().replace(/\\/g, '/');
      const relativePath = fullPath.startsWith(projectRoot)
        ? fullPath.substring(projectRoot.length + 1)
        : fullPath;

      file = {
        fullPath,
        relativePath,
        fileName,
        line,
        column,
      };
    }

    const entry: LogEntry = {
      message: args
        .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
        .join(' '),
      date: new Date().toISOString(),
      type,
      trace: file,
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
