import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToAboutMe() {
    this.router.navigate(['/cv']);
  }

  navigateToCountries() {
    this.router.navigate(['/contries']);
  }
}
