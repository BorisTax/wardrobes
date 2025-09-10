import express from "express";
import { PERMISSION, RESOURCE } from "../../types/user";
import { MyRequest } from "../../types/server";
import { CLEAR_ALL_STOL_SKLAD_ROUTE, INCOME_ROUTE, OUTCOME_ROUTE, STOL_COLORS_ROUTE, STOL_SKLAD_ROUTE } from "../../types/routes";
import { hasPermission } from "./users";
import { accessDenied } from "../functions/database";
import { addStol, clearStol, getStol, getStolColors, getStolIncome, getStolOutcome, removeStol } from "./functions/sklad";
import messages from "../messages";

const router = express.Router();
export default router

router.get(STOL_COLORS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_STOL, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getStolColors();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.get(STOL_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_STOL, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getStol();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.put(STOL_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_STOL, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, length, amount } = req.body
  const result = await removeStol({id, length, amount});
  result.message = (result.success && messages.SKLAD_STOL_DELETED) || result.message
  res.status(result.status).json(result)
});

router.post(STOL_SKLAD_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_STOL, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, length, amount } = req.body
    const result = await addStol({ id, length, amount });
    result.message = (result.success && messages.SKLAD_STOL_ADDED) || result.message
    res.status(result.status).json(result)
});


router.get(INCOME_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_STOL, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getStolIncome();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.get(OUTCOME_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_STOL, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getStolOutcome();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});



router.delete(CLEAR_ALL_STOL_SKLAD_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SKLAD_STOL, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id, length, amount } = req.body
  const result = await clearStol();
  result.message = result.message
  res.status(result.status).json(result)
});