import { atom, useAtomValue } from "jotai";
import { ExtMaterial } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { appDataAtom } from "../app";
import Fasad from "../../classes/Fasad";
import { FasadMaterial } from "../../types/enums";
import { TableFields } from "../../types/server";
import messages from "../../server/messages";

export const materialListAtom = atom<ExtMaterial[]>([])

export const loadMaterialListAtom = atom(null, async (get, set, setAsInitial = false) => {
    const { token } = get(userAtom)
    try {
        const result: FetchResult<[] | string> = await fetchGetData(`api/materials/material?token=${token}`)
        if (!result.success) return
        set(materialListAtom, result.data as ExtMaterial[])
        const { rootFasades } = get(appDataAtom)
        const material = result.data && (result.data as ExtMaterial[])[0]?.material
        const extMaterial = result.data && (result.data as ExtMaterial[])[0]?.name
        //if (setAsInitial) 
        setInitialMaterials(rootFasades, material as FasadMaterial, extMaterial || "")
    } catch (e) { console.error(e) }
})

export const imageUrlAtom = atom((get) => {
    get(materialListAtom)
})

export const deleteMaterialAtom = atom(null, async (get, set, material: ExtMaterial) => {
    const user = get(userAtom)
    try{
        const result = await fetchData("api/materials/material", "DELETE", JSON.stringify({ name: material.name, material: material.material, token: user.token }))
        await set(loadMaterialListAtom)
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addMaterialAtom = atom(null, async (get, set, material: ExtMaterial, image: string) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: material.name,
        [TableFields.MATERIAL]: material.material,
        [TableFields.CODE]: material.code,
        [TableFields.IMAGE]: image,
        [TableFields.PURPOSE]: material.purpose,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/material", "POST", JSON.stringify(data))
        await set(loadMaterialListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
})

export const updateMaterialAtom = atom(null, async (get, set, { name, material, newCode, newName, image, purpose }) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.MATERIAL]: material,
        [TableFields.CODE]: newCode,
        [TableFields.IMAGE]: image,
        [TableFields.PURPOSE]: purpose,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/material", "PUT", JSON.stringify(data))
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

export function useImageUrl(extMaterial: string) {
    const materials = useAtomValue(materialListAtom)
    const mat = materials.find((m: ExtMaterial) => m.name === extMaterial)
    if (mat) return mat.image
    return ""
}