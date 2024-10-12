import messages from '../../messages.js'
import { Trempel } from '../../../types/materials.js';
import { materialsPath } from '../../options.js';
import TrempelServiceSQLite from '../../services/extServices/trempelServiceSQLite.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import { StatusCodes } from 'http-status-codes';

export async function getTrempels() {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  return await materialService.getExtData()
}

export async function addTrempel({ name, code, caption }: Omit<Trempel, "id">) {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const trempels = result.data
  if ((trempels as Trempel[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ name, code, caption })
}

export async function updateTrempel({ id, name, caption, code }: Trempel) {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const trempels = result.data
  if (!(trempels as Trempel[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({  id, name, caption, code })
}

export async function deleteTrempel(id: number) {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const trempels = result.data
  if (!(trempels as Trempel[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtData(id)
}