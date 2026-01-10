import { atom } from "jotai"
import { userAtom } from "../users"
import { RESOURCE } from "../../types/user"
import { fetchData, fetchGetData, FetchResult } from "../../functions/fetch"
import { API_ROUTE, CHAR_PURPOSE_ROUTE, CHARS_ROUTE, FASAD_TYPES_TO_CHAR_ROUTE, IMAGE_ROUTE, MATERIALS_ROUTE, SPEC_TO_CHAR_ROUTE } from "../../types/routes"
import messages from "../../server/messages"
import { OmitId } from "../../types/materials"
import { TableFields } from "../../types/server"
import FasadState from "../../classes/FasadState"
import { FASAD_TYPE } from "../../types/enums"
import { CharPurposeSchema, CharsSchema, FasadDefaultCharSchema, FasadTypeToCharSchema, MatPurposeSchema, SpecToCharSchema } from "../../types/schemas"
import { ExtMap, DefaultMap, makeExtMap } from "../storage"
import { setFasadMaterialId, setFasadType } from "../../functions/fasades"
import { specToCharAtom } from "../specification"

export const charAtom = atom<ExtMap<CharsSchema>>(new Map());
export const charArrayAtom = atom((get) => {
    const chars = get(charAtom)
    return [...chars.entries()].map(value => ({ id: value[0], ...value[1] }))
});
export const charTypesAtom = atom<DefaultMap>(new Map());
export const charPurposeAtom = atom<CharPurposeSchema[]>([]);
export const matPurposeAtom = atom<DefaultMap>(new Map());
export const fasadDefaultCharsAtom = atom<ExtMap<FasadDefaultCharSchema>>(new Map());
export const fasadTypesToCharAtom = atom<FasadTypeToCharSchema[]>([]);

export const loadCharAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchGetData<CharsSchema>(`${API_ROUTE}${MATERIALS_ROUTE}${CHARS_ROUTE}`)
        set(charAtom, makeExtMap(result.data))
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const deleteCharAtom = atom(null, async (get, set, id: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${CHARS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        set(loadCharAtom)
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addCharAtom = atom(null, async (get, set, data: OmitId<CharsSchema>) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${CHARS_ROUTE}`, "POST", JSON.stringify({ data }))
        set(loadCharAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const updateCharAtom = atom(null, async (get, set, data: CharsSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${CHARS_ROUTE}`, "PUT", JSON.stringify({ data }))
        set(loadCharAtom)
        await set(resetCharImageAtom, data.id)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR}
     }
})


export const deleteSpecToCharAtom = atom(null, async (get, set, data: SpecToCharSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData<SpecToCharSchema>(`${API_ROUTE}${MATERIALS_ROUTE}${SPEC_TO_CHAR_ROUTE}`, "DELETE", JSON.stringify({ data }))
        set(specToCharAtom, result.data)
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addSpecToCharAtom = atom(null, async (get, set, data: SpecToCharSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData<SpecToCharSchema>(`${API_ROUTE}${MATERIALS_ROUTE}${SPEC_TO_CHAR_ROUTE}`, "POST", JSON.stringify({ data }))
        set(specToCharAtom, result.data)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const loadFasadTypeToCharAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchGetData<FasadTypeToCharSchema>(`${API_ROUTE}${MATERIALS_ROUTE}${FASAD_TYPES_TO_CHAR_ROUTE}`)
        set(fasadTypesToCharAtom, result.data)
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addFasadTypeToCharAtom = atom(null, async (get, set, data: FasadTypeToCharSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${FASAD_TYPES_TO_CHAR_ROUTE}`, "POST", JSON.stringify({ data }))
        set(loadFasadTypeToCharAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})
export const updateFasadTypeToCharAtom = atom(null, async (get, set, oldData: FasadTypeToCharSchema, data: FasadTypeToCharSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${FASAD_TYPES_TO_CHAR_ROUTE}`, "PUT", JSON.stringify({ oldData, data }))
        set(loadFasadTypeToCharAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const deleteFasadTypeToCharAtom = atom(null, async (get, set, data: FasadTypeToCharSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${FASAD_TYPES_TO_CHAR_ROUTE}`, "DELETE", JSON.stringify({ data }))
        set(loadFasadTypeToCharAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})


export const loadCharPurposeAtom = atom(null, async (get, set) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchGetData<CharPurposeSchema>(`${API_ROUTE}${MATERIALS_ROUTE}${CHAR_PURPOSE_ROUTE}`)
        set(charPurposeAtom, result.data)
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addCharPurposeAtom = atom(null, async (get, set, data: CharPurposeSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${CHAR_PURPOSE_ROUTE}`, "POST", JSON.stringify({ data }))
        set(loadCharPurposeAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})
export const updateCharPurposeAtom = atom(null, async (get, set, oldData: CharPurposeSchema, data: CharPurposeSchema) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${CHAR_PURPOSE_ROUTE}`, "PUT", JSON.stringify({ oldData, data }))
        set(loadCharPurposeAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const deleteCharPurposeAtom = atom(null, async (get, set, charId: number) => {
    const { permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${CHAR_PURPOSE_ROUTE}`, "DELETE", JSON.stringify({ charId }))
        set(loadCharPurposeAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})




export function setInitialMaterials(rootFasades: FasadState[], fasadType: FASAD_TYPE, materialId: number) {
    rootFasades.forEach((f: FasadState) => {
        setFasadMaterialId(f, materialId)
        setFasadType(f, fasadType)
    })
}


export const charImageAtom = atom<{id: number, image: string}[]>([])
const resetCharImageAtom = atom(null, async (get, set, id)=>{
    const images = get(charImageAtom).filter(i => i.id !== id)
    set(charImageAtom, images)
})
export const loadCharImageAtom = atom(null, async (get, set, id: number) => {
    const { permissions } = get(userAtom)
    if (!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    const data = {
        [TableFields.ID]: id
    }
    try {
        const result: FetchResult<string> = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${IMAGE_ROUTE}`, "POST", JSON.stringify(data))
        const images = [...get(charImageAtom)]
        const existImage = images.find(i => i.id === id)
        if (existImage) existImage.image = result.data[0] as string; else images.push({ id, image: result.data[0] as string })
        set(charImageAtom, [...images])
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})



