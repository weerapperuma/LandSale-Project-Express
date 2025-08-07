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
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IUser>('User', userSchema)
