import { Routes } from '@angular/router';
import { videoUnlockGuard } from './core/guards/video-unlock.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing-page.component').then((m) => m.LandingPageComponent),
    title: 'DaleReset | Masterclass Audiovisual'
  },
  {
    path: 'registro',
    canActivate: [videoUnlockGuard],
    loadComponent: () =>
      import('./features/landing/components/registration-section/registration-section.component').then(
        (m) => m.RegistrationSectionComponent
      ),
    title: 'Registro | DaleReset'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
