import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show) {
      <div class="spinner-overlay">
        <div class="spinner-container">
          <div class="spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-dot"></div>
          </div>
          @if (message) {
            <p class="spinner-message">{{ message }}</p>
          }
          @if (submessage) {
            <p class="spinner-submessage">{{ submessage }}</p>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 15, 35, 0.95);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .spinner-container {
      text-align: center;
    }

    .spinner {
      width: 100px;
      height: 100px;
      position: relative;
      margin: 0 auto 2rem;
      display: inline-block;
    }

    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 4px solid transparent;
      border-radius: 50%;
      animation: spin 2s linear infinite;
    }

    .spinner-ring:nth-child(1) {
      border-top-color: #667eea;
      animation-duration: 2s;
    }

    .spinner-ring:nth-child(2) {
      border-right-color: #764ba2;
      animation-duration: 1.5s;
      animation-direction: reverse;
    }

    .spinner-ring:nth-child(3) {
      border-bottom-color: #f093fb;
      animation-duration: 1s;
    }

    .spinner-dot {
      position: absolute;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse 1.5s ease-in-out infinite;
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0.6;
      }
    }

    .spinner-message {
      color: #fff;
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      animation: fadeInUp 0.5s ease-out 0.2s backwards;
    }

    .spinner-submessage {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      margin: 0;
      animation: fadeInUp 0.5s ease-out 0.4s backwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .spinner {
        width: 80px;
        height: 80px;
      }

      .spinner-dot {
        width: 16px;
        height: 16px;
      }

      .spinner-message {
        font-size: 1.2rem;
      }

      .spinner-submessage {
        font-size: 0.9rem;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() show: boolean = false;
  @Input() message: string = 'Cargando...';
  @Input() submessage: string = 'Por favor espera un momento';
}
