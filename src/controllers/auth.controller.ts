import { Request, Response } from 'express'
import { generateToken } from '../utils/generateToken'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Dummy auth
  if (email === 'admin@land.com' && password === '123456') {
    const token = generateToken('admin-user-id')
    return res.json({ token })
  }

  res.status(401).json({ message: 'Invalid credentials' })
}
