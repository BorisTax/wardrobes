import { MODULE_DETAILS_ROUTE } from "../../../types/routes";
import { MODULE_TABLE_NAMES, ModuleDetailsTableSchema } from "../../../types/schemas/moduleSchemas"
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

export async function getDetailsByModule(moduleId: number | undefined) {
    const res = (await getModuleDetails())
    const modules = res.data.filter(m => m.moduleId === moduleId)
    return {...res, data: modules}
}

export async function getModuleDetails() {
    const service = getDataBaseModuleService<ModuleDetailsTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.DETAILS, ["id", "name", "moduleId", "matIndex", "count", "length", "width", "grooveId", "commentId", "el1", "el2", "ew1", "ew2", "texture"], {})
}

export async function addModuleDetail(data: OmitId<ModuleDetailsTableSchema>) {
    const service = getDataBaseModuleService<ModuleDetailsTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.DETAILS, { ...data })
}

export async function removeModuleDetail(id: number) {
    const service = getDataBaseModuleService<ModuleDetailsTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.DETAILS, { id })
}

export async function updateModuleDetail(data: ModuleDetailsTableSchema) {
    const service = getDataBaseModuleService<ModuleDetailsTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.DETAILS, { id: data.id }, data)
}


router.get(MODULE_DETAILS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
    const { moduleId } = req.query
    const result = await getDetailsByModule(+(moduleId || 0));
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULE_DETAILS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name, moduleId, matIndex, length, width, count, grooveId, commentId, el1, el2, ew1, ew2, texture } = req.body as ModuleDetailsTableSchema
    const result = await addModuleDetail({ name, moduleId, matIndex, length, width, count, grooveId, commentId, el1, el2, ew1, ew2, texture });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_DETAILS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name, moduleId, matIndex, length, width, count, grooveId, commentId, el1, el2, ew1, ew2, texture} = req.body as ModuleDetailsTableSchema
    const result = await updateModuleDetail({ id, name, moduleId, matIndex, length, width, count, grooveId, commentId, el1, el2, ew1, ew2, texture });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULE_DETAILS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleDetail(id);
  result.message = result.message
  res.status(result.status).json(result)
});
