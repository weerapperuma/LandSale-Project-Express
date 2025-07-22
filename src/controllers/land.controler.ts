import { Request, Response } from 'express'
import * as db from '../db/mysql.service'
import { Land } from '../types/land'

export const getLands = async (req: Request, res: Response) => {
  const lands = await db.getAllLands()
  res.json(lands)
}

export const addLand = async (req: Request, res: Response) => {
  const land: Land = req.body
  await db.insertLand(land)
  res.status(201).json({ message: 'Land added' })
}
