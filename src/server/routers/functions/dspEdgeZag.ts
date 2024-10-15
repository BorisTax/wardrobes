import { getDataBaseProvider } from '../../options.js';
import { DataBaseService } from '../../services/dataBaseService.js';
import { DATA_TABLE_NAMES, DspKromkaZaglSchema } from '../../../types/schemas.js';
import { OmitId } from '../../../types/materials.js';

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
  return await service.updateData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, data)
}

export async function deleteDspKromkaZag(id: number) {
  const service = new DataBaseService<DspKromkaZaglSchema>(getDataBaseProvider())
  return await service.deleteData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, id)
}

export async function getKromkaByDSP(dspId: number) {
  const service = new DataBaseService<DspKromkaZaglSchema>(getDataBaseProvider())
  const result = (await service.getData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, ["kromkaSpecId", "kromkaId"], { id: dspId })).data || [{ kromkaId: 0, kromkaSpecId: 0 }]
  return result[0]
}

export async function getZagByDSP(dspId: number) {
  const service = new DataBaseService<DspKromkaZaglSchema>(getDataBaseProvider())
  const result = (await service.getData(DATA_TABLE_NAMES.DSP_KROMKA_ZAGL, ["zaglushkaId"], { id: dspId })).data || [{ zaglushkaId: 0 }]
  return result[0]?.zaglushkaId || 0
}