import messages from '../../messages.js'
import { Brush } from '../../../types/materials.js';
import { materialsPath } from '../../options.js';
import BrushServiceSQLite from '../../services/extServices/brushServiceSQLite.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import { getProfiles } from './profiles.js';
import { StatusCodes } from 'http-status-codes';

export async function getBrushes() {
  const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
  return await materialService.getExtData()
}

export async function addBrush({ name, code }: Omit<Brush, "id">) {
  const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const brushes = result.data
  if ((brushes as Brush[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ name, code })
}

export async function updateBrush({ id, name, code }: Brush) {
  const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const brushes = result.data
  if (!(brushes as Brush[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({ id, name, code })
}

export async function deleteBrush(id: number) {
  const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const brushes = result.data
  if (!(brushes as Brush[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  const {success, data: profiles} = await getProfiles()
  if(success){
    if(profiles?.find(p => p.brushId === id)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_LINKED }
  }
  return await materialService.deleteExtData(id)
}