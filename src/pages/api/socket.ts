import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as NetServer } from 'http'
import type { Socket } from 'net'
import { Server as IOServer } from 'socket.io'

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

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: { origin: '*', methods: ['GET', 'POST'] },
    })

    const connectedUsers = new Map<string, { name: string; connectedAt: Date }>()
    const chatMessages: Array<{ id: number; user: string; message: string; timestamp: string; userId: string }> = []

    io.on('connection', (socket) => {
      const anon = `Anonymous${Math.floor(Math.random() * 10000)}`
      connectedUsers.set(socket.id, { name: anon, connectedAt: new Date() })
      socket.emit('user-assigned', { name: anon })
      socket.emit('chat-history', chatMessages.slice(-50))
      io.emit('user-count', connectedUsers.size)

      socket.on('chat-message', (data: { message: string }) => {
        const u = connectedUsers.get(socket.id)
        const msg = (data?.message || '').trim()
        if (!u || !msg) return
        const payload = {
          id: Date.now() + Math.random(),
          user: u.name,
          message: msg.slice(0, 500),
          timestamp: new Date().toISOString(),
          userId: socket.id,
        }
        chatMessages.push(payload)
        if (chatMessages.length > 200) chatMessages.shift()
        io.emit('new-message', payload)
      })

      socket.on('typing', (data: { isTyping: boolean }) => {
        const u = connectedUsers.get(socket.id)
        if (!u) return
        socket.broadcast.emit('user-typing', { user: u.name, isTyping: !!data?.isTyping })
      })

      socket.on('disconnect', () => {
        connectedUsers.delete(socket.id)
        io.emit('user-count', connectedUsers.size)
      })
    })

    res.socket.server.io = io
  }
  res.end()
}


