import { atom } from "jotai";
import { Uplotnitel } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";

export const uplotnitelListAtom = atom<Uplotnitel[]>([])

export const loadUplotnitelListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`api/materials/uplotnitel?token=${token}`)
        if (result.success) set(uplotnitelListAtom, result.data as Uplotnitel[]);
    } catch (e) { console.error(e) }
})

export const deleteUplotnitelAtom = atom(null, async (get, set, uplotnitel: Uplotnitel) => {
    const user = get(userAtom)
    try {
        const result = await fetchData("api/materials/uplotnitel", "DELETE", JSON.stringify({ name: uplotnitel.name, token: user.token }))
        await set(loadUplotnitelListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export const addUplotnitelAtom = atom(null, async (get, set, { name, code }: Uplotnitel) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/uplotnitel", "POST", JSON.stringify(data))
        await set(loadUplotnitelListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export const updateUplotnitelAtom = atom(null, async (get, set, { name, caption, code }) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CAPTION]: caption,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/uplotnitel", "PUT", JSON.stringify(data))
        await set(loadUplotnitelListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})