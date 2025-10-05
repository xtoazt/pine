"use client"

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { AuthModal } from '@/components/auth/auth-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Send, MessageCircle, Lock } from 'lucide-react'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'

interface Message {
  id: string
  username: string
  userId: string
  message: string
  timestamp: any
}

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!db) return

    // Real-time listener for messages
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = []
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message)
      })
      setMessages(msgs.reverse())
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (!newMessage.trim()) return

    if (!db) return

    try {
      await addDoc(collection(db, 'messages'), {
        username: user.displayName || 'Anonymous',
        userId: user.uid,
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Pine Chat
              <Badge variant="secondary" className="ml-2">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <ScrollArea className="h-[500px] w-full rounded-md border p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Be the first to say hi!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">
                          {msg.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp?.toDate().toLocaleTimeString() || ''}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder={user ? 'Type a message...' : 'Sign in to chat...'}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!user}
              />
              <Button type="submit" disabled={!user || !newMessage.trim()}>
                {user ? (
                  <>
                    <Send className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {!user && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Sign in to join the conversation
                </p>
                <Button onClick={() => setShowAuthModal(true)}>
                  Sign In / Sign Up
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}