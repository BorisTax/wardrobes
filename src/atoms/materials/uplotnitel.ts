import { atom } from "jotai";
import { OmitId, Uplotnitel } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";

export const uplotnitelListAtom = atom<Uplotnitel[]>([])

export const loadUplotnitelListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/uplotnitel?token=${token}`)
        if (result.success) set(uplotnitelListAtom, result.data as Uplotnitel[]);
    } catch (e) { console.error(e) }
})

export const deleteUplotnitelAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData("/api/materials/uplotnitel", "DELETE", JSON.stringify({ id, token }))
        await set(loadUplotnitelListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export const addUplotnitelAtom = atom(null, async (get, set, { name, code }: OmitId<Uplotnitel>) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/uplotnitel", "POST", JSON.stringify(data))
        await set(loadUplotnitelListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export const updateUplotnitelAtom = atom(null, async (get, set, {id, name, code }) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    const data = {
        [TableFields.ID]: id,
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/uplotnitel", "PUT", JSON.stringify(data))
        await set(loadUplotnitelListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})