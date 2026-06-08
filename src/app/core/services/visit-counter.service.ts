import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { LANDING_CONFIG } from '../config/landing.config';
import { environment } from '../../../environments/environment';

export interface VisitStats {
  total: number;
  session: number;
  source: 'localStorage' | 'api';
  lastVisitIso: string;
}

interface ApiVisitResponse {
  total: number;
  uniqueToday?: number;
  lastVisitIso?: string;
}

@Injectable({ providedIn: 'root' })
export class VisitCounterService {
  private readonly http = inject(HttpClient);
  private readonly config = LANDING_CONFIG.visitCounter;
  private readonly sessionKey = `${this.config.storageKey}.session`;
  private readonly stats = signal<VisitStats>({
    total: 0,
    session: 0,
    source: this.shouldUseApi() ? 'api' : 'localStorage',
    lastVisitIso: new Date().toISOString()
  });

  readonly total = computed(() => this.stats().total);
  readonly session = computed(() => this.stats().session);
  readonly source = computed(() => this.stats().source);
  readonly snapshot = computed(() => this.stats());

  async increment(): Promise<void> {
    if (this.shouldUseApi()) {
      const updated = await this.incrementViaApi();
      if (updated) {
        return;
      }
    }

    this.incrementLocal();
  }

  private shouldUseApi(): boolean {
    return environment.useApiVisitCounter || this.config.provider === 'api';
  }

  private async incrementViaApi(): Promise<boolean> {
    const endpoint = `${environment.apiBaseUrl}${this.config.apiPath}/increment`;
    const response = await firstValueFrom(
      this.http.post<ApiVisitResponse>(endpoint, {}).pipe(catchError(() => of(null)))
    );

    if (!response) {
      return false;
    }

    const session = Number(sessionStorage.getItem(this.sessionKey) ?? '0') + 1;
    sessionStorage.setItem(this.sessionKey, String(session));
    this.stats.set({
      total: response.total,
      session,
      source: 'api',
      lastVisitIso: response.lastVisitIso ?? new Date().toISOString()
    });
    return true;
  }

  private incrementLocal(): void {
    const now = new Date().toISOString();
    const raw = localStorage.getItem(this.config.storageKey);
    const saved = this.safeParse(raw);
    const session = Number(sessionStorage.getItem(this.sessionKey) ?? '0') + 1;
    const total = Number(saved.total ?? 0) + 1;

    const next: VisitStats = {
      total,
      session,
      source: 'localStorage',
      lastVisitIso: now
    };

    localStorage.setItem(this.config.storageKey, JSON.stringify(next));
    sessionStorage.setItem(this.sessionKey, String(session));
    this.stats.set(next);
  }

  private safeParse(raw: string | null): Partial<VisitStats> {
    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as Partial<VisitStats>;
    } catch {
      return {};
    }
  }
}
