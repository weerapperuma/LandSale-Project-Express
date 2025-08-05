import mongoose, { Schema, model } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  address: string
  passwordHash: string
  role: 'USER' | 'ADMIN'
  phoneNumber: string
  createdAt: Date
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
})

export default mongoose.model<IUser>('User', userSchema)
