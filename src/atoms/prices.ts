import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { PriceListItem, TableFields } from "../server/types/server";
import { AtomCallbackResult } from "../types/atoms";

export const priceListAtom = atom<PriceListItem[]>([])
export const activeProfileIndexAtom = atom(0)

export const loadPriceListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const { success, data }: FetchResult = await fetchGetData('api/prices/pricelist?token=' + token)
        if (!success) set(priceListAtom, []); else
            set(priceListAtom, data as PriceListItem[])
    } catch (e) { console.error(e) }
})


export const updatePriceListAtom = atom(null, async (get, set, { name, caption, price, code, id, markup }: PriceListItem, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const formData: any = {}
    formData[TableFields.NAME] = name
    if (caption !== undefined) formData[TableFields.CAPTION] = caption
    if (price !== undefined) formData[TableFields.PRICE] = `${price}`
    if (markup !== undefined) formData[TableFields.MARKUP] = `${markup}`
    if (code !== undefined) formData[TableFields.CODE] = code
    if (id !== undefined) formData[TableFields.ID] = id
    formData[TableFields.TOKEN] = user.token
    try {
        const result = await fetchData("api/prices/pricelist", "PUT", JSON.stringify(formData))
        await set(loadPriceListAtom)
        callback({success: result.success as boolean, message: result.message as string})
    } catch (e) { console.error(e) }
})