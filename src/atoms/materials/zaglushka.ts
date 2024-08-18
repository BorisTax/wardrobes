import { atom } from "jotai";
import { Zaglushka } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";

export const zaglushkaListAtom = atom<Zaglushka[]>([])

export const loadZaglushkaListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/zaglushka?token=${token}`)
        if(result.success) set(zaglushkaListAtom, result.data as Zaglushka[]);
    } catch (e) { console.error(e) }
})

export const deleteZaglushkaAtom = atom(null, async (get, set, zaglushka: Zaglushka) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData("/api/materials/zaglushka", "DELETE", JSON.stringify({ name: zaglushka.name, token }))
        await set(loadZaglushkaListAtom)
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addZaglushkaAtom = atom(null, async (get, set, {name, dsp, code}: Zaglushka) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.DSP]: dsp,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/zaglushka", "POST", JSON.stringify(data))
        await set(loadZaglushkaListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export const updateZaglushkaAtom = atom(null, async (get, set, { name, dsp, newName, code }) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.DSP]: dsp,
        [TableFields.CODE]: code,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/zaglushka", "PUT", JSON.stringify(data))
        await set(loadZaglushkaListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})