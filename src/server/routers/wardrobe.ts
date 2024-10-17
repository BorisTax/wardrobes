import express from "express";
import { MyRequest } from '../../types/server.js';
import { hasPermission } from "./users.js";
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { accessDenied } from "../functions/database.js";
import { getDetails } from "../wardrobes/specifications/corpus.js";
import { CONSOLE_TYPES_ROUTE, DETAIL_ROUTE, DETAILS_ROUTE, INITIAL_COMBISTATE_ROUTE, INITIAL_WARDROBEDATA_ROUTE, WARDROBE_KINDS_ROUTE, WARDROBE_TYPES_ROUTE } from "../../types/routes.js";
import { getInitialCombiState, getInitialWardrobeData, getWardobes, getWardrobeTypes, getConsoleTypes, getDetail } from "./functions/wardrobe.js";

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
  const result = await getWardobes();
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
  res.status(200).json({ success: true, data: result });
});

router.get(DETAILS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SPECIFICATION, [PERMISSION.READ]))) return accessDenied(res)
  const { wardTypeId, wardrobeId, width, height, depth } = req.query
  const result = await getDetails((wardTypeId ? +wardTypeId : 0), (wardrobeId ? +wardrobeId : 0), width ? (+width) : 0, height ? (+height) : 0, depth ? (+depth) : 0)
  res.status(200).json({ success: true, data: result });
});


