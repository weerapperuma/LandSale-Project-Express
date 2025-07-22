import jwt from 'jsonwebtoken'
import { jwtSecret, jwtExpire } from '../config/jwt'

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpire })
}
