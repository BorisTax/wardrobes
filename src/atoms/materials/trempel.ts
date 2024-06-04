import { atom } from "jotai";
import { Trempel } from "../../server/types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../server/types/server";
import { AtomCallbackResult } from "../../types/atoms";

export const trempelListAtom = atom<Trempel[]>([])

export const loadTrempelListAtom = atom(null, async (_, set) => {
    try {
        const result: FetchResult<[] | string> = await fetchGetData('api/materials/trempel')
        if(result.success) set(trempelListAtom, result.data as Trempel[]);
    } catch (e) { console.error(e) }
})

export const deleteTrempelAtom = atom(null, async (get, set, trempel: Trempel, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const result = await fetchData("api/materials/trempel", "DELETE", JSON.stringify({ name: trempel.name, token: user.token }))
    await set(loadTrempelListAtom)
    callback({ success: result.success as boolean, message: result.message as string })
})

export const addTrempelAtom = atom(null, async (get, set, {name, code}: Trempel, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/trempel", "POST", JSON.stringify(data))
        await set(loadTrempelListAtom)
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})

export const updateTrempelAtom = atom(null, async (get, set, { name, newName, code }, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/trempel", "PUT", JSON.stringify(data))
        await set(loadTrempelListAtom)
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})