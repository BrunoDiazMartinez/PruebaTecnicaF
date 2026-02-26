import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="help-container">
      <button class="help-button" (click)="toggleHelp()" [class.active]="showHelp()">
        ?
      </button>

      @if (showHelp()) {
        <div class="help-modal" (click)="toggleHelp()">
          <div class="help-content" (click)="$event.stopPropagation()">
            <button class="close-btn" (click)="toggleHelp()">×</button>
            
            <h2>Guía de Uso</h2>
            
            <div class="help-section">
              <h3>Países del Mundo</h3>
              <p>Esta aplicación combina datos de dos APIs públicas para mostrar información completa de países:</p>
              <ul>
                <li><strong>GraphQL API</strong>: Datos básicos (nombre, código, idiomas, moneda)</li>
                <li><strong>REST API</strong>: Datos complementarios (población, área, banderas)</li>
              </ul>
            </div>

            <div class="help-section">
              <h3>Funcionalidades</h3>
              <ul>
                <li><strong>Buscar</strong>: Filtra por nombre, código o capital</li>
                <li><strong>Filtrar</strong>: Selecciona por continente</li>
                <li><strong>Ordenar</strong>: Por nombre, población o código</li>
                <li><strong>Detalles</strong>: Click en cualquier país para ver más información</li>
              </ul>
            </div>

            <div class="help-section">
              <h3>Características Técnicas</h3>
              <ul>
                <li>Datos unificados de 2 APIs en paralelo</li>
                <li>Cache inteligente para mejor rendimiento</li>
                <li>Spinner global durante cargas</li>
                <li>Diseño responsive</li>
                <li>Ver logs en consola del navegador (F12)</li>
              </ul>
            </div>

            <div class="help-section">
              <h3>Sobre Mí</h3>
              <p>Visita la sección "Sobre Mí" para conocer más sobre mi.</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .help-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
    }

    .help-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      font-size: 2rem;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.7);
      }

      &.active {
        transform: rotate(135deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
      }
      50% {
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.8);
      }
    }

    .help-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
      padding: 1rem;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .help-content {
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 4px;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #f1f1f1;
      color: #333;
      font-size: 1.8rem;
      font-weight: 300;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;

      &:hover {
        background: #e74c3c;
        color: white;
        transform: rotate(90deg);
      }
    }

    h2 {
      font-size: 2rem;
      color: #667eea;
      margin: 0 0 1.5rem 0;
      font-weight: 700;
    }

    .help-section {
      margin-bottom: 1.5rem;

      h3 {
        font-size: 1.2rem;
        color: #333;
        margin: 0 0 0.8rem 0;
        font-weight: 600;
      }

      p {
        color: #555;
        line-height: 1.6;
        margin: 0 0 0.8rem 0;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          color: #555;
          line-height: 1.6;
          position: relative;

          &::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
            font-size: 1.2rem;
          }

          strong {
            color: #333;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .help-container {
        bottom: 1rem;
        right: 1rem;
      }

      .help-button {
        width: 50px;
        height: 50px;
        font-size: 1.6rem;
      }

      .help-content {
        padding: 2rem;
        max-height: 85vh;
        margin: 1rem;
      }

      h2 {
        font-size: 1.6rem;
        margin-right: 2rem;
      }

      .help-section h3 {
        font-size: 1.1rem;
      }
    }
  `]
})
export class HelpButtonComponent {
  showHelp = signal<boolean>(false);

  toggleHelp(): void {
    this.showHelp.update(value => !value);
  }
}
