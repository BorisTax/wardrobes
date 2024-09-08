import messages from '../../messages.js'
import { materialsPath } from '../../options.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import { DSP_EDGE_ZAGL } from '../../../types/materials.js';
import { StatusCodes } from 'http-status-codes';
import DSPEdgeZaglServiceSQLite from '../../services/extServices/DSPEdgeZaglServiceSQLite.js';

export async function getDspEdges() {
  const materialService = new MaterialExtService<DSP_EDGE_ZAGL>(new DSPEdgeZaglServiceSQLite(materialsPath))
  return await materialService.getExtData()
}

export async function addDspEdge({ name, edge, zaglushka }: DSP_EDGE_ZAGL) {
  const materialService = new MaterialExtService<DSP_EDGE_ZAGL>(new DSPEdgeZaglServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if ((edges as DSP_EDGE_ZAGL[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ name, edge, zaglushka })
}

export async function updateDspEdge({ name, edge, zaglushka }: DSP_EDGE_ZAGL) {
  const materialService = new MaterialExtService<DSP_EDGE_ZAGL>(new DSPEdgeZaglServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as DSP_EDGE_ZAGL[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({ newName: "", name, edge, zaglushka})
}

export async function deleteDspEdge(name: string) {
  const materialService = new MaterialExtService<DSP_EDGE_ZAGL>(new DSPEdgeZaglServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as DSP_EDGE_ZAGL[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtData(name)
}