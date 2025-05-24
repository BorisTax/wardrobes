import { getDataBaseProvider } from '../../options.js';
import { DataBaseService } from '../../services/dataBaseService.js';
import { DATA_TABLE_NAMES, DspKromkaZaglSchema } from '../../../types/schemas.js';
import { OmitId } from '../../../types/materials.js';
import { getAllCharOfSpec } from './spec.js';
import { SpecItem } from '../../../types/specification.js';

export async function getDspKromkaZag() {
  const service = new DataBaseService<DspKromkaZaglSchema>(getDataBaseProvider())
  return await service.getData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, [], {})
}

export async function addDspKromkaZag(data: OmitId<DspKromkaZaglSchema>) {
  const service = new DataBaseService<DspKromkaZaglSchema>(getDataBaseProvider())
  return await service.addData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, data)
}

export async function updateDspKromkaZag(data: Partial<DspKromkaZaglSchema>) {
  const service = new DataBaseService<DspKromkaZaglSchema>(getDataBaseProvider())
  const { id, ...otherData } = data
  return await service.updateData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, { id }, otherData)
}

export async function deleteDspKromkaZag(id: number) {
  const service = new DataBaseService<DspKromkaZaglSchema>(getDataBaseProvider())
  return await service.deleteData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, { id })
}

export async function getKromkaAndZaglByDSP(dspId: number) {
  const service = new DataBaseService<DspKromkaZaglSchema>(getDataBaseProvider())
  const result = (await service.getData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, ["kromkaId", 'zaglushkaId'], { id: dspId })).data
  return result[0] || { kromkaId: 0, zaglushkaId: 0 }
}
export async function getKromkaTypeByChar(charId: number) {
  const types = [SpecItem.Kromka045, SpecItem.Kromka06, SpecItem.Kromka08]
  for (let t of types) {
    let chars = await getAllCharOfSpec(t)
    if (chars.includes(charId)) return t
  }
  return 0
}
export async function getZagByDSP(dspId: number) {
  const service = new DataBaseService<DspKromkaZaglSchema>(getDataBaseProvider())
  const result = (await service.getData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, ["zaglushkaId"], { id: dspId })).data || [{ zaglushkaId: 0 }]
  return result[0]?.zaglushkaId || 0
}