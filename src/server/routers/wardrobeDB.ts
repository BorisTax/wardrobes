import express from "express";
import { accessDenied } from '../functions/other.js';
import { MyRequest, UserRoles } from '../../types/server.js';
import { specificationPath } from '../options.js';
import { isManagerAtLeast } from '../functions/user.js';
import { WARDROBE_KIND } from '../../types/wardrobe.js';
import SpecificationServiceSQLite from "../services/specificationServiceSQLite.js";

const router = express.Router();
export default router

router.post("/wardrobeTable", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { kind } = req.body
  const result = await getTable(kind);
  res.json(result);
});


export async function getTable(kind: WARDROBE_KIND) {
  const service = new SpecificationServiceSQLite(specificationPath)
  return await service.getDetailTable({ kind })
}


