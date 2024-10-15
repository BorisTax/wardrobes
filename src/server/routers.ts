import express from "express";
import userRouter from './routers/users.js'
import permissionRouter from './routers/permissions.js'
import materialRouter from './routers/materials.js'
import specificationRouter from './routers/specification.js'
import databaseRouter from './routers/database.js'
import templateRouter from './routers/templates.js'
import wardrobeRouter from './routers/wardrobe.js'
import { StatusCodes } from "http-status-codes";
import { USERS_ROUTE, PERMISSIONS_ROUTE, MATERIALS_ROUTE, TEMPLATES_ROUTE, SPECIFICATION_ROUTE, PRICES_ROUTE, DATABASE_ROUTE, WARDROBE_ROUTE, VERSION_ROUTE }  from '../types/routes';
export const router = express.Router();

router.use(USERS_ROUTE, userRouter)
router.use(USERS_ROUTE + PERMISSIONS_ROUTE, permissionRouter)
router.use(MATERIALS_ROUTE, materialRouter)
router.use(TEMPLATES_ROUTE, templateRouter)
router.use(SPECIFICATION_ROUTE, specificationRouter)
router.use(DATABASE_ROUTE, databaseRouter)
router.use(WARDROBE_ROUTE, wardrobeRouter)
router.get(VERSION_ROUTE, (req, res) => {
    res.status(StatusCodes.OK).json({ success: true, data: process.env.VERSION })
})
