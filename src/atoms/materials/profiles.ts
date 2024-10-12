import { atom } from "jotai";
import { OmitId, Profile, ProfileType } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";
const initProfile: Profile = { id: -1, type: ProfileType.STANDART, name: "", brushId: 0, code: "" }
export const profileListAtom = atom<Profile[]>([initProfile])
export const activeProfileIndexAtom = atom(0)

export const loadProfileListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/profile?token=${token}`)
        if(result.success) set(profileListAtom, result.data as Profile[]);
    } catch (e) { console.error(e) }
})

export const deleteProfileAtom = atom(null, async (get, set, profile: Profile) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData("/api/materials/profile", "DELETE", JSON.stringify({ id: profile.id, token }))
        await set(loadProfileListAtom)
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addProfileAtom = atom(null, async (get, set, profile: OmitId<Profile>) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: profile.name,
        [TableFields.TYPE]: profile.type,
        [TableFields.CODE]: profile.code,
        [TableFields.BRUSHID]: profile.brushId,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/profile", "POST", JSON.stringify(data))
        await set(loadProfileListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateProfileAtom = atom(null, async (get, set, { id, name, type, code, brushId }) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.ID]: id,
        [TableFields.TYPE]: type,
        [TableFields.CODE]: code,
        [TableFields.BRUSHID]: brushId,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/profile", "PUT", JSON.stringify(data))
        await set(loadProfileListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})