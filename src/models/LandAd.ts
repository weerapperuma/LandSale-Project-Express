import mongoose, { Schema, Document } from 'mongoose'

export interface ILandAd extends Document {
  title: string
  description: string
  district: string
  city: string
  price: number
  size: number
  images: string[]
  isApproved: boolean
  userId: string
  createdAt: Date
}

const landAdSchema = new Schema<ILandAd>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: Number, required: true },
  images: { type: [String], required: false },
  isApproved: { type: Boolean, default: false },
  userId: { type: String, required: true },
}, { timestamps: true }
)

export default mongoose.model<ILandAd>('LandAd', landAdSchema)
