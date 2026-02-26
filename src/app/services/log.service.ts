import { Injectable, signal } from '@angular/core';

export interface LogMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'table';
  data?: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private logs = signal<LogMessage[]>([]);
  private logId = 0;

  getLogs = this.logs.asReadonly();

  log(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    const logMsg: LogMessage = {
      id: this.logId++,
      message,
      type,
      timestamp: new Date()
    };
    
    this.logs.update(logs => [...logs, logMsg]);
    this.autoRemoveLog(logMsg.id);
    
    console.log(`[${type.toUpperCase()}]`, message);
  }

  logTable(message: string, data: any[]): void {
    const logMsg: LogMessage = {
      id: this.logId++,
      message,
      type: 'table',
      data,
      timestamp: new Date()
    };
    
    this.logs.update(logs => [...logs, logMsg]);
    this.autoRemoveLog(logMsg.id);
    
    console.table(data);
  }

  success(message: string): void {
    this.log(message, 'success');
  }

  error(message: string): void {
    this.log(message, 'error');
  }

  clearLogs(): void {
    this.logs.set([]);
  }

  private autoRemoveLog(id: number): void {
    setTimeout(() => {
      this.logs.update(logs => logs.filter(log => log.id !== id));
    }, 8000);
  }
}
