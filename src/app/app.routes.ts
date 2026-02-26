import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/Home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'cv',
    loadComponent: () => import('./pages/AboutMe/aboutme.component').then(m => m.AboutMeComponent)
  },
  {
    path: 'contries',
    loadComponent: () => import('./pages/Contries/contries.component').then(m => m.ContriesComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
