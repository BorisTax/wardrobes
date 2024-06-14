import express from "express";
import { accessDenied } from '../functions/other.js';
import { MyRequest, UserRoles } from '../../types/server.js';
import { isManagerAtLeast } from '../functions/user.js';
import { getVerboseDSPData, getVerboseDVPData, getVerboseEdge05Data, getVerboseEdge2Data, getVerboseGlueData, getVerboseLegData } from "../wardrobes/verbose.js";

const router = express.Router();
export default router

router.post("/dsp", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getVerboseDSPData(data)
  res.json({success: true, data: result});
});

router.post("/dvp", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getVerboseDVPData(data)
  res.json({success: true, data: result});
});
router.post("/edge2", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getVerboseEdge2Data(data)
  res.json({success: true, data: result});
});
router.post("/edge05", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getVerboseEdge05Data(data)
  res.json({success: true, data: result});
});
router.post("/glue", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getVerboseGlueData(data)
  res.json({success: true, data: result});
});
router.post("/legs", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getVerboseLegData(data)
  res.json({success: true, data: result});
});