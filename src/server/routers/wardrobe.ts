import express from "express";
import { MyRequest } from '../../types/server.js';
import { hasPermission } from "./users.js";
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { accessDenied } from "../functions/database.js";
import { getDetails } from "../wardrobes/specifications/corpus.js";
import { CONSOLE_TYPES_ROUTE, DETAIL_ROUTE, DETAILS_ROUTE, FURNITURE_TABLE_ROUTE, INITIAL_COMBISTATE_ROUTE, INITIAL_WARDROBEDATA_ROUTE, WARDROBE_DETAIL_TABLE_ROUTE, WARDROBE_KINDS_ROUTE, WARDROBE_TYPES_ROUTE } from "../../types/routes.js";
import { getInitialCombiState, getInitialWardrobeData, getWardrobes, getWardrobeTypes, getConsoleTypes, getDetail } from "./functions/wardrobe.js";
import { addDetailTable, deleteDetailTable, getAllDetailsFromTable, updateDetailTable } from "./functions/details.js";
import { addFurnitureTable, deleteFurnitureTable, getFurnitureTable, updateFurnitureTable } from "./functions/furniture.js";

const router = express.Router();
export default router

router.get(INITIAL_COMBISTATE_ROUTE, async (req, res) => {
  const result = await getInitialCombiState();
  res.json(result);
});

router.get(INITIAL_WARDROBEDATA_ROUTE, async (req, res) => {
  const result = await getInitialWardrobeData();
  res.json(result);
});

router.get(WARDROBE_KINDS_ROUTE, async (req, res) => {
  const result = await getWardrobes();
  res.json(result);
});
router.get(WARDROBE_TYPES_ROUTE, async (req, res) => {
  const result = await getWardrobeTypes();
  res.json(result);
});
router.get(CONSOLE_TYPES_ROUTE, async (req, res) => {
  const result = await getConsoleTypes();
  res.json(result);
});

router.get(DETAIL_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const { wardTypeId, wardrobeId, detailId, width, height } = req.query
  const result = await getDetail((wardTypeId ? +wardTypeId : 0), (wardrobeId ? +wardrobeId : 0), (detailId ? +detailId : 0), width ? (+width) : 0, height ? (+height) : 0)
  res.status(200).json({ success: true, data: [result] });
});

router.get(DETAILS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const { wardTypeId, wardrobeId, width, height, depth } = req.query
  const result = await getDetails((wardTypeId ? +wardTypeId : 0), (wardrobeId ? +wardrobeId : 0), width ? (+width) : 0, height ? (+height) : 0, depth ? (+depth) : 0)
  res.status(200).json({ success: true, data: result });
});

router.get(WARDROBE_DETAIL_TABLE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getAllDetailsFromTable()
  res.status(200).json({ success: true, data: result });
});

router.post(WARDROBE_DETAIL_TABLE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.READ]))) return accessDenied(res)
  const {token, ...data} = req.body
  const result = await addDetailTable(data)
  res.status(result.status).json(result);
});

router.put(WARDROBE_DETAIL_TABLE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.READ]))) return accessDenied(res)
  const {token, ...data} = req.body
  const result = await updateDetailTable(data)
  res.status(result.status).json(result);
});

router.delete(WARDROBE_DETAIL_TABLE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.READ]))) return accessDenied(res)
  const { id } = req.body
  const result = await deleteDetailTable(id)
  res.status(result.status).json(result);
});




router.get(FURNITURE_TABLE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getFurnitureTable()
  res.status(200).json({ success: true, data: result });
});

router.post(FURNITURE_TABLE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.READ]))) return accessDenied(res)
  const {token, ...data} = req.body
  const result = await addFurnitureTable(data)
  res.status(result.status).json(result);
});

router.put(FURNITURE_TABLE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.READ]))) return accessDenied(res)
  const {token, ...data} = req.body
  const result = await updateFurnitureTable(data)
  res.status(result.status).json(result);
});

router.delete(FURNITURE_TABLE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.READ]))) return accessDenied(res)
  const { id } = req.body
  const result = await deleteFurnitureTable(id)
  res.status(result.status).json(result);
});