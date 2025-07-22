import express from 'express'
import { getLands, addLand } from '../controllers/land.controler'
import { protect } from '../middleware/auth.middleware'

const router = express.Router()

router.get('/', getLands)
router.post('/', protect, addLand)

export default router
