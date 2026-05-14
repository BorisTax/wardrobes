import { MODULE_GROUPS_ROUTE, MODULE_SERIES_ROUTE } from "../../../types/routes";
import { MODULE_TABLE_NAMES, ModuleGroupsTableSchema, ModuleSeriesTableSchema } from "../../../types/schemas/moduleSchemas"
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

export async function getModuleGroups() {
    const service = getDataBaseModuleService<ModuleGroupsTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.GROUPS, ["id", "name"], {})
}

export async function addModuleGroup(data: OmitId<ModuleGroupsTableSchema>) {
    const service = getDataBaseModuleService<ModuleGroupsTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.GROUPS, { ...data })
}

export async function removeModuleGroup(id: number) {
    const service = getDataBaseModuleService<ModuleGroupsTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.GROUPS, { id })
}

export async function updateModuleGroup(data: ModuleGroupsTableSchema) {
    const service = getDataBaseModuleService<ModuleGroupsTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.GROUPS, { id: data.id }, data)
}

export async function getModuleSeries() {
    const service = getDataBaseModuleService<ModuleSeriesTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.SERIES, ["id", "name", "groupId"], {})
}

export async function addModuleSerie(data: OmitId<ModuleSeriesTableSchema>) {
    const service = getDataBaseModuleService<ModuleSeriesTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.SERIES, { ...data })
}

export async function removeModuleSerie(id: number) {
    const service = getDataBaseModuleService<ModuleSeriesTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.SERIES, { id })
}

export async function updateModuleSerie(data: ModuleSeriesTableSchema) {
    const service = getDataBaseModuleService<ModuleSeriesTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.SERIES, { id: data.id }, data)
}


router.get(MODULE_GROUPS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getModuleGroups();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.post(MODULE_GROUPS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name} = req.body
    const result = await addModuleGroup({ name });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_GROUPS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, name } = req.body
  const result = await updateModuleGroup({id, name});
  result.message = (result.success && messages.DATA_UPDATED) || result.message
  res.status(result.status).json(result)
});

router.delete(MODULE_GROUPS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleGroup(id);
  result.message = result.message
  res.status(result.status).json(result)
});


router.get(MODULE_SERIES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getModuleSeries();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.post(MODULE_SERIES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name, groupId} = req.body
    const result = await addModuleSerie({ name, groupId });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULE_SERIES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, name, groupId } = req.body
  const result = await updateModuleSerie({id, name, groupId});
  result.message = (result.success && messages.DATA_UPDATED) || result.message
  res.status(result.status).json(result)
});

router.delete(MODULE_SERIES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULES, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleSerie(id);
  result.message = result.message
  res.status(result.status).json(result)
});