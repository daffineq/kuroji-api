import { Injectable } from '@nestjs/common'

export interface LogEntry {
  message: string
  date: string
  type: 'log' | 'warn' | 'error'
}

@Injectable()
export class ConsoleInterceptor {
  private logs: LogEntry[] = [];
  private warns: LogEntry[] = [];
  private errors: LogEntry[] = [];

  private maxSize = 100;

  constructor() {
    const origLog = console.log
    const origWarn = console.warn
    const origError = console.error

    console.log = (...args: any[]) => {
      this.addToList(this.logs, args, 'log')
      origLog(...args)
    }

    console.warn = (...args: any[]) => {
      this.addToList(this.warns, args, 'warn')
      origWarn(...args)
    }

    console.error = (...args: any[]) => {
      this.addToList(this.errors, args, 'error')
      origError(...args)
    };

  }

  private addToList(list: LogEntry[], args: any[], type: LogEntry['type']) {
    const entry: LogEntry = {
      message: args.join(' '),
      date: new Date().toISOString(),
      type,
    }

    list.push(entry)
    if (list.length > this.maxSize) {
      list.shift()
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs].reverse()
  }

  getWarns(): LogEntry[] {
    return [...this.warns].reverse()
  }

  getErrors(): LogEntry[] {
    return [...this.errors].reverse()
  }
}