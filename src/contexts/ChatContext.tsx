"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface ChatMessage {
  id: string | number
  user: string
  message: string
  timestamp: string
  userId: string
}

interface ChatContextType {
  socket: Socket | null
  messages: ChatMessage[]
  isConnected: boolean
  userCount: number
  currentUser: string | null
  typingUsers: string[]
  sendMessage: (message: string) => void
  setTyping: (isTyping: boolean) => void
  isChatVisible: boolean
  toggleChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [isChatVisible, setIsChatVisible] = useState(false)

  useEffect(() => {
    // Boot API route-based Socket.IO server
    fetch('/api/socket').catch(() => {})
    // Initialize socket connection to same origin API route
    const newSocket = io({ path: '/api/socket', autoConnect: true, transports: ['websocket'] })
    
    newSocket.on('connect', () => {
      console.log('Connected to chat server')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server')
      setIsConnected(false)
    })

    newSocket.on('user-assigned', (data) => {
      setCurrentUser(data.name)
    })

    newSocket.on('chat-history', (history) => {
      setMessages(history)
    })

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('user-count', (count) => {
      setUserCount(count)
    })

    newSocket.on('user-typing', (data) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          return prev.includes(data.user) ? prev : [...prev, data.user]
        } else {
          return prev.filter(user => user !== data.user)
        }
      })
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const sendMessage = (message: string) => {
    if (socket && message.trim()) {
      socket.emit('chat-message', { message })
    }
  }

  const setTyping = (isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { isTyping })
    }
  }

  const toggleChat = () => {
    setIsChatVisible(prev => !prev)
  }

  return (
    <ChatContext.Provider value={{
      socket,
      messages,
      isConnected,
      userCount,
      currentUser,
      typingUsers,
      sendMessage,
      setTyping,
      isChatVisible,
      toggleChat
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
