import messages from '../../messages.js'
import { materialsPath } from '../../options.js';
import EdgeServiceSQLite from '../../services/extServices/edgeServiceSQLite.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import { Edge, NewEdge } from '../../../types/materials.js';
import { StatusCodes } from 'http-status-codes';

export async function getEdges() {
  const materialService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath))
  return await materialService.getExtData()
}

export async function addEdge({ name, dsp, code }: Edge) {
  const materialService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if ((edges as Edge[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ name, dsp, code })
}

export async function updateEdge({ name, newName, dsp, code }: NewEdge) {
  const materialService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as Edge[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({ name, dsp, newName, code })
}

export async function deleteEdge(name: string) {
  const materialService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as Edge[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtData(name)
}