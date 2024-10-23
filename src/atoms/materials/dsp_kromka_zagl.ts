import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";
import { API_ROUTE, DSP_KROMKA_ZAG_ROUTE, MATERIALS_ROUTE } from "../../types/routes";
import { DspKromkaZaglSchema } from "../../types/schemas";
import { ExtMap, makeExtMap } from "../storage";

export const dspKromkaZaglListAtom = atom<ExtMap<DspKromkaZaglSchema>>(new Map())

export const loadDspKromkaZagListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<DspKromkaZaglSchema> = await fetchGetData(`${API_ROUTE}${MATERIALS_ROUTE}${DSP_KROMKA_ZAG_ROUTE}?token=${token}`)
        if(result.success) set(dspKromkaZaglListAtom, makeExtMap(result.data));
    } catch (e) { console.error(e) }
})

export const deleteDspEdgeAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${DSP_KROMKA_ZAG_ROUTE}`, "DELETE", JSON.stringify({ id, token }))
        await set(loadDspKromkaZagListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addDspEdgeAtom = atom(null, async (get, set, data: DspKromkaZaglSchema) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${DSP_KROMKA_ZAG_ROUTE}`, "POST", JSON.stringify({ data, token }))
        await set(loadDspKromkaZagListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateDspEdgeAtom = atom(null, async (get, set, data: DspKromkaZaglSchema) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${DSP_KROMKA_ZAG_ROUTE}`, "PUT", JSON.stringify({ data, token }))
        await set(loadDspKromkaZagListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})