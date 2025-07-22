import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/jwt'

interface AuthRequest extends Request {
  user?: any
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded
    next()
  } catch {
    res.sendStatus(403)
  }
}
