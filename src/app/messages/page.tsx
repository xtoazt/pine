"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { AuthModal } from '@/components/auth/auth-modal'
import { MessageCircle, Send, Users, Flame, Trophy, Clock } from 'lucide-react'
// TODO: Implement messages with Neon database

interface Message {
  id: string
  from: string
  to: string
  message: string
  read: boolean
  timestamp: any
  fromUsername?: string
}

interface Friend {
  id: string
  username: string
  level: number
  streak: number
  xp: number
  uid: string
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !db || !user.uid) return

    // Load friends
    const loadFriends = async () => {
      const friendsRef = collection(db as any, 'friendships')
      const q = query(
        friendsRef,
        where('users', 'array-contains', user.uid),
        where('status', '==', 'accepted')
      )

      const snapshot = await getDocs(q)
      const friendsList: Friend[] = []
      
      for (const friendDoc of snapshot.docs) {
        const data = friendDoc.data()
        const friendId = data.users?.find((id: string) => id !== user.uid)
        
        if (friendId) {
          const userDoc = await getDocs(query(collection(db as any, 'users'), where('__name__', '==', friendId)))
          if (!userDoc.empty) {
            const friendData = userDoc.docs[0].data()
            friendsList.push({
              id: friendDoc.id,
              username: friendData.username,
              level: friendData.level || 1,
              streak: friendData.streak || 0,
              xp: friendData.xp || 0,
              uid: friendId,
            })
          }
        }
      }
      
      setFriends(friendsList)
    }

    loadFriends()
  }, [user])

  useEffect(() => {
    if (!selectedFriend || !user || !db || !user.uid) return

    // Listen to messages with selected friend
    const messagesRef = collection(db as any, 'directMessages')
    const q = query(
      messagesRef,
      where('participants', 'array-contains', user.uid),
      orderBy('timestamp', 'desc'),
      firestoreLimit(50)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList: Message[] = []
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        // Check if message is between current user and selected friend
        if (data.participants.includes(user.uid) && data.participants.includes(selectedFriend.uid)) {
          messagesList.push({
            id: doc.id,
            from: data.from,
            to: data.to,
            message: data.message,
            read: data.read,
            timestamp: data.timestamp,
            fromUsername: data.from === user.uid ? (user.displayName || user.email || 'You') : selectedFriend.username,
          })
        }
      })
      
      setMessages(messagesList.reverse()) // Show oldest first
    })

    return () => unsubscribe()
  }, [selectedFriend, user])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend || !user || !db || !user.uid) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'directMessages'), {
        from: user.uid,
        to: selectedFriend.uid,
        message: newMessage.trim(),
        participants: [user.uid, selectedFriend.uid],
        read: false,
        timestamp: serverTimestamp(),
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    if (!db) return

    try {
      await updateDoc(doc(db, 'directMessages', messageId), {
        read: true,
      })
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  if (!user) {
    return (
      <div className="container py-8 relative">
        <div className="absolute inset-0 -z-10 hero-gradient opacity-40" />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center space-y-4">
            <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Direct Messages</h2>
            <p className="text-muted-foreground">
              Sign in to chat with your friends!
            </p>
            <Button onClick={() => setShowAuthModal(true)}>
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Messages</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Chat with your friends and share your gaming progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Friends List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Friends ({friends.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {friends.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No friends yet. Add some friends to start chatting!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedFriend?.id === friend.id ? 'bg-primary/5 border-r-2 border-primary' : ''
                      }`}
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{friend.username}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-yellow-500" />
                              Lv.{friend.level}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {friend.streak}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedFriend ? (
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Chat with {selectedFriend.username}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {selectedFriend.streak} day streak
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.from === user.uid ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.from === user.uid
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.fromUsername} • {message.timestamp?.toDate?.()?.toLocaleTimeString() || 'Now'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={loading}
                      />
                      <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="p-12 text-center text-muted-foreground">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Select a Friend</h3>
                  <p>Choose a friend from the list to start chatting</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
