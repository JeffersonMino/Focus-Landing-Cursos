import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  NgZone,
  OnDestroy,
  signal
} from '@angular/core';
import { VideoGateConfig } from '@core/models/landing.model';
import {
  YoutubeApi,
  YoutubeApiService,
  YoutubePlayer,
  YoutubePlayerEvent
} from '@core/services/youtube-api.service';
import { VideoGateService } from '@core/services/video-gate.service';

@Component({
  selector: 'focus-video-gate',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <article class="focus-panel overflow-hidden" [class.border-focus-orange]="completed()">
      <div class="grid gap-0 lg:grid-cols-[1.55fr_0.75fr]">
        <!-- <youtube-player>
          <purpose>Contenedor donde YouTube Iframe API monta el reproductor obligatorio.</purpose>
          <edit>No cambiar el id; se genera automaticamente en playerElementId.</edit>
        </youtube-player> -->
        <div class="relative min-h-[240px] bg-black sm:min-h-[360px] lg:min-h-[520px]">
          @if (!ready()) {
            <img
              class="absolute inset-0 h-full w-full object-cover opacity-55"
              [src]="video().poster"
              [alt]="video().title"
              loading="lazy"
              decoding="async"
            >
            <div class="absolute inset-0 grid place-items-center bg-black/45">
              <div class="text-center">
                <div class="mx-auto h-12 w-12 animate-pulse rounded-[8px] border border-focus-orange/60 bg-focus-orange/15"></div>
                <p class="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-white/64">Cargando video</p>
              </div>
            </div>
          }

          <div class="absolute inset-0">
            <div [id]="playerElementId" class="h-full w-full"></div>
          </div>

          @if (showCompletionOverlay()) {
            <div class="absolute inset-0 grid place-items-center bg-black/72 backdrop-blur-sm">
              <div class="max-w-sm px-6 text-center">
                <div class="mx-auto grid h-14 w-14 place-items-center rounded-[8px] bg-focus-orange text-2xl font-black text-black">
                  ✓
                </div>
                <h3 class="mt-5 text-2xl font-semibold text-white">Acceso desbloqueado</h3>
                <p class="mt-2 text-sm leading-6 text-white/68">
                  Ya puedes avanzar al registro, beneficios y grupo privado de WhatsApp.
                </p>
              </div>
            </div>
          }
        </div>

        <aside class="flex flex-col justify-between gap-8 border-t border-white/10 bg-black/70 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <!-- <video-gate-controls>
            <purpose>Panel de estado: progreso, aviso anti-skip, sonido y reinicio.</purpose>
          </video-gate-controls> -->
          <div>
            <p class="focus-eyebrow">{{ video().eyebrow }}</p>
            <h2 class="mt-4 font-display text-3xl font-semibold leading-tight text-white">{{ video().title }}</h2>
            <p class="mt-4 text-sm leading-6 text-white/62">
              El reproductor valida tiempo visto, bloquea saltos manuales y desbloquea el funnel al completar el contenido.
            </p>
          </div>

          <div class="space-y-5">
            <div>
              <div class="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                <span>Progreso</span>
                <span>{{ progress() | number: '1.0-0' }}%</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                <div
                  class="h-full rounded-full bg-focus-orange transition-all duration-500"
                  [style.width.%]="progress()"
                ></div>
              </div>
            </div>

            @if (skipWarning()) {
              <p class="rounded-[6px] border border-focus-orange/40 bg-focus-orange/10 px-4 py-3 text-sm text-white/78" aria-live="assertive">
                Detectamos un salto en la linea de tiempo. Vuelve al punto visto para continuar.
              </p>
            }

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button type="button" class="focus-button focus-button-primary min-w-0 whitespace-normal px-3 text-xs sm:text-[0.68rem] lg:text-xs" [disabled]="!ready()" (click)="togglePlayback()">
                {{ playing() ? 'Pausar' : 'Reproducir' }}
              </button>
              <button type="button" class="focus-button focus-button-primary min-w-0 whitespace-normal px-3 text-xs sm:text-[0.68rem] lg:text-xs" (click)="toggleMute()">
                {{ muted() ? 'Activar sonido' : 'Silenciar' }}
              </button>
              <!-- <restart-button>
                <purpose>Reinicia el video. Antes de completar bloquea de nuevo; despues de completar solo repite el video.</purpose>
              </restart-button> -->
              <button type="button" class="focus-button focus-button-primary min-w-0 whitespace-normal px-3 text-xs sm:text-[0.68rem] lg:text-xs" [disabled]="!ready()" (click)="replayFromStart()">
                Reiniciar
              </button>
            </div>

            <dl class="grid grid-cols-3 gap-3 text-center">
              <div class="rounded-[6px] border border-white/10 bg-white/[0.04] p-3">
                <dt class="text-[10px] uppercase tracking-[0.18em] text-white/42">Visto</dt>
                <dd class="mt-1 text-lg font-semibold text-white">{{ watchedSeconds() | number: '1.0-0' }}s</dd>
              </div>
              <div class="rounded-[6px] border border-white/10 bg-white/[0.04] p-3">
                <dt class="text-[10px] uppercase tracking-[0.18em] text-white/42">Saltos</dt>
                <dd class="mt-1 text-lg font-semibold text-white">{{ gateState().attempts }}</dd>
              </div>
              <div class="rounded-[6px] border border-white/10 bg-white/[0.04] p-3">
                <dt class="text-[10px] uppercase tracking-[0.18em] text-white/42">Estado</dt>
                <dd class="mt-1 text-lg font-semibold" [class.text-focus-orange]="!completed()" [class.text-white]="completed()">
                  {{ completed() ? 'OK' : 'LOCK' }}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoGateComponent implements AfterViewInit, OnDestroy {
  readonly video = input.required<VideoGateConfig>();

  private readonly youtube = inject(YoutubeApiService);
  private readonly gate = inject(VideoGateService);
  private readonly zone = inject(NgZone);

  readonly playerElementId = `focus-player-${Math.random().toString(36).slice(2)}`;
  readonly ready = signal(false);
  readonly muted = signal(false);
  readonly playing = signal(false);
  readonly watchedSeconds = signal(0);
  readonly skipWarning = signal(false);
  readonly replaying = signal(false);
  readonly gateState = computed(() => this.gate.state(this.video().id)());
  readonly progress = computed(() => this.gateState().progress);
  readonly completed = computed(() => this.gateState().completed);
  readonly showCompletionOverlay = computed(() => this.completed() && !this.replaying());

  private player?: YoutubePlayer;
  private api?: YoutubeApi;
  private intervalId?: number;
  private duration = 1;
  private maxWatchedTime = 0;
  private warningTimer?: number;

  async ngAfterViewInit(): Promise<void> {
    this.gate.hydrate(this.video().id);
    this.api = await this.youtube.load();
    this.createPlayer(this.api);
  }

  ngOnDestroy(): void {
    this.stopMonitor();
    window.clearTimeout(this.warningTimer);
  }

  toggleMute(): void {
    if (!this.player) {
      return;
    }

    if (this.muted()) {
      this.player.unMute();
      this.muted.set(false);
      return;
    }

    this.player.mute();
    this.muted.set(true);
  }

  togglePlayback(): void {
    if (!this.player) {
      return;
    }

    if (this.playing()) {
      this.player.pauseVideo();
      return;
    }

    this.player.playVideo();
  }

  replayFromStart(): void {
    if (!this.player) {
      return;
    }

    const wasCompleted = this.completed();

    this.stopMonitor();
    this.maxWatchedTime = 0;
    this.watchedSeconds.set(0);
    this.skipWarning.set(false);
    this.replaying.set(wasCompleted);

    if (!wasCompleted) {
      this.gate.reset(this.video().id);
    }

    this.player.seekTo(0, true);
    this.player.playVideo();

    if (!wasCompleted) {
      this.startMonitor();
    }
  }

  private createPlayer(api: YoutubeApi): void {
    this.zone.runOutsideAngular(() => {
      this.player = new api.Player(this.playerElementId, {
        videoId: this.video().youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: (event) => this.zone.run(() => this.onReady(event)),
          onStateChange: (event) => this.zone.run(() => this.onStateChange(event))
        }
      });
    });
  }

  private onReady(event: YoutubePlayerEvent): void {
    this.duration = Math.max(event.target.getDuration(), 1);
    this.ready.set(true);

    if (!this.completed()) {
      this.gate.lockDocument();
    }
  }

  private onStateChange(event: YoutubePlayerEvent): void {
    if (!this.api) {
      return;
    }

    if (event.data === this.api.PlayerState.PLAYING) {
      this.playing.set(true);
      this.startMonitor();
    }

    if (
      event.data === this.api.PlayerState.PAUSED ||
      event.data === this.api.PlayerState.CUED ||
      event.data === this.api.PlayerState.UNSTARTED
    ) {
      this.playing.set(false);
    }

    if (event.data === this.api.PlayerState.ENDED) {
      this.playing.set(false);
      this.replaying.set(false);

      if (!this.completed()) {
        this.markCompleted();
      }
    }
  }

  private startMonitor(): void {
    if (this.intervalId) {
      return;
    }

    this.intervalId = window.setInterval(() => this.auditPlayback(), 500);
  }

  private stopMonitor(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private auditPlayback(): void {
    if (!this.player || this.completed()) {
      this.stopMonitor();
      return;
    }

    this.duration = Math.max(this.player.getDuration(), this.duration, 1);
    const currentTime = Math.max(this.player.getCurrentTime(), 0);
    const jumpTolerance = 1.7;

    if (currentTime > this.maxWatchedTime + jumpTolerance) {
      this.player.seekTo(this.maxWatchedTime, false);
      this.gate.registerSkipAttempt(this.video().id);
      this.flashSkipWarning();
      return;
    }

    this.maxWatchedTime = Math.max(this.maxWatchedTime, currentTime);
    this.watchedSeconds.set(Math.floor(this.maxWatchedTime));

    const percent = Math.min((this.maxWatchedTime / this.duration) * 100, 100);
    this.gate.updateProgress(this.video().id, percent);

    const requiredSeconds = this.video().minWatchSecondsBeforeUnlock ?? 0;
    const meetsRequiredTime = this.maxWatchedTime >= Math.min(requiredSeconds, this.duration - 1);

    if (percent >= this.video().requiredPercentage && meetsRequiredTime) {
      this.markCompleted();
    }
  }

  private markCompleted(): void {
    this.gate.complete(this.video().id);
    this.gate.updateProgress(this.video().id, 100);
    this.stopMonitor();
  }

  private flashSkipWarning(): void {
    this.skipWarning.set(true);
    window.clearTimeout(this.warningTimer);
    this.warningTimer = window.setTimeout(() => this.skipWarning.set(false), 2200);
  }
}
