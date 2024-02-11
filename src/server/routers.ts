import express from "express";
import userRouter from './routers/users.js'
import materialRouter from './routers/materials.js'

export const router = express.Router();

router.use('/users', userRouter)
router.use('/materials', materialRouter)