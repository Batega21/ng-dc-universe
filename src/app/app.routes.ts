import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'hero', pathMatch: 'full' },
  {
    path: 'hero',
    children: [
      { path: '', loadComponent: () => import('./features/heroes/hero.component').then(m => m.HeroComponent) },
      { path: 'add', loadComponent: () => import('./features/heroes/add-hero/add-hero.component').then(m => m.AddHeroComponent) },
      { path: 'edit/:id', loadComponent: () => import('./features/heroes/edit-hero/edit-hero.component').then(m => m.EditHeroComponent) },
      { path: ':id', loadComponent: () => import('./features/heroes/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent) },
    ],
  },
  { path: '**', redirectTo: 'hero' },
];
