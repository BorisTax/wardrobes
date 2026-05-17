import express from "express";
import userRouter from './routers/users.js'
import permissionRouter from './routers/permissions.js'
import resourceRouter from './routers/resources.js'
import materialRouter from './routers/materials.js'
import specificationRouter from './routers/specification.js'
import databaseRouter from './routers/database.js'
import templateRouter from './routers/templates.js'
import settingsRouter from './routers/settings.js'
import wardrobeRouter from './routers/wardrobe.js'
import skladStolRouter from './routers/skladStol.js'
import skladMatRouter from './routers/skladMat.js'

import moduleGroupsRouter from './routers/modules/groups_series.js'
import modulesRouter from './routers/modules/modules.js'
import moduleDetailsRouter from './routers/modules/details.js'
import moduleMaterialsRouter from './routers/modules/materials.js'
import moduleSerieMaterialsRouter from './routers/modules/serieMaterials.js'
import moduleMaterialCorrespondRouter from './routers/modules/materialsCorrespond.js'
import edgeGrooveCommentRouter from './routers/modules/edgesGroovesComments.js'

import { StatusCodes } from "http-status-codes";
import { USERS_ROUTE, PERMISSIONS_ROUTE, MATERIALS_ROUTE, TEMPLATES_ROUTE, SPECIFICATION_ROUTE, DATABASE_ROUTE, WARDROBE_ROUTE, VERSION_ROUTE, SKLAD_ROUTE, SETTINGS_ROUTE, MODULE_ROUTE, RESOURCES_ROUTE }  from '../types/routes';
export const router = express.Router();

router.use(USERS_ROUTE, userRouter)
router.use(USERS_ROUTE + PERMISSIONS_ROUTE, permissionRouter)
router.use(USERS_ROUTE + RESOURCES_ROUTE, resourceRouter)
router.use(MATERIALS_ROUTE, materialRouter)
router.use(TEMPLATES_ROUTE, templateRouter)
router.use(SPECIFICATION_ROUTE, specificationRouter)
router.use(DATABASE_ROUTE, databaseRouter)
router.use(WARDROBE_ROUTE, wardrobeRouter)
router.use(SETTINGS_ROUTE, settingsRouter)
router.use(SKLAD_ROUTE, skladStolRouter, skladMatRouter)
router.use(MODULE_ROUTE, moduleGroupsRouter, modulesRouter, moduleDetailsRouter, moduleMaterialsRouter,moduleMaterialCorrespondRouter, moduleSerieMaterialsRouter, edgeGrooveCommentRouter)
router.get(VERSION_ROUTE, (req, res) => {
    res.status(StatusCodes.OK).json({ success: true, data: [process.env.VERSION] })
})
