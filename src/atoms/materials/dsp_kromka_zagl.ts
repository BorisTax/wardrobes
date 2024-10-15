import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";
import { API_ROUTE } from "../../types/routes";
import { DspKromkaZaglSchema } from "../../types/schemas";

export const dspKromkaZaglListAtom = atom<DspKromkaZaglSchema[]>([])

export const loadDspKromkaZagListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`${API_ROUTE}/materials/dsp_kromka_zagl?token=${token}`)
        if(result.success) set(dspKromkaZaglListAtom, result.data as DspKromkaZaglSchema[]);
    } catch (e) { console.error(e) }
})

export const deleteDspEdgeAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData(`${API_ROUTE}/materials/dsp_kromka_zagl`, "DELETE", JSON.stringify({ id, token }))
        await set(loadDspKromkaZagListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addDspEdgeAtom = atom(null, async (get, set, {dspId, kromkaId, zaglushkaId}) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    const data = {
        [TableFields.DSPID]: dspId,
        [TableFields.KROMKAID]: kromkaId,
        [TableFields.ZAGLUSHKAID]: zaglushkaId,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData(`${API_ROUTE}/materials/dsp_kromka_zagl`, "POST", JSON.stringify(data))
        await set(loadDspKromkaZagListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateDspEdgeAtom = atom(null, async (get, set, { dspId, kromkaId, zaglushkaId }) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    const data = {
        [TableFields.DSPID]: dspId,
        [TableFields.ZAGLUSHKAID]: zaglushkaId,
        [TableFields.KROMKAID]: kromkaId,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData(`${API_ROUTE}/materials/dsp_kromka_zagl`, "PUT", JSON.stringify(data))
        await set(loadDspKromkaZagListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})