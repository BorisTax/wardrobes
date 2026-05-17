import { MODULE_COLORS_ROUTE, MODULE_FILM_ROUTE, MODULE_MAT_BASE_ROUTE, MODULE_MATERIALS_ROUTE } from "../../../types/routes";
import { MODULE_TABLE_NAMES, ModuleColorsTableSchema, ModuleFilmTableSchema, ModuleMatBaseTableSchema, ModuleMaterialsTableSchema } from "../../../types/schemas/moduleSchemas"
import { getDataBaseModuleService } from "../../options"
import express from "express";
import { hasPermission } from "../users";
import { MyRequest } from "../../../types/server";
import { PERMISSION, RESOURCE } from "../../../types/user";
import { accessDenied } from "../../functions/database";
import messages from "../../messages";
import { OmitId } from "../../../types/materials";

const router = express.Router();
export default router

export async function getModuleMatBases() {
    const service = getDataBaseModuleService<ModuleMatBaseTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.MAT_BASE, ["id", "name", "code", "thickness"], {})
}

export async function addModuleMatBase(data: OmitId<ModuleMatBaseTableSchema>) {
    const service = getDataBaseModuleService<ModuleMatBaseTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.MAT_BASE, { ...data })
}

export async function removeModuleMatBase(id: number) {
    const service = getDataBaseModuleService<ModuleMatBaseTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.MAT_BASE, { id })
}

export async function updateModuleMatBase(data: ModuleMatBaseTableSchema) {
    const service = getDataBaseModuleService<ModuleMatBaseTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.MAT_BASE, { id: data.id }, data)
}

export async function getModuleMatColors() {
    const service = getDataBaseModuleService<ModuleColorsTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.COLORS, ["id", "name", "code", "texture"], {})
}

export async function addModuleMatColor(data: OmitId<ModuleColorsTableSchema>) {
    const service = getDataBaseModuleService<ModuleColorsTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.COLORS, { ...data })
}

export async function removeModuleMatColor(id: number) {
    const service = getDataBaseModuleService<ModuleColorsTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.COLORS, { id })
}

export async function updateModuleMatColor(data: ModuleColorsTableSchema) {
    const service = getDataBaseModuleService<ModuleColorsTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.COLORS, { id: data.id }, data)
}


export async function getModuleMaterials() {
    const service = getDataBaseModuleService<ModuleMaterialsTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.MATERIALS, ["id", "baseId", "colorId", "length", "width", "shortName"], {})
}

export async function addModuleMaterial(data: OmitId<ModuleMaterialsTableSchema>) {
    const service = getDataBaseModuleService<ModuleMaterialsTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.MATERIALS, { ...data })
}

export async function removeModuleMaterial(id: number) {
    const service = getDataBaseModuleService<ModuleMaterialsTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.MATERIALS, { id })
}

export async function updateModuleMaterial(data: ModuleMaterialsTableSchema) {
    const service = getDataBaseModuleService<ModuleMaterialsTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.MATERIALS, { id: data.id }, data)
}


export async function getModuleFilms() {
    const service = getDataBaseModuleService<ModuleFilmTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.FILM, ["id", "materialId", "glossy"], {})
}

export async function addModuleFilm(data: OmitId<ModuleFilmTableSchema>) {
    const service = getDataBaseModuleService<ModuleFilmTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.FILM, { ...data })
}

export async function removeModuleFilm(id: number) {
    const service = getDataBaseModuleService<ModuleFilmTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.FILM, { id })
}

export async function updateModuleFilm(data: ModuleFilmTableSchema) {
    const service = getDataBaseModuleService<ModuleFilmTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.FILM, { id: data.id }, data)
}



router.get(MODULE_MAT_BASE_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
    const result = await getModuleMatBases();
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULE_MAT_BASE_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name, thickness, code } = req.body as ModuleMatBaseTableSchema
    const result = await addModuleMatBase({ name, thickness, code });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_MAT_BASE_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name, thickness, code} = req.body as ModuleMatBaseTableSchema
    const result = await updateModuleMatBase({ id, name, code, thickness });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULE_MAT_BASE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleMatBase(id);
  result.message = result.message
  res.status(result.status).json(result)
});



router.get(MODULE_COLORS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
    const result = await getModuleMatColors();
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULE_COLORS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name, code, texture } = req.body as ModuleColorsTableSchema
    const result = await addModuleMatColor({ name, texture, code });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_COLORS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name, texture, code} = req.body as ModuleColorsTableSchema
    const result = await updateModuleMatColor({ id, name, code, texture });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULE_COLORS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleMatColor(id);
  result.message = result.message
  res.status(result.status).json(result)
});


router.get(MODULE_MATERIALS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
    const result = await getModuleMaterials();
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULE_MATERIALS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { baseId, colorId, length, width, shortName } = req.body as ModuleMaterialsTableSchema
    const result = await addModuleMaterial({ baseId, colorId, length, width, shortName});
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_MATERIALS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, baseId, colorId, length, width, shortName} = req.body as ModuleMaterialsTableSchema
    const result = await updateModuleMaterial({ id, baseId, colorId, length, width, shortName });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULE_MATERIALS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleMaterial(id);
  result.message = result.message
  res.status(result.status).json(result)
});



router.get(MODULE_FILM_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
    const result = await getModuleFilms();
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULE_FILM_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const {materialId, glossy} = req.body as ModuleFilmTableSchema
    const result = await addModuleFilm({ materialId, glossy});
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_FILM_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, materialId, glossy} = req.body as ModuleFilmTableSchema
    const result = await updateModuleFilm({ id, materialId, glossy });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULE_FILM_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleFilm(id);
  result.message = result.message
  res.status(result.status).json(result)
});