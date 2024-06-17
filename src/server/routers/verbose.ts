import express from "express";
import { accessDenied } from '../functions/other.js';
import { MyRequest, UserRoles } from '../../types/server.js';
import { isManagerAtLeast } from '../functions/user.js';
import { getConfirmat, getDSP, getDVP, getDVPPlanka, getEdge05, getEdge2, getGlue, getKarton, getLegs, getMinifix, getNails } from "../wardrobes/functions.js";
import { newFasadFromState } from "../../functions/fasades.js";
import FasadState from "../../classes/FasadState.js";
import { getFasadSpecification } from "../wardrobes/specifications/fasades.js";
import { MaterialService } from "../services/materialService.js";
import { FasadMaterial } from "../../types/enums.js";
import { ExtMaterial } from "../../types/materials.js";
import { materialServiceProvider } from "../options.js";

const router = express.Router();
export default router

router.post("/dsp", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getDSP(data)).verbose
  res.json({success: true, data: result});
});

router.post("/dvp", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getDVP(data)).verbose
  res.json({success: true, data: result});
});
router.post("/dvpplanka", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getDVPPlanka(data)).verbose
  res.json({success: true, data: result});
});
router.post("/edge2", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = ((await getEdge2(data)).verbose)
  res.json({success: true, data: result});
});
router.post("/edge05", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getEdge05(data)).verbose
  res.json({success: true, data: result});
});
router.post("/glue", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getGlue(data)).verbose
  res.json({success: true, data: result});
});
router.post("/legs", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getLegs(data)).verbose
  res.json({success: true, data: result});
});
router.post("/confirmat", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getConfirmat(data)).verbose
  res.json({success: true, data: result});
});
router.post("/minifix", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getMinifix(data)).verbose
  res.json({success: true, data: result});
});

router.post("/karton", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getKarton(data)).verbose
  res.json({success: true, data: result});
});
router.post("/nails", async (req: MyRequest, res) => {
  if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { data } = req.body
  const result = (await getNails(data)).verbose
  res.json({success: true, data: result});
});

// router.post("/dsp10", async (req: MyRequest, res) => {
//   if (!isManagerAtLeast(req.userRole as UserRoles)) return accessDenied(res)
//   const { data } = req.body
//   const matService = new MaterialService(materialServiceProvider)
//   const materials = (await matService.getExtMaterials({ material: FasadMaterial.DSP, name: "", code: "" })).data as ExtMaterial[]
//   const fasad = newFasadFromState(data)
//   const dsp10 = (await calcDSP10(fasad, materials))
//   res.json({success: true, data: result});
// });