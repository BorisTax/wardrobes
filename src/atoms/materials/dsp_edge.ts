import { atom } from "jotai";
import { DSP_EDGE_ZAGL } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";

export const dspEdgeListAtom = atom<DSP_EDGE_ZAGL[]>([])

export const loadDspEdgeListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/dsp_edge?token=${token}`)
        if(result.success) set(dspEdgeListAtom, result.data as DSP_EDGE_ZAGL[]);
    } catch (e) { console.error(e) }
})

export const deleteDspEdgeAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData("/api/materials/dsp_edge", "DELETE", JSON.stringify({ id, token }))
        await set(loadDspEdgeListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addDspEdgeAtom = atom(null, async (get, set, {matId, edgeId, zaglushkaId}: DSP_EDGE_ZAGL) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    const data = {
        [TableFields.MATID]: matId,
        [TableFields.EDGEID]: edgeId,
        [TableFields.ZAGLUSHKAID]: zaglushkaId,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/dsp_edge", "POST", JSON.stringify(data))
        await set(loadDspEdgeListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateDspEdgeAtom = atom(null, async (get, set, { matId, edgeId, zaglushkaId }) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    const data = {
        [TableFields.MATID]: matId,
        [TableFields.ZAGLUSHKAID]: zaglushkaId,
        [TableFields.EDGEID]: edgeId,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/dsp_edge", "PUT", JSON.stringify(data))
        await set(loadDspEdgeListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})