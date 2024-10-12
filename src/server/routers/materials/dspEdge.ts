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

export async function addDspEdge({ dspId, edgeId, zaglushkaId }: DSP_EDGE_ZAGL) {
  const materialService = new MaterialExtService<DSP_EDGE_ZAGL>(new DSPEdgeZaglServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if ((edges as DSP_EDGE_ZAGL[]).find(m => m.dspId === dspId)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ dspId, edgeId, zaglushkaId })
}

export async function updateDspEdge({ dspId, edgeId, zaglushkaId }: DSP_EDGE_ZAGL) {
  const materialService = new MaterialExtService<DSP_EDGE_ZAGL>(new DSPEdgeZaglServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as DSP_EDGE_ZAGL[]).find(m => m.dspId === dspId)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({ dspId, edgeId, zaglushkaId})
}

export async function deleteDspEdge(id: number) {
  const materialService = new MaterialExtService<DSP_EDGE_ZAGL>(new DSPEdgeZaglServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as DSP_EDGE_ZAGL[]).find(m => m.dspId === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtData(id)
}