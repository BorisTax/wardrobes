import messages from '../../messages.js'
import { MaterialService } from '../../services/materialService.js';
import { Zaglushka, NewZaglushka } from '../../types/materials.js';
import { materialServiceProvider } from '../../options.js';

export async function getZaglushkas() {
  const materialService = new MaterialService(materialServiceProvider)
  return await materialService.getZaglushkas()
}

export async function addZaglushka({ name, dsp, code }: Zaglushka) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getZaglushkas()
  if (!result.success) return result
  const zaglushkas = result.data
  if ((zaglushkas as Zaglushka[]).find(m => m.name === name)) return { success: false, status: 409, message: messages.ZAGLUSHKA_EXIST }
  return await materialService.addZaglushka({ name, dsp, code })
}

export async function updateZaglushka({ name, newName, dsp, code }: NewZaglushka) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getZaglushkas()
  if (!result.success) return result
  const zaglushkas = result.data
  if (!(zaglushkas as Zaglushka[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.ZAGLUSHKA_NO_EXIST }
  return await materialService.updateZaglushka({ name, dsp, newName, code })
}

export async function deleteZaglushka(name: string) {
  const materialService = new MaterialService(materialServiceProvider)
  const result = await materialService.getZaglushkas()
  if (!result.success) return result
  const zaglushkas = result.data
  if (!(zaglushkas as Zaglushka[]).find(m => m.name === name)) return { success: false, status: 404, message: messages.ZAGLUSHKA_NO_EXIST }
  return await materialService.deleteZaglushka(name)
}