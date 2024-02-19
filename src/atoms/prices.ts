import { atom } from "jotai";
import { Profile } from "../types/materials";
import { fetchData, fetchFormData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { PriceListItem, TableFields } from "../types/server";
import { AtomCallbackResult } from "../types/atoms";

export const priceListAtom = atom<PriceListItem[]>([])
export const activeProfileIndexAtom = atom(0)

export const loadPriceListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const result = await fetchGetData('api/prices/pricelist?token=' + token)
        if (!result.success) set(priceListAtom, []); else
            set(priceListAtom, result.data)
    } catch (e) { console.error(e) }
})


export const updatePriceListAtom = atom(null, async (get, set, { name, caption, price, code, id,markup }: PriceListItem, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const formData = new FormData()
    formData.append(TableFields.NAME, name)
    if(caption)formData.append(TableFields.CAPTION, caption)
    if(price)formData.append(TableFields.PRICE, `${price}`)
    if(markup)formData.append(TableFields.MARKUP, `${markup}`)
    if(code)formData.append(TableFields.CODE, code)
    if(id)formData.append(TableFields.ID, id) 
    formData.append(TableFields.TOKEN, user.token)
    try {
        const result = await fetchFormData("api/prices/pricelist", "PUT", formData)
        await set(loadPriceListAtom)
        callback(result)
    } catch (e) { console.error(e) }
})