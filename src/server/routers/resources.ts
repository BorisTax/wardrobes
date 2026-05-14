import express from "express";
import { PERMISSION, RESOURCE, ResourceSchema } from "../../types/user";
import { MyRequest } from "../../types/server";
import { hasPermission } from "./users";
import { accessDenied } from "../functions/database";
import { getDataBaseUserService } from "../options";
import { USER_TABLE_NAMES } from "../../types/schemas/schemas";

const router = express.Router();
export default router

router.get("/", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getResources();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.post("/", async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.CREATE]))) return accessDenied(res)
    const { id, name } = req.body as ResourceSchema
    const result = await addResource({ id, name });
    res.status(result.status).json(result)
});
router.put("/", async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name } = req.body as ResourceSchema
    const result = await updateResource({ id, name });
    res.status(result.status).json(result)
});
router.delete("/", async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.USERS, [PERMISSION.DELETE]))) return accessDenied(res)
    const { id } = req.body as ResourceSchema
    const result = await deleteResource(id);
    res.status(result.status).json(result)
});


export async function getResources() {
    const service = getDataBaseUserService<ResourceSchema>()
    return await service.getData(USER_TABLE_NAMES.RESOURCES, ["id", "name"], {})
}

export async function addResource(data: ResourceSchema) {
    const service = getDataBaseUserService<ResourceSchema>()
    return await service.addData(USER_TABLE_NAMES.RESOURCES, data)
}
export async function updateResource(data: ResourceSchema) {
    const service = getDataBaseUserService<ResourceSchema>()
    return await service.updateData(USER_TABLE_NAMES.RESOURCES, { id: data.id }, data)
}
export async function deleteResource(id: number) {
    const service = getDataBaseUserService<ResourceSchema>()
    return await service.deleteData(USER_TABLE_NAMES.RESOURCES, { id })
}