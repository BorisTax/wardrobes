import { atom, useAtomValue, useSetAtom } from "jotai";
import { ExtMaterial } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { appDataAtom } from "../app";
import Fasad from "../../classes/Fasad";
import { FasadMaterial } from "../../types/enums";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";
import { RESOURCE } from "../../types/user";

export const materialListAtom = atom<ExtMaterial[]>([])

export const loadMaterialListAtom = atom(null, async (get, set) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.read) return { success: false, message: "" }
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`/api/materials/material?token=${token}`)
        if (!result.success) return
        set(materialListAtom, result.data as ExtMaterial[])
        const { rootFasades } = get(appDataAtom)
        const material = result.data && (result.data as ExtMaterial[])[0]?.material
        const extMaterial = result.data && (result.data as ExtMaterial[])[0]?.name
        setInitialMaterials(rootFasades, material as FasadMaterial, extMaterial || "")
    } catch (e) { console.error(e) }
})

export const imageUrlAtom = atom((get) => {
    get(materialListAtom)
})

export const deleteMaterialAtom = atom(null, async (get, set, material: ExtMaterial) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.remove) return { success: false, message: "" }
    try{
        const result = await fetchData("/api/materials/material", "DELETE", JSON.stringify({ name: material.name, material: material.material, token }))
        await set(loadMaterialListAtom)
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addMaterialAtom = atom(null, async (get, set, material: ExtMaterial, image: string) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.create) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: material.name,
        [TableFields.MATERIAL]: material.material,
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

export const updateMaterialAtom = atom(null, async (get, set, { name, material, newCode, newName, image, purpose }) => {
    const { token, permissions } = get(userAtom)
    if(!permissions.get(RESOURCE.MATERIALS)?.update) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.MATERIAL]: material,
        [TableFields.CODE]: newCode,
        [TableFields.IMAGE]: image,
        [TableFields.PURPOSE]: purpose,
        [TableFields.TOKEN]: token
    }
    try {
        const result = await fetchData("/api/materials/material", "PUT", JSON.stringify(data))
        await set(loadMaterialListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR}
     }
})

export function setInitialMaterials(rootFasades: Fasad[], material: FasadMaterial, extMaterial: string) {
    rootFasades.filter(f => f.ExtMaterial === "").forEach((f: Fasad) => {
        f.setMaterial(material)
        f.setExtMaterial(extMaterial)
    })
}

export const materialImageAtom = atom<{material: FasadMaterial, name: string, image: string}[]>([])
export const loadMaterialImageAtom = atom(null, async (get, set, material: FasadMaterial, name: string) => {
    const { token, permissions } = get(userAtom)
    if (!permissions.get(RESOURCE.MATERIALS)?.read) return { success: false, message: "" }
    const data = {
        [TableFields.NAME]: name,
        [TableFields.MATERIAL]: material,
        [TableFields.TOKEN]: token
    }
    try {
        const result: FetchResult<{image: string}> = await fetchData("/api/materials/image", "POST", JSON.stringify(data))
        const images = [...get(materialImageAtom)]
        const existImage = images.find(i => i.name === name && i.material === material)
        if (existImage) existImage.image = result.data?.image as string; else images.push({ material, name, image: result.data?.image as string })
        set(materialImageAtom, [...images])
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
    }
})

export function useImageUrl(material: FasadMaterial, name: string) {
    const materials = useAtomValue(materialImageAtom)
    const loadMaterialImage = useSetAtom(loadMaterialImageAtom)
    const mat = materials.find(m => m.name === name && m.material === material)
    if (mat) return mat.image; else loadMaterialImage(material, name)
    return ""
}