import { atom, useAtomValue, useSetAtom } from "jotai";
import { FasadMaterial, OmitId } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { appDataAtom } from "../app";
import Fasad from "../../classes/Fasad";
import { FASAD_TYPE } from "../../types/enums";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";

export const materialListAtom = atom<FasadMaterial[]>([])
export const materialTypesAtom = atom<Map<FASAD_TYPE, string>>(new Map())

export const loadMaterialListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Read) return { success: false, message: "" }
    try {
        const fetchTypes: FetchResult<{name: FASAD_TYPE, caption: string}[]> = await fetchGetData(`/api/materials/material_types?token=${token}`)
        if (!fetchTypes.success) return
        const m = new Map()
        fetchTypes.data?.forEach(r => m.set(r.name, r.caption))
        set(materialTypesAtom, m)
        const fetchMaterials: FetchResult<[] | string> = await fetchGetData(`/api/materials/material?token=${token}`)
        if (!fetchMaterials.success) return
        set(materialListAtom, fetchMaterials.data as FasadMaterial[])
        const { rootFasades } = get(appDataAtom)
        const materialId = fetchMaterials.data && (fetchMaterials.data as FasadMaterial[])[0]?.id || -1
        const fasadType = fetchMaterials.data && (fetchMaterials.data as FasadMaterial[])[0]?.type
        setInitialMaterials(rootFasades, fasadType as FASAD_TYPE, materialId)
    } catch (e) { console.error(e) }
})


export const imageUrlAtom = atom((get) => {
    get(materialListAtom)
})

export const deleteMaterialAtom = atom(null, async (get, set, id: number) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.Delete) return { success: false, message: "" }
    try{
        const result = await fetchData("/api/materials/material", "DELETE", JSON.stringify({ id, token }))
        await set(loadMaterialListAtom)
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
        const result = await fetchData("/api/materials/material", "POST", JSON.stringify(data))
        await set(loadMaterialListAtom)
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
        const result = await fetchData("/api/materials/material", "PUT", JSON.stringify(data))
        await set(loadMaterialListAtom)
        await set(resetMaterialImageAtom, id)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR}
     }
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
        const result: FetchResult<{image: string}> = await fetchData("/api/materials/image", "POST", JSON.stringify(data))
        const images = [...get(materialImageAtom)]
        const existImage = images.find(i => i.id === id)
        if (existImage) existImage.image = result.data?.image as string; else images.push({ id, image: result.data?.image as string })
        set(materialImageAtom, [...images])
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export function useImageUrl(id: number) {
    const materials = useAtomValue(materialImageAtom)
    const loadMaterialImage = useSetAtom(loadMaterialImageAtom)
    const mat = materials.find(m => m.id === id)
    if (mat) return mat.image; else loadMaterialImage(id)
    return ""
}