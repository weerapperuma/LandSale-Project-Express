import app from './app'
import { connectDB } from './config/db'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🌐 Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
