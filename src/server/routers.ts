import express from "express";
import userRouter from './routers/users.js'
import materialRouter from './routers/materials.js'
import priceRouter from './routers/prices.js'
import databaseRouter from './routers/database.js'

export const router = express.Router();

router.use('/users', userRouter)
router.use('/materials', materialRouter)
router.use('/prices', priceRouter)
router.use('/database', databaseRouter)
router.get('/version', (req, res) => {
    res.status(200).json({ success: true, data: "0.1.9" })
})