import messages from '../../messages.js'
import { MaterialService } from '../../services/materialService.js';
import { Edge, NewEdge } from '../../types/materials.js';
import { materialServiceProvider } from '../../options.js';

export async function getEdges() {
  const materialService = new MaterialService(materialServiceProvider)
  return await materialService.getEdges()
}

export async function addEdge({ name, dsp, code }: Edge) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getEdges()
  if (!result.success) return result
  const edges = result.data
  if ((edges as Edge[]).find(m => m.name === name)) return { success: false, status: 409, message: messages.EDGE_EXIST }
  return await materialService.addEdge({ name, dsp, code })
}

export async function updateEdge({ name, newName, dsp, code }: NewEdge) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getEdges()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as Edge[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.EDGE_NO_EXIST }
  return await materialService.updateEdge({ name, dsp, newName, code })
}

export async function deleteEdge(name: string) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getEdges()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as Edge[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.EDGE_NO_EXIST }
  return await materialService.deleteEdge(name)
}