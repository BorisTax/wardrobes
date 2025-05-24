import { OmitId } from '../../../types/materials.js';
import { getDataBaseProvider } from '../../options.js';
import { CharPurposeSchema, CharsSchema, DATA_TABLE_NAMES, DefaultSchema } from '../../../types/schemas.js';
import { DataBaseService } from '../../services/dataBaseService.js';

export async function getMaterialTypes() {
  const service = new DataBaseService(getDataBaseProvider<DefaultSchema>())
  return await service.getData(DATA_TABLE_NAMES.FASAD_TYPES_TABLE, [], {})
}

export async function getChars() {
  const service = new DataBaseService(getDataBaseProvider<CharsSchema>())
  return await service.getData(DATA_TABLE_NAMES.CHARS, ["id", "char_type_id", "code", "name"], {})
}
export async function getCharTypes() {
  const service = new DataBaseService(getDataBaseProvider<DefaultSchema>())
  return await service.getData(DATA_TABLE_NAMES.CHAR_TYPES, [], {})
}
export async function getCharPurpose() {
  const service = new DataBaseService(getDataBaseProvider<CharPurposeSchema>())
  return await service.getData(DATA_TABLE_NAMES.CHAR_PURPOSE, [], {})
}
export async function addCharPurpose(data: CharPurposeSchema) {
  const service = new DataBaseService(getDataBaseProvider<CharPurposeSchema>())
  return await service.addData(DATA_TABLE_NAMES.CHAR_PURPOSE, data)
}

export async function updateCharPurpose(oldData: CharPurposeSchema, data: Partial<CharPurposeSchema>) {
  const service = new DataBaseService(getDataBaseProvider<CharPurposeSchema>())
  return await service.updateData(DATA_TABLE_NAMES.CHAR_PURPOSE, oldData, data)
}

export async function deleteCharPurpose(charId: number) {
  const service = new DataBaseService(getDataBaseProvider<CharPurposeSchema>())
  return await service.deleteData(DATA_TABLE_NAMES.CHAR_PURPOSE, { charId })
}

export async function addChar(data: OmitId<CharsSchema>) {
  const service = new DataBaseService(getDataBaseProvider<CharsSchema>())
  return await service.addData(DATA_TABLE_NAMES.CHARS, data)
}

export async function updateChar(data: Partial<CharsSchema>) {
  const service = new DataBaseService(getDataBaseProvider<CharsSchema>())
  const { id, ...dataWithoutId } = data
  return await service.updateData(DATA_TABLE_NAMES.CHARS, {id: data.id}, dataWithoutId)
}

export async function deleteChar(id: number) {
  const service = new DataBaseService(getDataBaseProvider<CharsSchema>())
  return await service.deleteData(DATA_TABLE_NAMES.CHARS, { id })
}

export async function getImage(id: number) {
  const service = new DataBaseService(getDataBaseProvider<CharsSchema>())
  const result = (await service.getData(DATA_TABLE_NAMES.CHARS, ["image"], { id })).data
  return result[0]?.image || ""
}


export async function getChar(id: number) {
  const service = new DataBaseService(getDataBaseProvider<CharsSchema>())
  const result = (await service.getData(DATA_TABLE_NAMES.CHARS, ["id", "char_type_id", "code", "name"], { id })).data
  return result[0]
}

