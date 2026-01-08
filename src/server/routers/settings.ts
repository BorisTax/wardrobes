import express from "express";
import { accessDenied } from '../functions/database.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { hasPermission } from './users.js';
import { getThemes, setTheme } from "./functions/settings.js";

const router = express.Router();
export default router

router.put("/theme", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SETTINGS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id } = req.body
  const result = await setTheme(id)
  res.status(result.status).json(result);
});

router.get("/themes", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SETTINGS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getThemes()
  res.status(result.status).json(result);
});
