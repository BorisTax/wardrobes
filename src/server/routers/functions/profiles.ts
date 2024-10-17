import { OmitId } from '../../../types/materials.js';
import { getDataBaseProvider } from '../../options.js';
import { DataBaseService } from '../../services/dataBaseService.js';
import { DATA_TABLE_NAMES, DefaultSchema, ProfileSchema } from '../../../types/schemas.js';

export async function getProfiles() {
  const service = new DataBaseService<ProfileSchema>(getDataBaseProvider())
  return (await service.getData(DATA_TABLE_NAMES.PROFILES, [], {})).data
}
export async function getProfileTypes() {
  const service = new DataBaseService<DefaultSchema>(getDataBaseProvider())
  return ((await service.getData(DATA_TABLE_NAMES.PROFILE_TYPE, [], {})).data)
}
export async function addProfile(profile: OmitId<ProfileSchema>) {
  const service = new DataBaseService<ProfileSchema>(getDataBaseProvider())
  return await service.addData(DATA_TABLE_NAMES.PROFILES, profile)
}

export async function updateProfile(profile: ProfileSchema) {
  const service = new DataBaseService<ProfileSchema>(getDataBaseProvider())
  return await service.updateData(DATA_TABLE_NAMES.PROFILES, profile)
}

export async function deleteProfile(id: number) {
  const service = new DataBaseService<ProfileSchema>(getDataBaseProvider())
  return await service.deleteData(DATA_TABLE_NAMES.PROFILES, id)
}

export async function getCharIdAndBrushSpecIdByProfileId(id: number) {
  const service = new DataBaseService<ProfileSchema>(getDataBaseProvider())
  const result = (await service.getData(DATA_TABLE_NAMES.PROFILES, ["brushSpecId", "charId"], { id })).data
  return {brushSpecId: result[0].brushSpecId || 0, profileCharId: result[0].charId || 0}
}

