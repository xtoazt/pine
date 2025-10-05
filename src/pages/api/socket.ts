import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as NetServer } from 'http'
import type { Socket } from 'net'
import { Server as IOServer } from 'socket.io'
import crypto from 'crypto'

type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io?: IOServer
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

interface UserData {
  username: string
  socketId: string
  passwordHash: string
}

interface DmMessage {
  from: string
  to: string
  message: string
  timestamp: number
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      path: '/chat/socket.io',
      addTrailingSlash: false,
      cors: { origin: '*', methods: ['GET', 'POST'] },
    })

    const users = new Map<string, UserData>() // username -> UserData
    const socketToUsername = new Map<string, string>() // socketId -> username
    const chatHistory: Array<{ username: string; message: string; timestamp: number }> = []

    const broadcastOnlineUsers = () => {
      const onlineUsernames = Array.from(socketToUsername.values())
      io.emit('online-users', onlineUsernames)
    }

    io.on('connection', (socket) => {
      console.log('[Chat] Client connected:', socket.id)

      socket.on('set-username', (data: { username: string; password: string }) => {
        const username = data.username?.trim()
        const password = data.password?.trim()

        if (!username || username.length < 2 || username.length > 20) {
          socket.emit('username-error', 'Username must be 2-20 characters')
          return
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          socket.emit('username-error', 'Username can only contain letters, numbers, and underscores')
          return
        }

        if (!password || password.length < 1) {
          socket.emit('username-error', 'Password is required')
          return
        }

        const existingUser = users.get(username.toLowerCase())
        const passwordHash = hashPassword(password)

        if (existingUser) {
          // User exists - check password
          if (existingUser.passwordHash !== passwordHash) {
            socket.emit('username-error', 'Incorrect password')
            return
          }
          // Password correct - update socket
          existingUser.socketId = socket.id
          socketToUsername.set(socket.id, username)
        } else {
          // New user - register
          users.set(username.toLowerCase(), {
            username,
            socketId: socket.id,
            passwordHash,
          })
          socketToUsername.set(socket.id, username)
          
          // Broadcast join message
          const joinMsg = { message: `${username} joined the chat`, timestamp: Date.now() }
          io.emit('system-message', joinMsg)
        }

        socket.emit('username-accepted', username)
        
        // Send chat history
        chatHistory.forEach(msg => {
          socket.emit('chat-message', msg)
        })

        // Send online users list
        broadcastOnlineUsers()
      })

      socket.on('chat-message', (message: string) => {
        const username = socketToUsername.get(socket.id)
        if (!username) return

        const msg = message?.trim()
        if (!msg || msg.length > 500) return

        const chatMsg = { username, message: msg, timestamp: Date.now() }
        chatHistory.push(chatMsg)
        if (chatHistory.length > 200) chatHistory.shift()

        io.emit('chat-message', chatMsg)
      })

      socket.on('dm-message', (data: { targetUsername: string; message: string }) => {
        const fromUsername = socketToUsername.get(socket.id)
        if (!fromUsername) return

        const msg = data.message?.trim()
        if (!msg || msg.length > 500) return

        const targetUser = users.get(data.targetUsername.toLowerCase())
        if (!targetUser) {
          socket.emit('dm-error', 'User not found or offline')
          return
        }

        const dmMsg: DmMessage = {
          from: fromUsername,
          to: data.targetUsername,
          message: msg,
          timestamp: Date.now(),
        }

        // Send to sender
        socket.emit('dm-message', dmMsg)

        // Send to recipient
        const targetSocket = io.sockets.sockets.get(targetUser.socketId)
        if (targetSocket) {
          targetSocket.emit('dm-message', dmMsg)
        }
      })

      socket.on('get-online-users', () => {
        broadcastOnlineUsers()
      })

      socket.on('disconnect', () => {
        const username = socketToUsername.get(socket.id)
        if (username) {
          socketToUsername.delete(socket.id)
          
          // Broadcast leave message
          const leaveMsg = { message: `${username} left the chat`, timestamp: Date.now() }
          io.emit('system-message', leaveMsg)
          
          broadcastOnlineUsers()
        }
        console.log('[Chat] Client disconnected:', socket.id)
      })
    })

    res.socket.server.io = io
  }
  res.end()
}


