import LandAd from '../models/LandAd'
import { Request, Response } from 'express'

export const getAllLands = async (req: Request, res: Response) => {
  const lands = await LandAd.find()
  res.json(lands)
}
export const getLandById = async (req: Request, res: Response) => {
  const land = await LandAd.findById(req.params._id)
  res.json(land)
}
export const createLand = async (req: Request, res: Response) => {
  const land = await LandAd.create(req.body)
  res.json(land)
}
export const updateLand = async (req: Request, res: Response) => {
  const land = await LandAd.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(land)
}
export const deleteLand = async (req: Request, res: Response) => {
  await LandAd.findByIdAndDelete(req.params._id)
  res.json({ message: 'Land deleted' })
}