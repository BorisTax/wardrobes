import { atom } from "jotai";
import { Edge } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";

export const edgeListAtom = atom<Edge[]>([])

export const loadEdgeListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.read) return
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/edge?token=${token}`)
        if(result.success) set(edgeListAtom, result.data as Edge[]);
    } catch (e) { console.error(e) }
})

export const deleteEdgeAtom = atom(null, async (get, set, edge: Edge) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.remove) return
    try{
        const result = await fetchData("/api/materials/edge", "DELETE", JSON.stringify({ name: edge.name, token }))
        await set(loadEdgeListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addEdgeAtom = atom(null, async (get, set, {name, dsp, code}: Edge) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.create) return
    const data = {
        [TableFields.NAME]: name,
        [TableFields.DSP]: dsp,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/edge", "POST", JSON.stringify(data))
        await set(loadEdgeListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateEdgeAtom = atom(null, async (get, set, { name, dsp, newName, code }) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.update) return
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.DSP]: dsp,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/edge", "PUT", JSON.stringify(data))
        await set(loadEdgeListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})