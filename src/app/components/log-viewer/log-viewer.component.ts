import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService, LogMessage } from '../../services/log.service';

@Component({
  selector: 'app-log-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="log-viewer">
      @for (log of logService.getLogs(); track log.id) {
        <div class="log-message" [class]="'log-' + log.type">
          <div class="log-header">
            <span class="log-icon">
              @switch (log.type) {
                @case ('info') { ℹ️ }
                @case ('success') { ✅ }
                @case ('error') { ❌ }
                @case ('table') { 📊 }
              }
            </span>
            <span class="log-text">{{ log.message }}</span>
            <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          </div>
          
          @if (log.type === 'table' && log.data) {
            <div class="log-table">
              <table>
                <thead>
                  <tr>
                    @for (key of getKeys(log.data[0]); track key) {
                      <th>{{ key }}</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (row of log.data; track row) {
                    <tr>
                      @for (key of getKeys(row); track key) {
                        <td>{{ row[key] }}</td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .log-viewer {
      position: fixed;
      top: 80px;
      right: 1rem;
      width: 400px;
      max-height: calc(100vh - 100px);
      overflow-y: auto;
      z-index: 9998;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(102, 126, 234, 0.5);
        border-radius: 3px;
      }
    }

    .log-message {
      background: rgba(0, 0, 0, 0.92);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      border-left: 4px solid;
      animation: slideIn 0.3s ease-out;
      pointer-events: auto;
      max-width: 100%;

      &.log-info {
        border-left-color: #3498db;
      }

      &.log-success {
        border-left-color: #2ecc71;
      }

      &.log-error {
        border-left-color: #e74c3c;
      }

      &.log-table {
        border-left-color: #9b59b6;
      }
    }

    .log-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      font-size: 0.9rem;
    }

    .log-icon {
      font-size: 1.1rem;
    }

    .log-text {
      flex: 1;
      font-weight: 500;
    }

    .log-time {
      font-size: 0.75rem;
      opacity: 0.7;
    }

    .log-table {
      margin-top: 0.75rem;
      overflow-x: auto;
      
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.75rem;
        color: white;

        th, td {
          padding: 0.4rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        th {
          background: rgba(255, 255, 255, 0.1);
          font-weight: 600;
          white-space: nowrap;
        }

        td {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (max-width: 768px) {
      .log-viewer {
        width: calc(100% - 2rem);
        right: 1rem;
        top: 70px;
      }

      .log-message {
        padding: 0.75rem;
      }

      .log-table table {
        font-size: 0.7rem;

        th, td {
          padding: 0.3rem;
        }
      }
    }
  `]
})
export class LogViewerComponent {
  protected readonly logService = inject(LogService);

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
