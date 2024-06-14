import express from "express";
import { accessDenied } from '../functions/other.js';
import { MyRequest, UserRoles } from '../../types/server.js';
import { isManagerAtLeast } from '../functions/user.js';
import { getVerboseDSPData } from "../wardrobes/verbose.js";

const router = express.Router();
export default router

router.post("/dsp", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = await getVerboseDSPData(data)
  res.json({success: true, data: result});
});


