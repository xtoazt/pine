"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Music,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react'

interface Track {
  id: string
  title: string
  artist: string
  thumbnail: string
  videoId?: string
  duration?: number
}

interface MusicPlayerProps {
  isVisible: boolean
  onToggle: () => void
}

export function MusicPlayer({ isVisible, onToggle }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [volume, setVolume] = useState(75)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isYouTubeReady, setIsYouTubeReady] = useState(false)
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sample tracks for demonstration
  const sampleTracks: Track[] = [
    {
      id: '1',
      title: 'Lofi Hip Hop',
      artist: 'Chill Beats',
      thumbnail: '/api/placeholder/64/64',
      videoId: 'jfKfPfyJRdk', // Lofi hip hop radio
      duration: 0
    },
    {
      id: '2', 
      title: 'Synthwave Dreams',
      artist: 'Retro Wave',
      thumbnail: '/api/placeholder/64/64',
      videoId: '4xDzrJKXOOY', // Synthwave mix
      duration: 0
    },
    {
      id: '3',
      title: 'Ambient Space',
      artist: 'Cosmic Sounds',
      thumbnail: '/api/placeholder/64/64', 
      videoId: 'DWcJFNfaw9c', // Ambient space music
      duration: 0
    }
  ]

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    window.onYouTubeIframeAPIReady = () => {
      setIsYouTubeReady(true)
    }

    // Start with first track
    if (sampleTracks.length > 0 && !currentTrack) {
      setCurrentTrack(sampleTracks[0])
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isYouTubeReady && currentTrack?.videoId && !playerRef.current) {
      initializePlayer()
    }
  }, [isYouTubeReady, currentTrack])

  const initializePlayer = () => {
    if (!currentTrack?.videoId) return

    playerRef.current = new window.YT.Player('music-player-iframe', {
      height: '0',
      width: '0',
      videoId: currentTrack.videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    })
  }

  const onPlayerReady = () => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume)
      setDuration(playerRef.current.getDuration())
    }
  }

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true)
      startTimeUpdate()
    } else {
      setIsPlaying(false)
      stopTimeUpdate()
    }
  }

  const startTimeUpdate = () => {
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime())
      }
    }, 1000)
  }

  const stopTimeUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const togglePlay = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
    }
  }

  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true)
    }
  }

  const nextTrack = () => {
    if (!currentTrack) return
    const currentIndex = sampleTracks.findIndex(t => t.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % sampleTracks.length
    setCurrentTrack(sampleTracks[nextIndex])
    if (playerRef.current) {
      playerRef.current.loadVideoById(sampleTracks[nextIndex].videoId)
    }
  }

  const prevTrack = () => {
    if (!currentTrack) return
    const currentIndex = sampleTracks.findIndex(t => t.id === currentTrack.id)
    const prevIndex = currentIndex === 0 ? sampleTracks.length - 1 : currentIndex - 1
    setCurrentTrack(sampleTracks[prevIndex])
    if (playerRef.current) {
      playerRef.current.loadVideoById(sampleTracks[prevIndex].videoId)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isVisible) return null

  return (
    <>
      {/* Hidden YouTube player */}
      <div id="music-player-iframe" style={{ display: 'none' }} />
      
      <Card className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isMinimized ? 'w-16 h-16' : 'w-80'
      }`}>
        <CardContent className="p-0">
          {isMinimized ? (
            <div className="w-16 h-16 flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="w-full h-full"
              >
                <Music className="h-6 w-6" />
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Background Music</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(true)}
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Track Info */}
              {currentTrack && (
                <div className="flex items-center space-x-3">
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{currentTrack.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="space-y-1">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevTrack}
                    disabled={!currentTrack}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    disabled={!currentTrack || !isYouTubeReady}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextTrack}
                    disabled={!currentTrack}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
