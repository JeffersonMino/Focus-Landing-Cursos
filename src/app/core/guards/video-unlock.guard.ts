import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LANDING_CONFIG } from '../config/landing.config';
import { hasStoredVideoGateCompletion } from '../services/video-gate-storage.util';

export const videoUnlockGuard: CanActivateFn = () => {
  const router = inject(Router);
  const gateId = LANDING_CONFIG.videoGate.id;

  /**
   * <route-guard>
   *   <purpose>Evita entrar directo a /registro si el video obligatorio no fue completado.</purpose>
   *   <development>En local siempre bloquea porque persistVideoGateCompletion es false.</development>
   * </route-guard>
   */
  const completed = environment.persistVideoGateCompletion && hasStoredVideoGateCompletion(gateId);

  if (completed) {
    return true;
  }

  return router.createUrlTree(['/'], {
    fragment: 'trailer',
    queryParams: {
      locked: 'registro'
    }
  });
};
