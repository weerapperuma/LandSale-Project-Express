import express from 'express'
import { deleteLand, updateLand, getAllLands, getLandById, createLand } from '../controllers/land.controller'

const router = express.Router()

router.get('/getalllands', getAllLands)
router.get('/getlandbyid/:id', getLandById)
router.post('/createland', createLand)
router.put('/updateland/:id', updateLand)
router.delete('/deleteland/:id', deleteLand)
export default router
