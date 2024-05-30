import { atom } from "jotai";
import { Brush } from "../server/types/materials";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { TableFields } from "../server/types/server";
import { AtomCallbackResult } from "../types/atoms";

export const brushListAtom = atom<Brush[]>([])

export const loadBrushListAtom = atom(null, async (_, set) => {
    try {
        const { success, data }: FetchResult<Brush[]> = await fetchGetData('api/materials/brush')
        if(success) set(brushListAtom, data as Brush[]);
    } catch (e) { console.error(e) }
})

export const deleteBrushAtom = atom(null, async (get, set, brush: Brush, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const result = await fetchData("api/materials/brush", "DELETE", JSON.stringify({ name: brush.name, token: user.token }))
    await set(loadBrushListAtom)
    callback({ success: result.success as boolean, message: result.message as string })
})

export const addBrushAtom = atom(null, async (get, set, {name, code}: Brush, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/brush", "POST", JSON.stringify(data))
        await set(loadBrushListAtom)
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})

export const updateBrushAtom = atom(null, async (get, set, { name, newName, code }, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/brush", "PUT", JSON.stringify(data))
        await set(loadBrushListAtom)
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})