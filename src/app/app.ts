import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HelpButtonComponent } from './components/help-button/help-button.component';
import { LogViewerComponent } from './components/log-viewer/log-viewer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, HelpButtonComponent, LogViewerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Frontend');
}
