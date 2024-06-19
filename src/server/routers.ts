import express from "express";
import userRouter from './routers/users.js'
import materialRouter from './routers/materials.js'
import priceRouter from './routers/prices.js'
import specificationRouter from './routers/specification.js'
import databaseRouter from './routers/database.js'
import templateRouter from './routers/templates.js'
import wardrobeRouter from './routers/wardrobe.js'
export const router = express.Router();

router.use('/users', userRouter)
router.use('/materials', materialRouter)
router.use('/templates', templateRouter)
router.use('/specification', specificationRouter)
router.use('/prices', priceRouter)
router.use('/database', databaseRouter)
router.use('/wardrobe', wardrobeRouter)
router.get('/version', (req, res) => {
    res.status(200).json({ success: true, data: "0.2.1" })
})
