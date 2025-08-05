import jwt from 'jsonwebtoken'
import { jwtSecret, jwtExpire } from '../config/jwt'

export const generateToken = (userId: string, role: 'USER' | 'ADMIN') : string => {
  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: jwtExpire })
}
