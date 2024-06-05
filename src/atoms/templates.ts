import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { appDataAtom } from "./app";
import { TableFields } from "../types/server";
import { AtomCallbackResult } from "../types/atoms";
import { Template } from "../types/templates";
import { activeRootFasadIndexAtom } from "./fasades";
import { TEMPLATE_TABLES } from "../types/enums";
import FasadState from "../classes/FasadState";
import { newFasadFromState, trySetHeight, trySetWidth } from "../functions/fasades";
import { settingsAtom } from "./settings";
import messages from "../server/messages";

export const templateListAtom = atom<Template[]>([])
export const templateTableAtom = atom(TEMPLATE_TABLES.FASAD)
export const setTemplateTableAtom = atom(null, (get, set, table: TEMPLATE_TABLES) => {
    set(templateTableAtom, table)
    set(loadTemplateListAtom, table)
})

export const loadTemplateListAtom = atom(null, async (get, set, table: string) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`api/templates?table=${table}&token=${token}`)
        if (!result.success) return
        set(templateListAtom, result.data as Template[])
    } catch (e) { console.error(e) }
})

export const deleteTemplateAtom = atom(null, async (get, set, {name, table}, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const result = await fetchData("api/templates", "DELETE", JSON.stringify({ name, table, token: user.token }))
    await set(loadTemplateListAtom, table)
    callback({ success: result.success as boolean, message: result.message as string })
})

export const addFasadTemplateAtom = atom(null, async (get, set, name: string, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const index = get(activeRootFasadIndexAtom)
    const { rootFasades } = get(appDataAtom)
    const data = JSON.stringify(rootFasades[index].getState())
    const formData = JSON.stringify({[TableFields.NAME]: name, [TableFields.DATA]: data, [TableFields.TABLE]: TEMPLATE_TABLES.FASAD, [TableFields.TOKEN]: user.token})
    try {
        const result = await fetchData("api/templates", "POST", formData)
        await set(loadTemplateListAtom, TEMPLATE_TABLES.FASAD)
        callback({success: result.success as boolean, message: result.message as string})
    } catch (e) { console.error(e) }
})

export const updateFasadTemplateAtom = atom(null, async (get, set, { name, newName, rename = false }, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const index = get(activeRootFasadIndexAtom)
    const { rootFasades } = get(appDataAtom)
    const data = JSON.stringify(rootFasades[index].getState())
    const formData = {[TableFields.NAME]: name, [TableFields.NEWNAME]: newName, [TableFields.DATA]: data, [TableFields.TABLE]: TEMPLATE_TABLES.FASAD, [TableFields.TOKEN]: user.token}
    if(!rename) formData[TableFields.DATA] = data
    try {
        const result = await fetchData("api/templates", "PUT", JSON.stringify(formData))
        await set(loadTemplateListAtom, TEMPLATE_TABLES.FASAD)
        callback({success: result.success as boolean, message: result.message as string})
    } catch (e) { console.error(e) }
})

export const applyTemplateAtom = atom(null, (get, set, state: FasadState, callback: AtomCallbackResult) => {
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
        callback({ success: true, message: "" })
    } else callback({ success: false, message: messages.TEMPLATE_APPLY_ERROR })
})