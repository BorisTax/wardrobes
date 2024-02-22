import { atom } from "jotai";
import { Profile } from "../types/materials";
import { FetchResult, fetchData, fetchFormData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { TableFields } from "../types/server";
import { AtomCallbackResult } from "../types/atoms";

export const profileListAtom = atom<Profile[]>([])
export const activeProfileIndexAtom = atom(0)

export const loadProfileListAtom = atom(null, async (get, set) => {
    try {
        const { success, data }: FetchResult = await fetchGetData('api/materials/profiles')
        if(success) set(profileListAtom, data as Profile[]);
    } catch (e) { console.error(e) }
})

export const deleteProfileAtom = atom(null, async (get, set, profile: Profile, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    try {
        const result = await fetchData("api/materials/profile", "DELETE", JSON.stringify({ name: profile.name, type: profile.type, token: user.token }))
        await set(loadProfileListAtom)
        callback(result)
    } catch (e) { console.error(e) }
})

export const addProfileAtom = atom(null, async (get, set, profile: Profile, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const formData = new FormData()
    formData.append(TableFields.NAME, profile.name)
    formData.append(TableFields.TYPE, profile.type)
    formData.append(TableFields.CODE, profile.code)
    formData.append(TableFields.TOKEN, user.token)
    try {
        const result = await fetchFormData("api/materials/profile", "POST", formData)
        await set(loadProfileListAtom)
        callback(result)
    } catch (e) { console.error(e) }
})

export const updateProfileAtom = atom(null, async (get, set, { name, type, newCode, newName }, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const formData = new FormData()
    formData.append(TableFields.NAME, name)
    formData.append(TableFields.NEWNAME, newName)
    formData.append(TableFields.TYPE, type)
    formData.append(TableFields.CODE, newCode)
    formData.append(TableFields.TOKEN, user.token)
    try {
        const result = await fetchFormData("api/materials/profile", "PUT", formData)
        await set(loadProfileListAtom)
        callback(result)
    } catch (e) { console.error(e) }
})