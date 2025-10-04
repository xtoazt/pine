"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Send, Users, Wifi, WifiOff } from 'lucide-react'
import { useChat } from '@/contexts/ChatContext'

export function ChatWindow() {
  const { 
    messages, 
    isConnected, 
    userCount, 
    currentUser, 
    typingUsers, 
    sendMessage, 
    setTyping, 
    isChatVisible, 
    toggleChat 
  } = useChat()

  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isTyping) {
      setTyping(true)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        setTyping(false)
      }, 1000)
    } else {
      setTyping(false)
    }
  }, [isTyping, setTyping])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessage(message)
      setMessage('')
      setIsTyping(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!isChatVisible) return null

  return (
    <Card className="fixed bottom-20 right-4 w-80 h-96 z-40 shadow-2xl border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Chat</CardTitle>
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {userCount}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleChat}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {currentUser && (
          <p className="text-sm text-muted-foreground">
            You are: <span className="font-medium">{currentUser}</span>
          </p>
        )}
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-64">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.user === currentUser ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.user === currentUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="font-medium text-xs opacity-70 mb-1">
                    {msg.user}
                  </div>
                  <div>{msg.message}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))
          )}
          
          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="text-xs text-muted-foreground italic">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1"
              maxLength={500}
              disabled={!isConnected}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || !isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!isConnected && (
            <p className="text-xs text-red-500 mt-2">
              Disconnected from chat server
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
