"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Gamepad2, Settings, X } from 'lucide-react'

interface VirtualControllerProps {
  onKeyPress?: (key: string) => void
  onKeyRelease?: (key: string) => void
  isVisible?: boolean
  onToggle?: () => void
}

export function VirtualController({ 
  onKeyPress, 
  onKeyRelease, 
  isVisible = false, 
  onToggle 
}: VirtualControllerProps) {
  const [isActive, setIsActive] = useState(false)
  const [settings, setSettings] = useState({
    opacity: 0.8,
    size: 'medium',
    position: 'bottom-right'
  })
  const controllerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (key: string) => {
    setIsActive(true)
    onKeyPress?.(key)
  }

  const handleKeyUp = (key: string) => {
    setIsActive(false)
    onKeyRelease?.(key)
  }

  const handleTouchStart = (e: React.TouchEvent, key: string) => {
    e.preventDefault()
    handleKeyDown(key)
  }

  const handleTouchEnd = (e: React.TouchEvent, key: string) => {
    e.preventDefault()
    handleKeyUp(key)
  }

  const handleMouseDown = (key: string) => {
    handleKeyDown(key)
  }

  const handleMouseUp = (key: string) => {
    handleKeyUp(key)
  }

  const handleMouseLeave = (key: string) => {
    handleKeyUp(key)
  }

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-lg"
        size="icon"
      >
        <Gamepad2 className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div 
      ref={controllerRef}
      className={`fixed z-50 transition-all duration-300 ${
        settings.position === 'bottom-right' ? 'bottom-4 right-4' :
        settings.position === 'bottom-left' ? 'bottom-4 left-4' :
        settings.position === 'top-right' ? 'top-4 right-4' :
        'top-4 left-4'
      }`}
      style={{ opacity: settings.opacity }}
    >
      <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            <span className="text-sm font-medium">Virtual Controller</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setSettings(prev => ({ ...prev, opacity: prev.opacity === 0.8 ? 0.4 : 0.8 }))}
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onToggle}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* D-Pad */}
        <div className="grid grid-cols-3 gap-1 mb-4">
          <div></div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onMouseDown={() => handleMouseDown('ArrowUp')}
            onMouseUp={() => handleMouseUp('ArrowUp')}
            onMouseLeave={() => handleMouseLeave('ArrowUp')}
            onTouchStart={(e) => handleTouchStart(e, 'ArrowUp')}
            onTouchEnd={(e) => handleTouchEnd(e, 'ArrowUp')}
          >
            ↑
          </Button>
          <div></div>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onMouseDown={() => handleMouseDown('ArrowLeft')}
            onMouseUp={() => handleMouseUp('ArrowLeft')}
            onMouseLeave={() => handleMouseLeave('ArrowLeft')}
            onTouchStart={(e) => handleTouchStart(e, 'ArrowLeft')}
            onTouchEnd={(e) => handleTouchEnd(e, 'ArrowLeft')}
          >
            ←
          </Button>
          <div className="h-8 w-8"></div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onMouseDown={() => handleMouseDown('ArrowRight')}
            onMouseUp={() => handleMouseUp('ArrowRight')}
            onMouseLeave={() => handleMouseLeave('ArrowRight')}
            onTouchStart={(e) => handleTouchStart(e, 'ArrowRight')}
            onTouchEnd={(e) => handleTouchEnd(e, 'ArrowRight')}
          >
            →
          </Button>
          
          <div></div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onMouseDown={() => handleMouseDown('ArrowDown')}
            onMouseUp={() => handleMouseUp('ArrowDown')}
            onMouseLeave={() => handleMouseLeave('ArrowDown')}
            onTouchStart={(e) => handleTouchStart(e, 'ArrowDown')}
            onTouchEnd={(e) => handleTouchEnd(e, 'ArrowDown')}
          >
            ↓
          </Button>
          <div></div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-red-500/20 border-red-500/50"
            onMouseDown={() => handleMouseDown('Space')}
            onMouseUp={() => handleMouseUp('Space')}
            onMouseLeave={() => handleMouseLeave('Space')}
            onTouchStart={(e) => handleTouchStart(e, 'Space')}
            onTouchEnd={(e) => handleTouchEnd(e, 'Space')}
          >
            A
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-blue-500/20 border-blue-500/50"
            onMouseDown={() => handleMouseDown('Enter')}
            onMouseUp={() => handleMouseUp('Enter')}
            onMouseLeave={() => handleMouseLeave('Enter')}
            onTouchStart={(e) => handleTouchStart(e, 'Enter')}
            onTouchEnd={(e) => handleTouchEnd(e, 'Enter')}
          >
            B
          </Button>
        </div>

        {/* Additional Controls */}
        <div className="flex justify-center gap-1 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 text-xs"
            onMouseDown={() => handleMouseDown('Escape')}
            onMouseUp={() => handleMouseUp('Escape')}
            onMouseLeave={() => handleMouseLeave('Escape')}
            onTouchStart={(e) => handleTouchStart(e, 'Escape')}
            onTouchEnd={(e) => handleTouchEnd(e, 'Escape')}
          >
            ESC
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 text-xs"
            onMouseDown={() => handleMouseDown('Shift')}
            onMouseUp={() => handleMouseUp('Shift')}
            onMouseLeave={() => handleMouseLeave('Shift')}
            onTouchStart={(e) => handleTouchStart(e, 'Shift')}
            onTouchEnd={(e) => handleTouchEnd(e, 'Shift')}
          >
            SHIFT
          </Button>
        </div>
      </div>
    </div>
  )
}
