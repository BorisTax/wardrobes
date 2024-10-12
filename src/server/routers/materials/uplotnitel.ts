import messages from '../../messages.js'
import { Uplotnitel } from '../../../types/materials.js';
import { materialsPath } from '../../options.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import UplotnitelServiceSQLite from '../../services/extServices/uplotnitelServiceSQLite.js';
import { StatusCodes } from 'http-status-codes';

export async function getUplotnitels() {
  const materialExtService = new MaterialExtService<Uplotnitel>(new UplotnitelServiceSQLite(materialsPath))
  return await materialExtService.getExtData()
}

export async function addUplotnitel({ name, code }: Omit<Uplotnitel, "id">) {
  const materialExtService = new MaterialExtService<Uplotnitel>(new UplotnitelServiceSQLite(materialsPath))
  const result = await materialExtService.getExtData()
  if (!result.success) return result
  const list = result.data
  if ((list as Uplotnitel[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialExtService.addExtData({ name, code })
}

export async function updateUplotnitel({ id, name, code }: Uplotnitel) {
  const materialExtService = new MaterialExtService<Uplotnitel>(new UplotnitelServiceSQLite(materialsPath))
  const result = await materialExtService.getExtData()
  if (!result.success) return result
  const list = result.data
  if (!(list as Uplotnitel[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialExtService.updateExtData({ id, name, code })
}

export async function deleteUplotnitel(id: number) {
  const materialExtService = new MaterialExtService<Uplotnitel>(new UplotnitelServiceSQLite(materialsPath))
  const result = await materialExtService.getExtData()
  if (!result.success) return result
  const list = result.data
  if (!(list as Uplotnitel[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialExtService.deleteExtData(id)
}