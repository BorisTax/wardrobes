import path from 'path'
import express from "express";
import { accessDenied } from '../functions/database.js';
import { addProfile, deleteProfile, getProfiles, getProfileTypes, updateProfile } from './functions/profiles.js';
import { addChar, deleteChar, getChars, getImage, getMaterialTypes, updateChar } from './functions/chars.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { hasPermission } from './users.js';
import { StatusCodes } from 'http-status-codes';
import { addDspKromkaZag, deleteDspKromkaZag, getDspKromkaZag, updateDspKromkaZag } from './functions/dspEdgeZag.js';
import { CHARS_ROUTE, DSP_KROMKA_ZAG_ROUTE, IMAGE_ROUTE, FASAD_TYPES_ROUTE, PROFILE_TYPES_ROUTE, PROFILES_ROUTE, ALLDATA_ROUTE } from '../../types/routes.js';
import { getAllData } from './functions/materials.js';

const router = express.Router();
export default router


router.get(ALLDATA_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getAllData();
  res.status(200).json({ success: true, data: [result] });
});

router.get(PROFILE_TYPES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getProfileTypes();
  res.status(200).json({ success: true, data: result });
});

router.get(PROFILES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getProfiles();
  res.status(200).json(result);
});

router.delete(PROFILES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  let result
  result = await deleteProfile(id);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post(PROFILES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const profile = req.body
  const result = await addProfile(profile);
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put(PROFILES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const profile = req.body
  const result = await updateProfile(profile);
  res.status(result.status).json(result);
});


router.get(FASAD_TYPES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMaterialTypes();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.get(CHARS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getChars();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.delete(CHARS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await deleteChar(id);
  res.status(result.status).json(result)
});

router.post(CHARS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const data = req.body
  const result = await addChar(data);
  res.status(result.status).json(result)
});

router.put(CHARS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const data = req.body
  const result = await updateChar(data);
  res.status(result.status).json(result);
});

router.post(IMAGE_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const { id } = req.body
  const result = await getImage(id);
  res.status(200).json({success: true, data: [result]});
});

router.get(DSP_KROMKA_ZAG_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getDspKromkaZag();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});

router.delete(DSP_KROMKA_ZAG_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  let result
  result = await deleteDspKromkaZag(id);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post(DSP_KROMKA_ZAG_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const data = req.body
  const result = await addDspKromkaZag(data);
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put(DSP_KROMKA_ZAG_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const data = req.body
  const result = await updateDspKromkaZag(data);
  res.status(result.status).json(result);
});
