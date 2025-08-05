import express from 'express'
import dotenv from 'dotenv'
import landRoutes from './routes/land.routes'
import authRoutes from './routes/auth.routes'
import uploadRoutes from './routes/upload.route'

dotenv.config()

const app = express()
app.use(express.json())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/lands', landRoutes)
app.use('/api/v1/upload', uploadRoutes)

// Global error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', error)
  res.status(500).json({ error: 'Internal server error', details: error.message })
})

export default app
