import { initializeDatabase } from '../src/lib/neon'

async function main() {
  console.log('Initializing Neon database...')
  
  try {
    await initializeDatabase()
    console.log('✅ Database initialized successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  }
}

main()
