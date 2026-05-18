import express from "express";
import { PERMISSION, RESOURCE } from "../../types/user";
import { MyRequest } from "../../types/server";
import {  MAT_INCOME_ROUTE, MAT_OUTCOME_ROUTE, MAT_COLORS_SKLAD_ROUTE, MAT_SKLAD_ROUTE, CLEAR_ALL_MAT_SKLAD_ROUTE, MAT_THICK_SKLAD_ROUTE, MAT_DEPART_SKLAD_ROUTE } from "../../types/routes";
import { hasPermission } from "./users";
import { accessDenied } from "../functions/database";
import messages from "../messages";
import { addMatColorSklad, addMatSklad, addMatThickSklad, clearMatSklad, deleteMatColorSklad, deleteMatThickSklad, getMatColorsSklad, getMatDepartmentSklad, getMatSklad, getMatSkladIncome, getMatSkladOutcome, getMatThickSklad, removeMatSklad, updateMatColorSklad, updateMatThickSklad } from "./functions/skladMat";
import { MatSkladColorsTableSchema, MatSkladThicknessTableSchema } from "../../types/schemas/skladSchemas";
import { getUserByToken, getUserIdByToken } from "./functions/users";

const router = express.Router();
export default router

router.get(MAT_COLORS_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMatColorsSklad();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.post(MAT_COLORS_SKLAD_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.CREATE]))) return accessDenied(res)
    const { thickId, name } = req.body as MatSkladColorsTableSchema
    const result = await addMatColorSklad({ thickId, name });
    res.status(result.status).json(result)
});
router.put(MAT_COLORS_SKLAD_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, thickId, name } = req.body as MatSkladColorsTableSchema
    const result = await updateMatColorSklad({ id, thickId, name });
    res.status(result.status).json(result)
});
router.delete(MAT_COLORS_SKLAD_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.DELETE]))) return accessDenied(res)
    const { id } = req.body as MatSkladColorsTableSchema
    const result = await deleteMatColorSklad(id);
    res.status(result.status).json(result)
});

router.get(MAT_THICK_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMatThickSklad();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});
router.post(MAT_THICK_SKLAD_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name } = req.body as MatSkladThicknessTableSchema
    const result = await addMatThickSklad({ name });
    res.status(result.status).json(result)
});
router.put(MAT_THICK_SKLAD_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name } = req.body as MatSkladThicknessTableSchema
    const result = await updateMatThickSklad({ id, name });
    res.status(result.status).json(result)
});
router.delete(MAT_THICK_SKLAD_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.DELETE]))) return accessDenied(res)
    const { id } = req.body as MatSkladThicknessTableSchema
    const result = await deleteMatThickSklad(id);
    res.status(result.status).json(result)
});



router.get(MAT_DEPART_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMatDepartmentSklad();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});
router.get(MAT_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMatSklad();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.put(MAT_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, length, width, count, department } = req.body
  const user = await getUserByToken((req as MyRequest).token as string)
  const result = await removeMatSklad({id, length, width, count, department}, user?.name || "");
  result.message = (result.success && messages.SKLAD_MAT_DELETED) || result.message
  res.status(result.status).json(result)
});

router.post(MAT_SKLAD_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, length, width, count, department} = req.body
    const user = await getUserByToken((req as MyRequest).token as string)
    const result = await addMatSklad({ id, length, width, count, department }, user?.name || "");
    result.message = (result.success && messages.SKLAD_MAT_ADDED) || result.message
    res.status(result.status).json(result)
});


router.get(MAT_INCOME_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMatSkladIncome();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.get(MAT_OUTCOME_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMatSkladOutcome();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});



router.delete(CLEAR_ALL_MAT_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id, length, amount } = req.body
  const result = await clearMatSklad();
  result.message = result.message
  res.status(result.status).json(result)
});