"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { AuthModal } from '@/components/auth/auth-modal'
import { Users, UserPlus, MessageCircle, Flame, Trophy } from 'lucide-react'
import { db } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  limit as firestoreLimit,
} from 'firebase/firestore'

interface Friend {
  id: string
  username: string
  level: number
  streak: number
  xp: number
  status: 'pending' | 'accepted'
}

export default function FriendsPage() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [friends, setFriends] = useState<Friend[]>([])
  const [searchUsername, setSearchUsername] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !db) return

    // Listen to friend requests and friends
    const friendsRef = collection(db, 'friendships')
    const q = query(
      friendsRef,
      where('users', 'array-contains', user.uid)
    )

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const friendsList: Friend[] = []
      
      for (const friendDoc of snapshot.docs) {
        const data = friendDoc.data()
        const friendId = data.users?.find((id: string) => id !== user.uid)
        
        if (friendId) {
          // Fetch friend's profile
          const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', friendId)))
          if (!userDoc.empty) {
            const friendData = userDoc.docs[0].data()
            friendsList.push({
              id: friendDoc.id,
              username: friendData.username,
              level: friendData.level || 1,
              streak: friendData.streak || 0,
              xp: friendData.xp || 0,
              status: data.status,
            })
          }
        }
      }
      
      setFriends(friendsList)
    })

    return () => unsubscribe()
  }, [user])

  const searchUser = async () => {
    if (!searchUsername.trim() || !db) return

    setLoading(true)
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('username', '==', searchUsername.trim()))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const userData = snapshot.docs[0]
        setSearchResult({
          uid: userData.id,
          ...userData.data(),
        })
      } else {
        setSearchResult(null)
        alert('User not found')
      }
    } catch (error) {
      console.error('Error searching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendFriendRequest = async (friendId: string) => {
    if (!user || !db) return

    try {
      await addDoc(collection(db, 'friendships'), {
        users: [user.uid, friendId],
        status: 'pending',
        requestedBy: user.uid,
        createdAt: serverTimestamp(),
      })
      alert('Friend request sent!')
      setSearchResult(null)
      setSearchUsername('')
    } catch (error) {
      console.error('Error sending friend request:', error)
      alert('Failed to send friend request')
    }
  }

  const acceptFriendRequest = async (friendshipId: string) => {
    if (!db || acceptingRequest) return

    setAcceptingRequest(friendshipId)
    try {
      await updateDoc(doc(db, 'friendships', friendshipId), {
        status: 'accepted',
      })
    } catch (error) {
      console.error('Error accepting friend request:', error)
      alert('Failed to accept friend request. Please try again.')
    } finally {
      setAcceptingRequest(null)
    }
  }

  if (!user) {
    return (
      <div className="container py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center space-y-4">
            <Users className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Friends Feature</h2>
            <p className="text-muted-foreground">
              Sign in to add friends, compete on streaks, and send messages!
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

  const pendingRequests = friends.filter(f => f.status === 'pending')
  const acceptedFriends = friends.filter(f => f.status === 'accepted')

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Friends</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Connect with friends, compete on streaks, and share your gaming journey
        </p>
      </div>

      {/* Add Friend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Friend
          </CardTitle>
          <CardDescription>Search for users by username</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
                    <Input
                      placeholder="Enter username..."
                      value={searchUsername}
                      onChange={(e) => setSearchUsername(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchUser()}
                      aria-label="Search for friends by username"
                    />
            <Button onClick={searchUser} disabled={loading}>
              Search
            </Button>
          </div>

          {searchResult && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{searchResult.username}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        Lv.{searchResult.level || 1}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {searchResult.streak || 0} day streak
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => sendFriendRequest(searchResult.uid)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingRequests.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{friend.username}</p>
                  <p className="text-sm text-muted-foreground">
                    Level {friend.level} • {friend.streak} day streak
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => acceptFriendRequest(friend.id)}
                  disabled={acceptingRequest === friend.id}
                >
                  {acceptingRequest === friend.id ? 'Accepting...' : 'Accept'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Friends ({acceptedFriends.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {acceptedFriends.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No friends yet. Add some friends to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {acceptedFriends.map((friend) => (
                <Card key={friend.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{friend.username}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3 text-yellow-500" />
                            Level {friend.level}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {friend.streak} day streak
                          </span>
                          <span>{friend.xp} XP</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" disabled>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message (Soon)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Friend Streak Competitions (Coming Soon) */}
      <Card className="bg-gradient-to-r from-orange-500/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Friend Streak Competitions
          </CardTitle>
          <CardDescription>Compete with your friends on weekly XP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-semibold mb-2">Coming Soon!</p>
            <p className="text-sm">
              Compete with friends in weekly challenges, compare streaks, and climb the friend leaderboard
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
