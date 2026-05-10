import { atom } from "jotai";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { RESOURCE } from "../types/user";
import { IncomeMatTableSchema, MatSkladColorsTableSchema, MatSkladDepartmentTableSchema, MatSkladTableSchema, MatSkladThicknessTableSchema, OutcomeMatTableSchema } from "../types/schemas";
import { API_ROUTE, SKLAD_ROUTE, MAT_COLORS_SKLAD_ROUTE, MAT_SKLAD_ROUTE, MAT_INCOME_ROUTE, MAT_OUTCOME_ROUTE, CLEAR_ALL_MAT_SKLAD_ROUTE, MAT_THICK_SKLAD_ROUTE, MAT_DEPART_SKLAD_ROUTE } from "../types/routes";
import { DefaultMap, ExtMap, makeDefaultMap, makeExtMap } from "./storage";
import { userAtom } from "./users";
import messages from "../server/messages";


export const matSkladColorsAtom = atom<ExtMap<MatSkladColorsTableSchema>>(new Map())
export const matSkladThickAtom = atom<DefaultMap>(new Map())
export const matSkladDepartAtom = atom<DefaultMap>(new Map())
export const matSkladAtom = atom<MatSkladTableSchema[]>([])
export const matSkladIncomeAtom = atom<IncomeMatTableSchema[]>([])
export const matSkladOutcomeAtom = atom<OutcomeMatTableSchema[]>([])

export const loadMatSkladColorsAtom = atom(null, async (get, set) => {
    const { permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_MAT)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<MatSkladColorsTableSchema> = await (await fetchGetData(`${API_ROUTE}${SKLAD_ROUTE}${MAT_COLORS_SKLAD_ROUTE}`))
        const data = fetchData.data
        set(matSkladColorsAtom, makeExtMap(data))
    } catch (e) { console.error(e) }
})
export const loadMatSkladThickAtom = atom(null, async (get, set) => {
    const { permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_MAT)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<MatSkladThicknessTableSchema> = await (await fetchGetData(`${API_ROUTE}${SKLAD_ROUTE}${MAT_THICK_SKLAD_ROUTE}`))
        const data = fetchData.data
        set(matSkladThickAtom, makeDefaultMap(data))
    } catch (e) { console.error(e) }
})
export const loadMatSkladDepartAtom = atom(null, async (get, set) => {
    const { permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_MAT)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<MatSkladDepartmentTableSchema> = await (await fetchGetData(`${API_ROUTE}${SKLAD_ROUTE}${MAT_DEPART_SKLAD_ROUTE}`))
        const data = fetchData.data
        set(matSkladDepartAtom, makeDefaultMap(data))
    } catch (e) { console.error(e) }
})
export const loadMatSkladAtom = atom(null, async (get, set) => {
    const { permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_MAT)?.Read) return { success: false, message: "" }
    try {
        const fetchData: FetchResult<MatSkladTableSchema> = await (await fetchGetData(`${API_ROUTE}${SKLAD_ROUTE}${MAT_SKLAD_ROUTE}`))
        const data = fetchData.data
        set(matSkladAtom, data)
    } catch (e) { console.error(e) }
})

export const loadMatSkladIncomeAtom = atom(null, async (get, set, income: boolean) => {
    const { permissions} = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_MAT)?.Read) return { success: false, message: "" }
    const route = income?MAT_INCOME_ROUTE:MAT_OUTCOME_ROUTE
    try {
        const fetchData: FetchResult<IncomeMatTableSchema> = await (await fetchGetData(`${API_ROUTE}${SKLAD_ROUTE}${route}`))
        const data = fetchData.data
        income ? set(matSkladIncomeAtom, data) : set(matSkladOutcomeAtom, data)
    } catch (e) { console.error(e) }
})


export const deleteMatSkladAtom = atom(null, async (get, set, data: MatSkladTableSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_MAT)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${SKLAD_ROUTE}${MAT_SKLAD_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        set(loadMatSkladAtom)
        set(loadMatSkladIncomeAtom, false)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const addMatSkladAtom = atom(null, async (get, set, data: MatSkladTableSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_MAT)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${SKLAD_ROUTE}${MAT_SKLAD_ROUTE}`, "POST", JSON.stringify({ ...data }))
        set(loadMatSkladAtom)
        set(loadMatSkladIncomeAtom, true)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})


export const clearMatSkladAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.SKLAD_MAT)?.Delete) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${SKLAD_ROUTE}${CLEAR_ALL_MAT_SKLAD_ROUTE}`, "DELETE", JSON.stringify({  }))
        set(loadMatSkladAtom)
        set(loadMatSkladIncomeAtom, true)
        set(loadMatSkladIncomeAtom, false)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})