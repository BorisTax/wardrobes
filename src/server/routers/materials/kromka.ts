import messages from '../../messages.js'
import { materialsPath } from '../../options.js';
import KromkaServiceSQLite from '../../services/extServices/kromkaServiceSQLite.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import { Kromka, KromkaType, OmitId } from '../../../types/materials.js';
import { StatusCodes } from 'http-status-codes';
import KromkaTypeServiceSQLite from '../../services/extServices/kromkaTypeServiceSQLite.js';

export async function getKromka() {
  const materialService = new MaterialExtService<Kromka>(new KromkaServiceSQLite(materialsPath))
  return await materialService.getExtData()
}

export async function addKromka({ name, code, typeId }: OmitId<Kromka>) {
  const materialService = new MaterialExtService<Kromka>(new KromkaServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const list = result.data
  if ((list as Kromka[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ name, code, typeId })
}

export async function updateKromka({ id, name, code, typeId }: Kromka) {
  const materialService = new MaterialExtService<Kromka>(new KromkaServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const list = result.data
  if (!(list as Kromka[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({ id, name, code, typeId })
}

export async function deleteKromka(id: number) {
  const materialService = new MaterialExtService<Kromka>(new KromkaServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const list = result.data
  if (!(list as Kromka[]).find(m => m.id === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtData(id)
}

export async function getKromkaTypes() {
  const materialService = new MaterialExtService<KromkaType>(new KromkaTypeServiceSQLite(materialsPath))
  return await materialService.getExtData()
}