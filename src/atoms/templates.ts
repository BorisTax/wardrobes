import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { appDataAtom } from "./app";
import { TableFields } from "../types/server";
import { AtomCallbackResult } from "../types/atoms";
import { Template } from "../types/templates";
import { activeRootFasadIndexAtom } from "./fasades";
import FasadState from "../classes/FasadState";
import { newFasadFromState, trySetHeight, trySetWidth } from "../functions/fasades";
import { settingsAtom } from "./settings";
import messages from "../server/messages";

export const templateListAtom = atom<Template[]>([])

export const loadTemplateListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/templates?token=${token}`)
        if (!result.success) return
        set(templateListAtom, result.data as Template[])
    } catch (e) { console.error(e) }
})

export const deleteTemplateAtom = atom(null, async (get, set, {name}) => {
    const user = get(userAtom)
    const result = await fetchData("/api/templates", "DELETE", JSON.stringify({ name, token: user.token }))
    await set(loadTemplateListAtom)
    return { success: result.success as boolean, message: result.message as string }
})

export const addFasadTemplateAtom = atom(null, async (get, set, name: string) => {
    const user = get(userAtom)
    const index = get(activeRootFasadIndexAtom)
    const { rootFasades } = get(appDataAtom)
    const data = JSON.stringify(rootFasades[index].getState())
    const formData = JSON.stringify({[TableFields.NAME]: name, [TableFields.DATA]: data, [TableFields.TOKEN]: user.token})
    try {
        const result = await fetchData("/api/templates", "POST", formData)
        await set(loadTemplateListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.SERVER_ERROR }
    }
})

export const updateFasadTemplateAtom = atom(null, async (get, set, { name, newName, rename = false }) => {
    const user = get(userAtom)
    const index = get(activeRootFasadIndexAtom)
    const { rootFasades } = get(appDataAtom)
    const data = JSON.stringify(rootFasades[index].getState())
    const formData = {[TableFields.NAME]: name, [TableFields.NEWNAME]: newName, [TableFields.DATA]: data, [TableFields.TOKEN]: user.token}
    if(!rename) formData[TableFields.DATA] = data
    try {
        const result = await fetchData("/api/templates", "PUT", JSON.stringify(formData))
        await set(loadTemplateListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.SERVER_ERROR }
    }
})

export const applyTemplateAtom = atom(null, (get, set, state: FasadState) => {
    const index = get(activeRootFasadIndexAtom)
    const { rootFasades } = get(appDataAtom)
    const { minSize } = get(settingsAtom)
    const width = rootFasades[index].Width
    const height = rootFasades[index].Height
    const newFasad = newFasadFromState(state)
    let res = trySetWidth(newFasad, width, minSize)
    res = res && trySetHeight(newFasad, height, minSize)
    if(res){
        rootFasades[index] = newFasad
        const appData = get(appDataAtom)
        set(appDataAtom, { ...appData }, true)
        return { success: true, message: "" }
    } else return { success: false, message: messages.TEMPLATE_APPLY_ERROR }
})