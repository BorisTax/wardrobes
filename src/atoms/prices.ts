import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { PriceData, TableFields } from "../types/server";
import messages from "../server/messages";

export const priceListAtom = atom<PriceData[]>([])
export const activeProfileIndexAtom = atom(0)

export const loadPriceListAtom = atom(null, async (get, set) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData('api/prices/pricelist?token=' + token)
        if (!result.success) set(priceListAtom, []); else
            set(priceListAtom, result.data as PriceData[])
    } catch (e) { console.error(e) }
})


export const updatePriceListAtom = atom(null, async (get, set, { name, price, markup }: PriceData) => {
    const user = get(userAtom)
    const formData: any = {}
    formData[TableFields.NAME] = name
    if (price !== undefined) formData[TableFields.PRICE] = `${price}`
    if (markup !== undefined) formData[TableFields.MARKUP] = `${markup}`
    formData[TableFields.TOKEN] = user.token
    try {
        const result = await fetchData("api/prices/pricelist", "PUT", JSON.stringify(formData))
        await set(loadPriceListAtom)
        return {success: result.success as boolean, message: result.message as string}
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})