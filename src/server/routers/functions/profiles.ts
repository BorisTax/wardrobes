import { OmitId } from '../../../types/materials.js';
import { DATA_TABLE_NAMES, DefaultSchema, ProfileSchema } from '../../../types/schemas.js';
import { getDataBaseService } from '../../options.js';

export async function getProfiles() {
  const service = getDataBaseService<ProfileSchema>()
  return (await service.getData(DATA_TABLE_NAMES.PROFILES, [], {})).data
}
export async function getProfileTypes() {
  const service = getDataBaseService<DefaultSchema>()
  return ((await service.getData(DATA_TABLE_NAMES.PROFILE_TYPE, [], {})).data)
}
export async function addProfile(profile: OmitId<ProfileSchema>) {
  const service = getDataBaseService<ProfileSchema>()
  return await service.addData(DATA_TABLE_NAMES.PROFILES, profile)
}

export async function updateProfile(profile: ProfileSchema) {
  const service = getDataBaseService<ProfileSchema>()
  const { id, ...otherData } = profile 
  return await service.updateData(DATA_TABLE_NAMES.PROFILES, { id }, otherData)
}

export async function deleteProfile(id: number) {
  const service = getDataBaseService<ProfileSchema>()
  return await service.deleteData(DATA_TABLE_NAMES.PROFILES, { id })
}

export async function getCharIdAndBrushSpecIdByProfileId(id: number) {
  const service = getDataBaseService<ProfileSchema>()
  const result = (await service.getData(DATA_TABLE_NAMES.PROFILES, ["brushSpecId", "charId"], { id })).data
  return {brushSpecId: result[0].brushSpecId || 0, profileCharId: result[0].charId || 0}
}

