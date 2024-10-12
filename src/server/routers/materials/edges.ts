import messages from '../../messages.js'
import { materialsPath } from '../../options.js';
import EdgeServiceSQLite from '../../services/extServices/edgeServiceSQLite.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import { Edge, EdgeType, OmitId } from '../../../types/materials.js';
import { StatusCodes } from 'http-status-codes';
import EdgeTypeServiceSQLite from '../../services/extServices/edgeTypeServiceSQLite.js';

export async function getEdges() {
  const materialService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath))
  return await materialService.getExtData()
}

export async function addEdge({ name, code, typeId }: OmitId<Edge>) {
  const materialService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if ((edges as Edge[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ name, code, typeId })
}

export async function updateEdge({ id, name, code, typeId }: Edge) {
  const materialService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as Edge[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({ id, name, code, typeId })
}

export async function deleteEdge(id: number) {
  const materialService = new MaterialExtService<Edge>(new EdgeServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as Edge[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtData(id)
}

export async function getEdgeTypes() {
  const materialService = new MaterialExtService<EdgeType>(new EdgeTypeServiceSQLite(materialsPath))
  return await materialService.getExtData()
}