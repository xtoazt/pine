declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady: () => void
  }
}

declare namespace YT {
  class Player {
    constructor(elementId: string, config: PlayerConfig)
    playVideo(): void
    pauseVideo(): void
    stopVideo(): void
    seekTo(seconds: number, allowSeekAhead?: boolean): void
    getCurrentTime(): number
    getDuration(): number
    getPlayerState(): PlayerState
    setVolume(volume: number): void
    getVolume(): number
    loadVideoById(videoId: string): void
  }

  interface PlayerConfig {
    height: string | number
    width: string | number
    videoId?: string
    playerVars?: PlayerVars
    events?: PlayerEvents
  }

  interface PlayerVars {
    autoplay?: 0 | 1
    controls?: 0 | 1 | 2
    disablekb?: 0 | 1
    enablejsapi?: 0 | 1
    fs?: 0 | 1
    iv_load_policy?: 1 | 3
    modestbranding?: 0 | 1
    playsinline?: 0 | 1
    rel?: 0 | 1
  }

  interface PlayerEvents {
    onReady?: (event: PlayerEvent) => void
    onStateChange?: (event: PlayerEvent) => void
    onError?: (event: PlayerEvent) => void
  }

  interface PlayerEvent {
    target: Player
    data: PlayerState
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
  }
}

export {}
