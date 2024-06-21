import { atom } from "jotai";
import { Trempel } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";

export const trempelListAtom = atom<Trempel[]>([])

export const loadTrempelListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/trempel?token=${token}`)
        if (result.success) set(trempelListAtom, result.data as Trempel[]);
    } catch (e) { console.error(e) }
})

export const deleteTrempelAtom = atom(null, async (get, set, trempel: Trempel) => {
    const user = get(userAtom)
    try {
        const result = await fetchData("/api/materials/trempel", "DELETE", JSON.stringify({ name: trempel.name, token: user.token }))
        await set(loadTrempelListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export const addTrempelAtom = atom(null, async (get, set, { name, caption, code }: Trempel) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.CAPTION]: caption,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("/api/materials/trempel", "POST", JSON.stringify(data))
        await set(loadTrempelListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export const updateTrempelAtom = atom(null, async (get, set, { name, caption, code }) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CAPTION]: caption,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("/api/materials/trempel", "PUT", JSON.stringify(data))
        await set(loadTrempelListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})