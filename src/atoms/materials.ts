import { atom, useAtom } from "jotai";
import { ExtMaterial } from "../server/types/materials";
import { FetchResult, fetchData, fetchGetData } from "../functions/fetch";
import { userAtom } from "./users";
import { MaterialList, getMaterialList } from "../functions/materials";
import { appDataAtom } from "./app";
import Fasad from "../classes/Fasad";
import { FasadMaterial } from "../types/enums";
import { TableFields } from "../server/types/server";
import { AtomCallbackResult } from "../types/atoms";

export const materialListAtom = atom(new Map())

export const loadMaterialListAtom = atom(null, async (get, set, setAsInitial = false) => {
    try {
        const { success, data }: FetchResult = await fetchGetData('api/materials/material')
        if (!success) return
        const mList = getMaterialList(data as ExtMaterial[])
        set(materialListAtom, mList)
        const { rootFasades } = get(appDataAtom)
        const material = [...mList.keys()][0] as FasadMaterial
        const extMaterials = mList.get(material);
        const extMaterial = extMaterials && extMaterials[0].name
        //if (setAsInitial) 
        setInitialMaterials(rootFasades, material, extMaterial || "")
    } catch (e) { console.error(e) }
})

export const imageUrlAtom = atom((get) => {
    get(materialListAtom)
})

export const deleteMaterialAtom = atom(null, async (get, set, material: ExtMaterial, callback: AtomCallbackResult) => {
    const user = get(userAtom)
    const result = await fetchData("api/materials/material", "DELETE", JSON.stringify({ name: material.name, material: material.material, token: user.token }))
    await set(loadMaterialListAtom)
    callback({ success: result.success as boolean, message: result.message as string })
})

export const addMaterialAtom = atom(null, async (get, set, material: ExtMaterial, image: string, callback: AtomCallbackResult) => {
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
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})

export const updateMaterialAtom = atom(null, async (get, set, { name, material, newCode, newName, image, purpose }, callback: AtomCallbackResult) => {
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
        callback({ success: result.success as boolean, message: result.message as string })
    } catch (e) { console.error(e) }
})

export function setInitialMaterials(rootFasades: Fasad[], material: FasadMaterial, extMaterial: string) {
    rootFasades.filter(f => f.ExtMaterial === "").forEach((f: Fasad) => {
        f.setMaterial(material)
        f.setExtMaterial(extMaterial)
    })
}

export function useImageUrl(extMaterial: string) {
    const [materials] = useAtom(materialListAtom)
    for (const k of materials.keys()) {
        const mat = (materials.get(k) as ExtMaterial[]).find((m: ExtMaterial) => m.name === extMaterial)
        if (mat) return mat.image
    }
    return ""
}