"use client"

import { useState, useEffect, useCallback } from 'react'

interface VirtualControllerHook {
  isVisible: boolean
  toggleController: () => void
  showController: () => void
  hideController: () => void
  handleKeyPress: (key: string) => void
  handleKeyRelease: (key: string) => void
}

export function useVirtualController(): VirtualControllerHook {
  const [isVisible, setIsVisible] = useState(false)

  const toggleController = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  const showController = useCallback(() => {
    setIsVisible(true)
  }, [])

  const hideController = useCallback(() => {
    setIsVisible(false)
  }, [])

  const handleKeyPress = useCallback((key: string) => {
    // Create and dispatch a custom keyboard event
    const event = new KeyboardEvent('keydown', {
      key,
      code: key,
      bubbles: true,
      cancelable: true
    })
    document.dispatchEvent(event)
  }, [])

  const handleKeyRelease = useCallback((key: string) => {
    // Create and dispatch a custom keyboard event
    const event = new KeyboardEvent('keyup', {
      key,
      code: key,
      bubbles: true,
      cancelable: true
    })
    document.dispatchEvent(event)
  }, [])

  // Auto-hide controller on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        hideController()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isVisible, hideController])

  return {
    isVisible,
    toggleController,
    showController,
    hideController,
    handleKeyPress,
    handleKeyRelease
  }
}
