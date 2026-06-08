import { Injectable } from '@angular/core';

export interface YoutubePlayer {
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  mute(): void;
  pauseVideo(): void;
  playVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  unMute(): void;
}

export interface YoutubePlayerEvent {
  target: YoutubePlayer;
  data: number;
}

export interface YoutubeApi {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: YoutubePlayerEvent) => void;
        onStateChange: (event: YoutubePlayerEvent) => void;
      };
    }
  ) => YoutubePlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
    UNSTARTED: number;
  };
}

declare global {
  interface Window {
    YT?: YoutubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

@Injectable({ providedIn: 'root' })
export class YoutubeApiService {
  private apiPromise?: Promise<YoutubeApi>;

  load(): Promise<YoutubeApi> {
    if (window.YT?.Player) {
      return Promise.resolve(window.YT);
    }

    this.apiPromise ??= new Promise<YoutubeApi>((resolve) => {
      const previousCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        resolve(window.YT as YoutubeApi);
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }
    });

    return this.apiPromise;
  }
}
