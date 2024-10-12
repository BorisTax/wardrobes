import messages from '../../messages.js'
import { MaterialService } from '../../services/materialService.js';
import { FasadMaterial } from '../../../types/materials.js';
import { materialsPath } from '../../options.js';
import MaterialServiceSQLite from '../../services/materialServiceSQLite.js';
import { StatusCodes } from 'http-status-codes';
import { FASAD_TYPE } from '../../../types/enums.js';

export async function getMaterialTypes() {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  return await materialService.getMaterialTypes()
}

export async function getExtMaterials({}) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  return await materialService.getExtMaterials({})
}

export async function addExtMaterial({ name, type: material, image, code, purpose }: Omit<FasadMaterial, "id">) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  const result = await materialService.getExtMaterials({})
  if (!result.success) return result
  const materials = result.data
  if ((materials as FasadMaterial[]).find(m => m.name === name && m.type === material)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtMaterial({ name, type: material, image, code, purpose })
}

export async function updateExtMaterial({ id, name, type: material, image, code, purpose }: FasadMaterial) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  const result = await materialService.getExtMaterials({})
  if (!result.success) return result
  const materials = result.data
  if (!(materials as FasadMaterial[]).find(m => m.id === id )) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtMaterial({ id, name, type: material, image, code, purpose })
}

export async function deleteExtMaterial(id: number) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  const result = await materialService.getExtMaterials({})
  if (!result.success) return result
  const materials = result.data
  if (!(materials as FasadMaterial[]).find(m => m.id === id )) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtMaterial(id)
}

export async function getImage(id: number) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  return await materialService.getImage(id)
}