import messages from '../../messages.js'
import { Trempel } from '../../../types/materials.js';
import { materialsPath } from '../../options.js';
import TrempelServiceSQLite from '../../services/extServices/trempelServiceSQLite.js';
import { MaterialExtService } from '../../services/materialExtService.js';

export async function getTrempels() {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  return await materialService.getExtData()
}

export async function addTrempel({ name, code }: Trempel) {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const brushes = result.data
  if ((brushes as Trempel[]).find(m => m.name === name)) return { success: false, status: 409, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ name, code })
}

export async function updateTrempel({ name, newName, code }: Trempel & {newName: string}) {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const brushes = result.data
  if (!(brushes as Trempel[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({ name, newName, code })
}

export async function deleteTrempel(name: string) {
  const materialService = new MaterialExtService<Trempel>(new TrempelServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const brushes = result.data
  if (!(brushes as Trempel[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtData(name)
}