import messages from '../../messages.js'
import { materialsPath } from '../../options.js';
import { MaterialExtService } from '../../services/materialExtService.js';
import { DspKromkaZagl } from '../../../types/materials.js';
import { StatusCodes } from 'http-status-codes';
import DSPKromkaZaglServiceSQLite from '../../services/extServices/DSPKromkaZaglServiceSQLite.js';

export async function getDspKromkaZag() {
  const materialService = new MaterialExtService<DspKromkaZagl>(new DSPKromkaZaglServiceSQLite(materialsPath))
  return await materialService.getExtData()
}

export async function addDspKromkaZag({ dspId, kromkaId, zaglushkaId }: DspKromkaZagl) {
  const materialService = new MaterialExtService<DspKromkaZagl>(new DSPKromkaZaglServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if ((edges as DspKromkaZagl[]).find(m => m.dspId === dspId)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addExtData({ dspId, kromkaId, zaglushkaId })
}

export async function updateDspKromkaZag({ dspId, kromkaId, zaglushkaId }: DspKromkaZagl) {
  const materialService = new MaterialExtService<DspKromkaZagl>(new DSPKromkaZaglServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as DspKromkaZagl[]).find(m => m.dspId === dspId)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.updateExtData({ dspId, kromkaId, zaglushkaId})
}

export async function deleteDspKromkaZag(id: number) {
  const materialService = new MaterialExtService<DspKromkaZagl>(new DSPKromkaZaglServiceSQLite(materialsPath))
  const result = await materialService.getExtData()
  if (!result.success) return result
  const edges = result.data
  if (!(edges as DspKromkaZagl[]).find(m => m.dspId === id)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteExtData(id)
}