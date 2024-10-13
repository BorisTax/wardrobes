import { atom } from "jotai";
import { Kromka, KromkaType, OmitId } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";

export const kromkaListAtom = atom<Kromka[]>([])
export const kromkaTypeListAtom = atom<KromkaType[]>([])

export const loadKromkaListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/kromka?token=${token}`)
        if(result.success) set(kromkaListAtom, result.data as Kromka[]);
    } catch (e) { console.error(e) }
})

export const loadKromkaTypeListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/kromka_types?token=${token}`)
        if(result.success) set(kromkaTypeListAtom, result.data as KromkaType[]);
    } catch (e) { console.error(e) }
})

export const deleteKromkaAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData("/api/materials/kromka", "DELETE", JSON.stringify({id, token }))
        await set(loadKromkaListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addKromkaAtom = atom(null, async (get, set, {name, code, typeId}: OmitId<Kromka>) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.CODE]: code,
        [TableFields.TYPEID]: typeId,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/kromka", "POST", JSON.stringify(data))
        await set(loadKromkaListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateKromkaAtom = atom(null, async (get, set, { id, name, code, typeId }: Kromka) => {
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
        const result = await fetchData("/api/materials/kromka", "PUT", JSON.stringify(data))
        await set(loadKromkaListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})