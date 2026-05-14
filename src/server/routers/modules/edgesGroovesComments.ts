import { MODULE_COMMENTS_ROUTE, MODULE_CORRESPOND_ROUTE, MODULE_EDGES_ROUTE, MODULE_GROOVES_ROUTE, MODULE_MODULES_ROUTE } from "../../../types/routes";
import { MODULE_TABLE_NAMES, ModuleCorrespondTableSchema, ModuleDetailsTableSchema, ModuleEdgesTableSchema, ModuleGroupsTableSchema, ModuleModulesTableSchema, ModuleSeriesTableSchema } from "../../../types/schemas/moduleSchemas"
import { getDataBaseModuleService } from "../../options"
import express from "express";
import { hasPermission } from "../users";
import { MyRequest } from "../../../types/server";
import { PERMISSION, RESOURCE } from "../../../types/user";
import { accessDenied } from "../../functions/database";
import messages from "../../messages";
import { OmitId } from "../../../types/materials";
import { DefaultSchema, TABLE_NAMES } from "../../../types/schemas/schemas";

const router = express.Router();
export default router


export async function getModuleEdges() {
    const service = getDataBaseModuleService<ModuleEdgesTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.EDGES, ["id", "name", "thickness"], {})
}

export async function addModuleEdge(data: OmitId<ModuleEdgesTableSchema>) {
    const service = getDataBaseModuleService<ModuleEdgesTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.EDGES, { ...data })
}

export async function removeModuleEdge(id: number) {
    const service = getDataBaseModuleService<ModuleEdgesTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.EDGES, { id })
}

export async function updateModuleEdge(data: ModuleEdgesTableSchema) {
    const service = getDataBaseModuleService<ModuleEdgesTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.EDGES, { id: data.id }, data)
}



export async function getModuleIdNameData(table: TABLE_NAMES) {
    const service = getDataBaseModuleService<DefaultSchema>()
    return await service.getData(table, ["id", "name"], {})
}

export async function addModuleIdNameData(table: TABLE_NAMES, data: OmitId<DefaultSchema>) {
    const service = getDataBaseModuleService<DefaultSchema>()
    return await service.addData(table, { ...data })
}

export async function removeModuleIdNameData(table: TABLE_NAMES, id: number) {
    const service = getDataBaseModuleService<DefaultSchema>()
    return await service.deleteData(table, { id })
}

export async function updateModuleIdNameData(table: TABLE_NAMES, data: DefaultSchema) {
    const service = getDataBaseModuleService<DefaultSchema>()
    return await service.updateData(table, { id: data.id }, data)
}


router.get(MODULE_EDGES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
    const result = await getModuleEdges();
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULE_EDGES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name, thickness } = req.body as ModuleEdgesTableSchema
    const result = await addModuleEdge({ name, thickness });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_EDGES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name, thickness } = req.body as ModuleEdgesTableSchema
    const result = await updateModuleEdge({ id, name, thickness });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULE_EDGES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleEdge(id);
  result.message = result.message
  res.status(result.status).json(result)
});




router.get(MODULE_GROOVES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
    const result = await getModuleIdNameData(MODULE_TABLE_NAMES.GROOVES);
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULE_GROOVES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name } = req.body as DefaultSchema
    const result = await addModuleIdNameData(MODULE_TABLE_NAMES.GROOVES, { name });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_GROOVES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name } = req.body as DefaultSchema
    const result = await updateModuleIdNameData(MODULE_TABLE_NAMES.GROOVES, { id, name });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULE_GROOVES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleIdNameData(MODULE_TABLE_NAMES.GROOVES, id);
  result.message = result.message
  res.status(result.status).json(result)
});



router.get(MODULE_COMMENTS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
    const result = await getModuleIdNameData(MODULE_TABLE_NAMES.COMMENTS);
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULE_COMMENTS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name } = req.body as DefaultSchema
    const result = await addModuleIdNameData(MODULE_TABLE_NAMES.COMMENTS, { name });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_COMMENTS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name } = req.body as DefaultSchema
    const result = await updateModuleIdNameData(MODULE_TABLE_NAMES.COMMENTS, { id, name });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULE_COMMENTS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleIdNameData(MODULE_TABLE_NAMES.COMMENTS, id);
  result.message = result.message
  res.status(result.status).json(result)
});