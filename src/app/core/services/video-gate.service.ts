import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  createVideoGateCompletionRecord,
  hasStoredVideoGateCompletion,
  videoGateStorageKey
} from './video-gate-storage.util';

interface GateState {
  progress: number;
  completed: boolean;
  attempts: number;
}

@Injectable({ providedIn: 'root' })
export class VideoGateService {
  private readonly document = inject(DOCUMENT);
  private readonly states = signal<Record<string, GateState>>({});

  /**
   * <video-gate-state>
   *   <purpose>Expone el estado actual del bloqueo para que componentes y botones reaccionen.</purpose>
   *   <edit>Si se agregan mas datos visuales del gate, extender GateState arriba.</edit>
   * </video-gate-state>
   */
  state(gateId: string) {
    return computed(() => this.states()[gateId] ?? this.initialState(gateId));
  }

  isCompleted(gateId: string) {
    return computed(() => this.state(gateId)().completed);
  }

  /**
   * <video-gate-hydrate>
   *   <purpose>Inicializa el bloqueo cuando el usuario entra o recarga la pagina.</purpose>
   *   <development>Mientras environment.resetVideoGateOnAppLoad sea true, se borra el desbloqueo guardado.</development>
   *   <production>En produccion se puede conservar el desbloqueo si persistVideoGateCompletion es true.</production>
   * </video-gate-hydrate>
   */
  hydrate(gateId: string): void {
    this.clearStoredCompletionWhenRequired(gateId);
    const completed = this.canUseStoredCompletion(gateId);

    this.states.update((states) => ({
      ...states,
      [gateId]: {
        progress: completed ? 100 : states[gateId]?.progress ?? 0,
        completed,
        attempts: states[gateId]?.attempts ?? 0
      }
    }));
    this.syncDocumentLock(gateId);
  }

  /**
   * <video-gate-progress>
   *   <purpose>Actualiza el porcentaje visto sin permitir que el progreso baje durante reproduccion normal.</purpose>
   *   <note>El metodo reset() es el unico que baja progreso a cero intencionalmente.</note>
   * </video-gate-progress>
   */
  updateProgress(gateId: string, progress: number): void {
    const current = this.states()[gateId] ?? this.initialState(gateId);
    const safeProgress = Math.max(current.progress, Math.min(100, Math.round(progress)));

    this.states.update((states) => ({
      ...states,
      [gateId]: {
        ...current,
        progress: safeProgress
      }
    }));
  }

  registerSkipAttempt(gateId: string): void {
    const current = this.states()[gateId] ?? this.initialState(gateId);
    this.states.update((states) => ({
      ...states,
      [gateId]: {
        ...current,
        attempts: current.attempts + 1
      }
    }));
  }

  /**
   * <video-gate-reset>
   *   <purpose>Reinicia el video antes de completarlo y vuelve a bloquear el funnel.</purpose>
   *   <edit>Usado por el boton Reiniciar del reproductor.</edit>
   * </video-gate-reset>
   */
  reset(gateId: string): void {
    const current = this.states()[gateId] ?? this.initialState(gateId);

    this.states.update((states) => ({
      ...states,
      [gateId]: {
        progress: 0,
        completed: false,
        attempts: current.attempts
      }
    }));
    localStorage.removeItem(videoGateStorageKey(gateId));
    this.lockDocument();
  }

  /**
   * <video-gate-complete>
   *   <purpose>Desbloquea secciones, CTAs y formularios cuando el usuario termina el video.</purpose>
   *   <development>No guarda completado si persistVideoGateCompletion es false.</development>
   * </video-gate-complete>
   */
  complete(gateId: string): void {
    this.states.update((states) => ({
      ...states,
      [gateId]: {
        progress: 100,
        completed: true,
        attempts: states[gateId]?.attempts ?? 0
      }
    }));

    if (environment.persistVideoGateCompletion) {
      localStorage.setItem(videoGateStorageKey(gateId), JSON.stringify(createVideoGateCompletionRecord(gateId)));
    }

    this.document.body.classList.remove('focus-flow-locked');
    this.reportCompletion(gateId);
  }

  lockDocument(): void {
    this.document.body.classList.add('focus-flow-locked');
  }

  private syncDocumentLock(gateId: string): void {
    const current = this.states()[gateId] ?? this.initialState(gateId);
    this.document.body.classList.toggle('focus-flow-locked', !current.completed);
  }

  private initialState(gateId: string): GateState {
    const completed = this.canUseStoredCompletion(gateId);
    return {
      progress: completed ? 100 : 0,
      completed,
      attempts: 0
    };
  }

  private reportCompletion(gateId: string): void {
    if (!environment.useApiVisitCounter || typeof fetch === 'undefined') {
      return;
    }

    void fetch(`${environment.apiBaseUrl}/video-completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        gateId,
        completedAt: new Date().toISOString()
      }),
      keepalive: true
    }).catch(() => undefined);
  }

  private canUseStoredCompletion(gateId: string): boolean {
    return environment.persistVideoGateCompletion && hasStoredVideoGateCompletion(gateId);
  }

  private clearStoredCompletionWhenRequired(gateId: string): void {
    if (!environment.resetVideoGateOnAppLoad && environment.persistVideoGateCompletion) {
      return;
    }

    localStorage.removeItem(videoGateStorageKey(gateId));
  }
}
