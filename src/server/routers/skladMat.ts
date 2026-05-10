import express from "express";
import { PERMISSION, RESOURCE } from "../../types/user";
import { MyRequest } from "../../types/server";
import { CLEAR_ALL_STOL_SKLAD_ROUTE, MAT_INCOME_ROUTE, MAT_OUTCOME_ROUTE, MAT_COLORS_SKLAD_ROUTE, MAT_SKLAD_ROUTE, CLEAR_ALL_MAT_SKLAD_ROUTE, MAT_THICK_SKLAD_ROUTE } from "../../types/routes";
import { hasPermission } from "./users";
import { accessDenied } from "../functions/database";
import { addStol, clearStol, getStol, getStolColors, getStolIncome, getStolOutcome, removeStol } from "./functions/skladStol";
import messages from "../messages";
import { addMatSklad, clearMatSklad, getMatColorsSklad, getMatSklad, getMatSkladIncome, getMatSkladOutcome, getMatThickSklad, removeMatSklad } from "./functions/skladMat";
import { getUserName } from "../services/userService";

const router = express.Router();
export default router

router.get(MAT_COLORS_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMatColorsSklad();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});
router.get(MAT_THICK_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMatThickSklad();
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
  const { id, length, width, count } = req.body
const user = await getUserName((req as MyRequest).token)
  const result = await removeMatSklad({id, length, width, count}, user);
  result.message = (result.success && messages.SKLAD_MAT_DELETED) || result.message
  res.status(result.status).json(result)
});

router.post(MAT_SKLAD_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_MAT, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, length, width, count } = req.body
    const user = await getUserName((req as MyRequest).token)
    const result = await addMatSklad({ id, length, width, count }, user);
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