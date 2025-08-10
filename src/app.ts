import express from 'express'
import dotenv from 'dotenv'
import landRoutes from './routes/land.routes'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import uploadRoutes from './routes/upload.route'
import cors from 'cors';
import wishlistRoutes from "./routes/wishlist.routes";

dotenv.config()

const app = express()
app.use(express.json())

// ✅ Enable CORS here BEFORE defining your routes
app.use(cors({
  origin: 'http://localhost:5173',  // allow frontend dev server
  credentials: true,               // allow cookies/auth headers if needed
}));

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/lands', landRoutes)
app.use('/api/v1/upload', uploadRoutes)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/wishlist',wishlistRoutes)

// Global error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', error)
  res.status(500).json({ error: 'Internal server error', details: error.message })
})

export default app
