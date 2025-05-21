import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', loadComponent: () => import('./features/heroes/hero.component').then(m => m.HeroComponent) },
  { path: 'hero/add', loadComponent: () => import('./features/heroes/add-hero/add-hero.component').then(m => m.AddHeroComponent) },
  { path: 'hero/edit/:id', loadComponent: () => import('./features/heroes/edit-hero/edit-hero.component').then(m => m.EditHeroComponent) },
  { path: 'hero/:id', loadComponent: () => import('./features/heroes/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent) },
  { path: '**', redirectTo: '' }
];
