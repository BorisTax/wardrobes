import { atom } from "jotai";
import { Profile } from "../server/types/materials";
import { FetchResult, fetchData, fetchFormData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { TableFields } from "../server/types/server";
import { AtomCallbackResult } from "../types/atoms";

export const profileListAtom = atom<Profile[]>([])
export const activeProfileIndexAtom = atom(0)

export const loadProfileListAtom = atom(null, async (get, set) => {
    try {
        const { success, data }: FetchResult<Profile[]> = await fetchGetData('api/materials/profile')
        if(success) set(profileListAtom, data as Profile[]);
    } catch (e) { console.error(e) }
})

export const deleteProfileAtom = atom(null, async (get, set, profile: Profile, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const result = await fetchData("api/materials/profile", "DELETE", JSON.stringify({ name: profile.name, type: profile.type, token: user.token }))
    await set(loadProfileListAtom)
    callback({ success: result.success as boolean, message: result.message as string })
})

export const addProfileAtom = atom(null, async (get, set, profile: Profile, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: profile.name,
        [TableFields.TYPE]: profile.type,
        [TableFields.CODE]: profile.code,
        [TableFields.BRUSH]: profile.brush,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/profile", "POST", JSON.stringify(data))
        await set(loadProfileListAtom)
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})

export const updateProfileAtom = atom(null, async (get, set, { name, type, newCode, newName, newBrush }, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.TYPE]: type,
        [TableFields.CODE]: newCode,
        [TableFields.BRUSH]: newBrush,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/profile", "PUT", JSON.stringify(data))
        await set(loadProfileListAtom)
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})