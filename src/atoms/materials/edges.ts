import { atom } from "jotai";
import { Edge, EdgeType, OmitId } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";

export const edgeListAtom = atom<Edge[]>([])
export const edgeTypeListAtom = atom<EdgeType[]>([])

export const loadEdgeListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/edge?token=${token}`)
        if(result.success) set(edgeListAtom, result.data as Edge[]);
    } catch (e) { console.error(e) }
})

export const loadEdgeTypeListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/edgetypes?token=${token}`)
        if(result.success) set(edgeTypeListAtom, result.data as EdgeType[]);
    } catch (e) { console.error(e) }
})

export const deleteEdgeAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData("/api/materials/edge", "DELETE", JSON.stringify({id, token }))
        await set(loadEdgeListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addEdgeAtom = atom(null, async (get, set, {name, code, typeId}: OmitId<Edge>) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.TYPEID]: typeId,
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

export const updateEdgeAtom = atom(null, async (get, set, { id, name, code, typeId }: Edge) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    const data = {
        [TableFields.ID]: id,
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.TYPEID]: typeId,
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