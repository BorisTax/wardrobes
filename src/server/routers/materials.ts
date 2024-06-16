import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/other.js';
import { isEditorAtLeast } from '../functions/user.js';
import { addProfile, deleteProfile, getProfiles, updateProfile } from './materials/profiles.js';
import { addExtMaterial, deleteExtMaterial, getExtMaterials, updateExtMaterial } from './materials/extMaterials.js';
import { MyRequest, UserRoles } from '../../types/server.js';
import { addEdge, deleteEdge, getEdges, updateEdge } from './materials/edges.js';
import { addZaglushka, deleteZaglushka, getZaglushkas, updateZaglushka } from './materials/zaglushka.js';
import { addBrush, deleteBrush, getBrushes, updateBrush } from './materials/brush.js';
import { addTrempel, deleteTrempel, getTrempels, updateTrempel } from './materials/trempel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/profile", async (req, res) => {
  const result = await getProfiles();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/profile", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, type } = req.body
  let result
  result = await deleteProfile(name, type);
  const status = result.success ? 200 : 404
  res.status(status).json(result);  
});

router.post("/profile", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, type, code, brush } = req.body
  const result = await addProfile({ name, type, code, brush });
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/profile", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, type, newName, code, brush } = req.body
  const result = await updateProfile({ name, type, newName, code, brush });
  res.status(result.status).json(result);
});


router.get("/material", async (req, res) => {
  const result = await getExtMaterials({});
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.delete("/material", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, material } = req.body
  const result = await deleteExtMaterial(name, material);
  res.status(result.status).json(result)
});

router.post("/material", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, material, code, image, purpose } = req.body
  const result = await addExtMaterial({ name, material, image, code, purpose });
  res.status(result.status).json(result)
});

router.put("/material", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, material, newName, code, image, purpose } = req.body
  const result = await updateExtMaterial({ name, material, newName, image, code, purpose });
  res.status(result.status).json(result);
});


router.get("/edge", async (req, res) => {
  const result = await getEdges();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/edge", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name } = req.body
  let result
  result = await deleteEdge(name);
  const status = result.success ? 200 : 404
  res.status(status).json(result);  
});

router.post("/edge", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, dsp, code } = req.body
  const result = await addEdge({ name, dsp, code });
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/edge", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, dsp, newName, code } = req.body
  const result = await updateEdge({ name, dsp, newName, code });
  res.status(result.status).json(result);
});


router.get("/zaglushka", async (req, res) => {
  const result = await getZaglushkas();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/zaglushka", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name } = req.body
  let result
  result = await deleteZaglushka(name);
  const status = result.success ? 200 : 404
  res.status(status).json(result);  
});

router.post("/zaglushka", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, dsp, code } = req.body
  const result = await addZaglushka({ name, dsp, code });
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/zaglushka", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, dsp, newName, code } = req.body
  const result = await updateZaglushka({ name, dsp, newName, code });
  res.status(result.status).json(result);
});

router.get("/brush", async (req, res) => {
  const result = await getBrushes();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/brush", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name } = req.body
  let result
  result = await deleteBrush(name);
  const status = result.success ? 200 : 404
  res.status(status).json(result);  
});

router.post("/brush", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, code } = req.body
  const result = await addBrush({ name, code });
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/trempel", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, newName, code } = req.body
  const result = await updateTrempel({ name, newName, code });
  res.status(result.status).json(result);
});

router.get("/trempel", async (req, res) => {
  const result = await getTrempels();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/trempel", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name } = req.body
  let result
  result = await deleteTrempel(name);
  const status = result.success ? 200 : 404
  res.status(status).json(result);  
});

router.post("/trempel", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, code } = req.body
  const result = await addTrempel({ name, code });
  const status = result.success ? 201 : 409
  res.status(status).json(result);
});

router.put("/trempel", async (req: MyRequest, res) => {
  if (!isEditorAtLeast(req.userRole as UserRoles)) return accessDenied(res)
  const { name, newName, code } = req.body
  const result = await updateTrempel({ name, newName, code });
  res.status(result.status).json(result);
});