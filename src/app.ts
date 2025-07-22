import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import landRoutes from './routes/land.routes'
import authRoutes from './routes/auth.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/lands', landRoutes)

export default app
