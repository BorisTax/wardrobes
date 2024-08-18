import { atom } from "jotai";
import { Brush } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";

export const brushListAtom = atom<Brush[]>([])

export const loadBrushListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/brush?token=${token}`)
        if(result.success) set(brushListAtom, result.data as Brush[]);
    } catch (e) { console.error(e) }
})

export const deleteBrushAtom = atom(null, async (get, set, brush: Brush) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData("/api/materials/brush", "DELETE", JSON.stringify({ name: brush.name, token }))
        await set(loadBrushListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export const addBrushAtom = atom(null, async (get, set, {name, code}: Brush) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/brush", "POST", JSON.stringify(data))
        await set(loadBrushListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateBrushAtom = atom(null, async (get, set, { name, newName, code }) => {
    const {token, permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/brush", "PUT", JSON.stringify(data))
        await set(loadBrushListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})