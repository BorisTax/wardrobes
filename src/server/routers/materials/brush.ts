import messages from '../../messages.js'
import { Brush, NewBrush } from '../../../types/materials.js';
import { materialsPath } from '../../options.js';
import BrushServiceSQLite from '../../services/extServices/brushServiceSQLite.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import { getProfiles } from './profiles.js';

export async function getBrushes() {
  const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
  return await materialService.getExtData()
}

export async function addBrush({ name, code }: Brush) {
  const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const brushes = result.data
  if ((brushes as Brush[]).find(m => m.name === name)) return { success: false, status: 409, message: messages.BRUSH_EXIST }
  return await materialService.addExtData({ name, code })
}

export async function updateBrush({ name, newName, code }: NewBrush) {
  const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const brushes = result.data
  if (!(brushes as Brush[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.BRUSH_NO_EXIST }
  return await materialService.updateExtData({ name, newName, code })
}

export async function deleteBrush(name: string) {
  const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const brushes = result.data
  if (!(brushes as Brush[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.BRUSH_NO_EXIST }
  const {success, data: profiles} = await getProfiles()
  if(success){
    if(profiles?.find(p => p.brush === name)) return { success: false, status: 409, message: messages.BRUSH_LINKED }
  }
  return await materialService.deleteExtData(name)
}