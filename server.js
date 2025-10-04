const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)
  
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  // Store connected users
  const connectedUsers = new Map()
  const chatMessages = []

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
    
    // Generate anonymous username
    const anonymousName = `Anonymous${Math.floor(Math.random() * 10000)}`
    connectedUsers.set(socket.id, {
      id: socket.id,
      name: anonymousName,
      connectedAt: new Date()
    })

    // Send user their anonymous name
    socket.emit('user-assigned', { name: anonymousName })

    // Send recent messages to new user
    socket.emit('chat-history', chatMessages.slice(-50)) // Last 50 messages

    // Send updated user count
    io.emit('user-count', connectedUsers.size)

    // Handle new messages
    socket.on('chat-message', (data) => {
      const user = connectedUsers.get(socket.id)
      if (user && data.message && data.message.trim()) {
        const message = {
          id: Date.now() + Math.random(),
          user: user.name,
          message: data.message.trim(),
          timestamp: new Date().toISOString(),
          userId: socket.id
        }
        
        chatMessages.push(message)
        
        // Keep only last 100 messages
        if (chatMessages.length > 100) {
          chatMessages.shift()
        }
        
        // Broadcast to all users
        io.emit('new-message', message)
      }
    })

    // Handle user typing
    socket.on('typing', (data) => {
      const user = connectedUsers.get(socket.id)
      if (user) {
        socket.broadcast.emit('user-typing', {
          user: user.name,
          isTyping: data.isTyping
        })
      }
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
      connectedUsers.delete(socket.id)
      io.emit('user-count', connectedUsers.size)
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
