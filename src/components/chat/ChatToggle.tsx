"use client"

import { Button } from '@/components/ui/button'
import { MessageCircle, Users } from 'lucide-react'
import { useChat } from '@/contexts/ChatContext'

export function ChatToggle() {
  const { isChatVisible, toggleChat, userCount, isConnected } = useChat()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleChat}
      className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background/90 transition-all duration-200"
      title={isChatVisible ? "Hide Chat" : "Show Chat"}
    >
      <div className="relative">
        <MessageCircle className="h-5 w-5" />
        {userCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {userCount}
          </div>
        )}
        {!isConnected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        )}
      </div>
    </Button>
  )
}
