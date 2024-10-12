import path from 'path'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/database.js';
import { addProfile, deleteProfile, getProfiles, updateProfile } from './materials/profiles.js';
import { addExtMaterial, deleteExtMaterial, getExtMaterials, getImage, getMaterialTypes, updateExtMaterial } from './materials/extMaterials.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { addEdge, deleteEdge, getEdges, getEdgeTypes, updateEdge } from './materials/edges.js';
import { addZaglushka, deleteZaglushka, getZaglushkas, updateZaglushka } from './materials/zaglushka.js';
import { addBrush, deleteBrush, getBrushes } from './materials/brush.js';
import { addTrempel, deleteTrempel, getTrempels, updateTrempel } from './materials/trempel.js';
import { addUplotnitel, deleteUplotnitel, getUplotnitels, updateUplotnitel } from './materials/uplotnitel.js';
import { hasPermission } from './users.js';
import { StatusCodes } from 'http-status-codes';
import { addDspEdge, deleteDspEdge, getDspEdges, updateDspEdge } from './materials/dspEdge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/profile", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getProfiles();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/profile", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  let result
  result = await deleteProfile(id);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/profile", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name, type, code, brushId } = req.body
  const result = await addProfile({ name, type, code, brushId });
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/profile", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, name, type, code, brushId } = req.body
  const result = await updateProfile({ id, name, type, code, brushId });
  res.status(result.status).json(result);
});


router.get("/material_types", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getMaterialTypes();
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});
router.get("/material", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getExtMaterials({});
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.delete("/material", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await deleteExtMaterial(id);
  res.status(result.status).json(result)
});

router.post("/material", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name, material, code, image, purpose } = req.body
  const result = await addExtMaterial({ name, type: material, image, code, purpose });
  res.status(result.status).json(result)
});

router.put("/material", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, name, material, code, image, purpose } = req.body
  const result = await updateExtMaterial({ id, name, type: material, code, image, purpose });
  res.status(result.status).json(result);
});

router.post("/image", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const { id } = req.body
  const result = await getImage(id);
  if (!result.success) return res.sendStatus(result.status)
  res.status(result.status).json(result);
});

router.get("/edgetypes", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getEdgeTypes();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});

router.get("/edge", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getEdges();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/edge", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { name } = req.body
  let result
  result = await deleteEdge(name);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/edge", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name, code, typeId } = req.body
  const result = await addEdge({ name, code, typeId });
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/edge", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, name, typeId, code } = req.body
  const result = await updateEdge({ id, name, typeId, code });
  res.status(result.status).json(result);
});

router.get("/dsp_edge", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getDspEdges();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});

router.delete("/dsp_edge", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  let result
  result = await deleteDspEdge(id);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/dsp_edge", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const { matId, edgeId, zaglushkaId } = req.body
  const result = await addDspEdge({ matId, edgeId, zaglushkaId });
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/dsp_edge", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { matId, edgeId, zaglushkaId } = req.body
  const result = await updateDspEdge({ matId, edgeId, zaglushkaId });
  res.status(result.status).json(result);
});

router.get("/zaglushka", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getZaglushkas();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/zaglushka", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  let result
  result = await deleteZaglushka(id);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/zaglushka", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name, code } = req.body
  const result = await addZaglushka({ name, code });
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/zaglushka", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, name, code } = req.body
  const result = await updateZaglushka({ id, name, code });
  res.status(result.status).json(result);
});

router.get("/brush", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getBrushes();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});

router.delete("/brush", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  let result
  result = await deleteBrush(id);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/brush", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name, code } = req.body
  const result = await addBrush({ name, code });
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});


router.get("/trempel", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getTrempels();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/trempel", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  let result
  result = await deleteTrempel(id);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/trempel", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name, caption, code } = req.body
  const result = await addTrempel({ name, code, caption });
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/trempel", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, name, caption, code } = req.body
  const result = await updateTrempel({ id, name, caption, code });
  res.status(result.status).json(result);
});


router.get("/uplotnitel", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS, [PERMISSION.READ]))) return accessDenied(res)
  const result = await getUplotnitels();
  if (!result.success) return res.json(result)
  res.status(result.status).json(result);
});
router.delete("/uplotnitel", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  let result
  result = await deleteUplotnitel(id);
  const status = result.success ? StatusCodes.OK : StatusCodes.NOT_FOUND
  res.status(status).json(result);  
});

router.post("/uplotnitel", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.CREATE]))) return accessDenied(res)
  const { name, code } = req.body
  const result = await addUplotnitel({ name, code });
  const status = result.success ? StatusCodes.CREATED : StatusCodes.CONFLICT
  res.status(status).json(result);
});

router.put("/uplotnitel", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MATERIALS_DB, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, name, code } = req.body
  const result = await updateUplotnitel({ id, name, code });
  res.status(result.status).json(result);
});