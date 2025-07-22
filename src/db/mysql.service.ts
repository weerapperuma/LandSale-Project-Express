import { db } from '../config/db'
import { Land } from '../types/land'

export const getAllLands = async (): Promise<Land[]> => {
  const [rows] = await db.query('SELECT * FROM lands')
  return rows as Land[]
}

export const insertLand = async (land: Land): Promise<void> => {
  const { title, description, price, location, image, listedDate } = land
  await db.query(
    'INSERT INTO lands (title, description, price, location, image, listedDate) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, price, location, image, listedDate]
  )
}
