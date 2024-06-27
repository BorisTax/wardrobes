import messages from '../../messages.js'
import { MaterialService } from '../../services/materialService.js';
import { ExtMaterial, ExtNewMaterial } from '../../../types/materials.js';
import { materialsPath } from '../../options.js';
import MaterialServiceSQLite from '../../services/materialServiceSQLite.js';
import { StatusCodes } from 'http-status-codes';
import { FasadMaterial } from '../../../types/enums.js';

export async function getExtMaterials({}) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  return await materialService.getExtMaterials({})
}

export async function addExtMaterial({ name, material, image, code, purpose }: ExtMaterial) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  const result = await materialService.getExtMaterials({})
  if (!result.success) return result
  const materials = result.data
  if ((materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtMaterial({ name, material, image, code, purpose })
}

export async function updateExtMaterial({ name, material, newName, image, code, purpose }: ExtNewMaterial) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  const result = await materialService.getExtMaterials({})
  if (!result.success) return result
  const materials = result.data
  if (!(materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtMaterial({ name, material, newName, image, code, purpose })
}

export async function deleteExtMaterial(name: string, material: string) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  const result = await materialService.getExtMaterials({})
  if (!result.success) return result
  const materials = result.data
  if (!(materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtMaterial(name, material)
}

export async function getImage(material: FasadMaterial, name: string) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  return await materialService.getImage(material, name)
}