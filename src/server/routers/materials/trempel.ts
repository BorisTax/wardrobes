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

export async function addTrempel({ name, code, caption }: Trempel) {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const trempels = result.data
  if ((trempels as Trempel[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ name, code, caption })
}

export async function updateTrempel({ name, caption, code }: Trempel) {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const trempels = result.data
  if (!(trempels as Trempel[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({ name, caption, newName: "", code })
}

export async function deleteTrempel(name: string) {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const trempels = result.data
  if (!(trempels as Trempel[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtData(name)
}