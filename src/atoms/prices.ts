import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { PriceListItem, TableFields } from "../types/server";
import { AtomCallbackResult } from "../types/atoms";
import { SpecificationItem } from "../types/enums";

export const priceListAtom = atom<PriceListItem[]>([])
export const activeProfileIndexAtom = atom(0)

export const loadPriceListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData('api/prices/pricelist?token=' + token)
        if (!result.success) set(priceListAtom, []); else
            set(priceListAtom, result.data as PriceListItem[])
    } catch (e) { console.error(e) }
})

export const coefListAtom = atom<Map<SpecificationItem, number>>((get) => {
    const coef = new Map()
    get(priceListAtom).forEach(p => { coef.set(p.name, p.coef) })
    return coef
})

export const updatePriceListAtom = atom(null, async (get, set, { name, caption, coef, price, code, id, markup }: PriceListItem, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const formData: any = {}
    formData[TableFields.NAME] = name
    if (caption !== undefined) formData[TableFields.CAPTION] = caption
    if (coef !== undefined) formData[TableFields.COEF] = coef
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