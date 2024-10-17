import { atom } from "jotai"
import { userAtom } from "../users"
import { RESOURCE } from "../../types/user"
import { fetchData, FetchResult } from "../../functions/fetch"
import { API_ROUTE, IMAGE_ROUTE, MATERIAL_ROUTE, MATERIALS_ROUTE } from "../../types/routes"
import messages from "../../server/messages"
import { FasadMaterial, OmitId } from "../../types/materials"
import { TableFields } from "../../types/server"
import Fasad from "../../classes/Fasad"
import { FASAD_TYPE } from "../../types/enums"

export const deleteMaterialAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${MATERIAL_ROUTE}`, "DELETE", JSON.stringify({ id, token }))
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addMaterialAtom = atom(null, async (get, set, material: OmitId<FasadMaterial>, image: string) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Create) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: material.name,
        [TableFields.MATERIAL]: material.type,
        [TableFields.CODE]: material.code,
        [TableFields.IMAGE]: image,
        [TableFields.PURPOSE]: material.purpose,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${MATERIAL_ROUTE}`, "POST", JSON.stringify(data))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const updateMaterialAtom = atom(null, async (get, set, { id, name, type: material, code, image, purpose }: FasadMaterial) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Update) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.ID]: id,
        [TableFields.MATERIAL]: material,
        [TableFields.CODE]: code,
        [TableFields.IMAGE]: image,
        [TableFields.PURPOSE]: purpose,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${MATERIAL_ROUTE}`, "PUT", JSON.stringify(data))
        await set(resetMaterialImageAtom, id)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR}
     }
})


export const imageUrlAtom = atom((get) => {
    get(materialListAtom)
})

export function setInitialMaterials(rootFasades: Fasad[], fasadType: FASAD_TYPE, materialId: number) {
    rootFasades.forEach((f: Fasad) => {
        f.setMaterialId(materialId)
        f.setFasadType(fasadType)
    })
}

export const materialImageAtom = atom<{id: number, image: string}[]>([])
const resetMaterialImageAtom = atom(null, async (get, set, id)=>{
    const images = get(materialImageAtom).filter(i => i.id !== id)
    set(materialImageAtom, images)
})
export const loadMaterialImageAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if (!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    const data = {
        [TableFields.ID]: id,
        [TableFields.TOKEN]: token
    }
    try {
        const result: FetchResult<string> = await fetchData(`${API_ROUTE}${MATERIALS_ROUTE}${IMAGE_ROUTE}`, "POST", JSON.stringify(data))
        const images = [...get(materialImageAtom)]
        const existImage = images.find(i => i.id === id)
        if (existImage) existImage.image = result.data[0] as string; else images.push({ id, image: result.data[0] as string })
        set(materialImageAtom, [...images])
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})
export const materialListAtom = atom<FasadMaterial[]>([]);
