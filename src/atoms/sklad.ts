import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { RESOURCE } from "../types/user";
import { IncomeTableSchema, OutcomeTableSchema, StolColorsTableSchema, StolTableSchema } from "../types/schemas";
import { API_ROUTE, SKLAD_ROUTE, STOL_COLORS_ROUTE, STOL_SKLAD_ROUTE, INCOME_ROUTE, OUTCOME_ROUTE, CLEAR_ALL_STOL_SKLAD_ROUTE } from "../types/routes";
import { DefaultMap, makeDefaultMap } from "./storage";
import { userAtom } from "./users";
import messages from "../server/messages";


export const stolColorsAtom = atom<DefaultMap>(new Map())
export const stolSkladAtom = atom<StolTableSchema[]>([])
export const stolIncomeAtom = atom<IncomeTableSchema[]>([])
export const stolOutcomeAtom = atom<OutcomeTableSchema[]>([])

export const loadStolColorsAtom = atom(null, async (get, set) => {
    const {token, permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_STOL)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<StolColorsTableSchema> = await (await fetchGetData(`${API_ROUTE}${SKLAD_ROUTE}${STOL_COLORS_ROUTE}?token=${token}`))
        const data = fetchData.data
        set(stolColorsAtom, makeDefaultMap(data))
    } catch (e) { console.error(e) }
})

export const loadStolSkladAtom = atom(null, async (get, set) => {
    const {token, permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_STOL)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<StolTableSchema> = await (await fetchGetData(`${API_ROUTE}${SKLAD_ROUTE}${STOL_SKLAD_ROUTE}?token=${token}`))
        const data = fetchData.data
        set(stolSkladAtom, data)
    } catch (e) { console.error(e) }
})

export const loadStolIncomeAtom = atom(null, async (get, set, income: boolean) => {
    const {token, permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_STOL)?.Read) return { success: false, message: "" }
    const route = income?INCOME_ROUTE:OUTCOME_ROUTE
    try {
        const fetchData: FetchResult<IncomeTableSchema> = await (await fetchGetData(`${API_ROUTE}${SKLAD_ROUTE}${route}?token=${token}`))
        const data = fetchData.data
        income ? set(stolIncomeAtom, data) : set(stolOutcomeAtom, data)
    } catch (e) { console.error(e) }
})


export const deleteStolAtom = atom(null, async (get, set, data: StolTableSchema) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_STOL)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${SKLAD_ROUTE}${STOL_SKLAD_ROUTE}`, "PUT", JSON.stringify({ ...data, token }))
        set(loadStolSkladAtom)
        set(loadStolIncomeAtom, false)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const addStolAtom = atom(null, async (get, set, data: StolTableSchema) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_STOL)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${SKLAD_ROUTE}${STOL_SKLAD_ROUTE}`, "POST", JSON.stringify({ ...data, token }))
        set(loadStolSkladAtom)
        set(loadStolIncomeAtom, true)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})


export const clearStolAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_STOL)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${SKLAD_ROUTE}${CLEAR_ALL_STOL_SKLAD_ROUTE}`, "DELETE", JSON.stringify({ token }))
        set(loadStolSkladAtom)
        set(loadStolIncomeAtom, true)
        set(loadStolIncomeAtom, false)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})