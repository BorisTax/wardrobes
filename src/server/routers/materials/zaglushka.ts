import messages from '../../messages.js'
import { Zaglushka, NewZaglushka } from '../../../types/materials.js';
import { materialsPath } from '../../options.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import ZagluskaServiceSQLite from '../../services/extServices/zaglushkaServiceSQLite.js';
import { StatusCodes } from 'http-status-codes';

export async function getZaglushkas() {
  const materialExtService = new MaterialExtService<Zaglushka>(new ZagluskaServiceSQLite(materialsPath))
  return await materialExtService.getExtData()
}

export async function addZaglushka({ name, dsp, code }: Zaglushka) {
  const materialExtService = new MaterialExtService<Zaglushka>(new ZagluskaServiceSQLite(materialsPath))
  const result = await materialExtService.getExtData()
  if (!result.success) return result
  const zaglushkas = result.data
  if ((zaglushkas as Zaglushka[]).find(m => m.name === name)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialExtService.addExtData({ name, dsp, code })
}

export async function updateZaglushka({ name, newName, dsp, code }: NewZaglushka) {
  const materialExtService = new MaterialExtService<Zaglushka>(new ZagluskaServiceSQLite(materialsPath))
  const result = await materialExtService.getExtData()
  if (!result.success) return result
  const zaglushkas = result.data
  if (!(zaglushkas as Zaglushka[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  if ((zaglushkas as Zaglushka[]).find(m => m.dsp === dsp)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_CORRESPOND_EXIST }
  return await materialExtService.updateExtData({ name, dsp, newName, code })
}

export async function deleteZaglushka(name: string) {
  const materialExtService = new MaterialExtService<Zaglushka>(new ZagluskaServiceSQLite(materialsPath))
  const result = await materialExtService.getExtData()
  if (!result.success) return result
  const zaglushkas = result.data
  if (!(zaglushkas as Zaglushka[]).find(m => m.name === name)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialExtService.deleteExtData(name)
}