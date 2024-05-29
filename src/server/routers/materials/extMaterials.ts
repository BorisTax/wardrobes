import messages from '../../messages.js'
import { MaterialService } from '../../services/materialService.js';
import { ExtMaterial, ExtNewMaterial } from '../../types/materials.js';
import { materialServiceProvider } from '../../options.js';

export async function getExtMaterials() {
  const materialService = new MaterialService(materialServiceProvider)
  return await materialService.getExtMaterials()
}

export async function addExtMaterial({ name, material, image, code }: ExtMaterial) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result.success) return result
  const materials = result.data
  if ((materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, status: 409, message: messages.MATERIAL_EXIST }
  return await materialService.addExtMaterial({ name, material, image, code })
}

export async function updateExtMaterial({ name, material, newName, image, code }: ExtNewMaterial) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result.success) return result
  const materials = result.data
  if (!(materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, status: 404, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtMaterial({ name, material, newName, image, code })
}

export async function deleteExtMaterial(name: string, material: string) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getExtMaterials()
  if (!result.success) return result
  const materials = result.data
  if (!(materials as ExtMaterial[]).find(m => m.name === name && m.material === material)) return { success: false, status: 404, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtMaterial(name, material)
}

