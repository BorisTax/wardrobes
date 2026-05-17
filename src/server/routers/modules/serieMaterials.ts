import { MODULE_SERIES_MATERIALS_ROUTE } from "../../../types/routes";
import { MODULE_TABLE_NAMES, ModuleSerieMaterialsTableSchema } from "../../../types/schemas/moduleSchemas"
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


export async function getModuleSerieMaterialsBySerie(serieId: number) {
    const res = (await getModuleSerieMaterials())
    const data = res.data.filter(m => m.serieId === serieId)
    return { ...res, data }
}

export async function getModuleSerieMaterials() {
    const service = getDataBaseModuleService<ModuleSerieMaterialsTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.SERIES_MATERIALS, ["id", "moduleId", "matIndex", "materialId", "serieId"], {})
}

export async function addModuleSerieMaterial(data: OmitId<ModuleSerieMaterialsTableSchema>) {
    const service = getDataBaseModuleService<ModuleSerieMaterialsTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.SERIES_MATERIALS, { ...data })
}

export async function removeModuleSerieMaterial(id: number) {
    const service = getDataBaseModuleService<ModuleSerieMaterialsTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.SERIES_MATERIALS, { id })
}

export async function updateModuleSerieMaterial(data: ModuleSerieMaterialsTableSchema) {
    const service = getDataBaseModuleService<ModuleSerieMaterialsTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.SERIES_MATERIALS, { id: data.id }, data)
}



router.get(MODULE_SERIES_MATERIALS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
    const { serieId } = req.query
    const result = await getModuleSerieMaterialsBySerie(+(serieId || 0));
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULE_SERIES_MATERIALS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { matIndex, materialId, serieId, moduleId } = req.body as ModuleSerieMaterialsTableSchema
    const result = await addModuleSerieMaterial({  matIndex, materialId, serieId, moduleId });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_SERIES_MATERIALS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, matIndex, materialId, serieId, moduleId} = req.body as ModuleSerieMaterialsTableSchema
    const result = await updateModuleSerieMaterial({ id, matIndex, materialId, serieId, moduleId });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULE_SERIES_MATERIALS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleSerieMaterial(id);
  result.message = result.message
  res.status(result.status).json(result)
});

