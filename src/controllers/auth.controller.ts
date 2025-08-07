import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken'
import User from '../models/User'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user._id.toString(),user.role)

  res.status(200).json({ token })
}

export const signup = async (req: Request, res: Response) => {
  const { name, email, address, password, phoneNumber } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  // Always set role to 'USER' for public signup
  const newUser = new User({ name, email, address, passwordHash, phoneNumber, role: 'USER' });
  console.log(newUser);
  await newUser.save();
  res.status(201).json({ message: 'User created successfully' });
};

export const logout = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' })
}