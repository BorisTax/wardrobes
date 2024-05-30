import messages from '../../messages.js'
import { MaterialService } from '../../services/materialService.js';
import { Brush, NewBrush } from '../../types/materials.js';
import { materialServiceProvider } from '../../options.js';

export async function getBrushes() {
  const materialService = new MaterialService(materialServiceProvider)
  return await materialService.getBrushes()
}

export async function addBrush({ name, code }: Brush) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getBrushes()
  if (!result.success) return result
  const brushes = result.data
  if ((brushes as Brush[]).find(m => m.name === name)) return { success: false, status: 409, message: messages.BRUSH_EXIST }
  return await materialService.addBrush({ name, code })
}

export async function updateBrush({ name, newName, code }: NewBrush) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getBrushes()
  if (!result.success) return result
  const brushes = result.data
  if (!(brushes as Brush[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.BRUSH_NO_EXIST }
  return await materialService.updateBrush({ name, newName, code })
}

export async function deleteBrush(name: string) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getBrushes()
  if (!result.success) return result
  const brushes = result.data
  if (!(brushes as Brush[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.BRUSH_NO_EXIST }
  return await materialService.deleteBrush(name)
}