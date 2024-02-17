import { atom, useAtom } from "jotai";
import { ExtMaterial } from "../types/materials";
import { fetchData, fetchFormData } from "../functions/fetch";
import { userAtom } from "./users";
import { getMaterialList } from "../functions/materials";
import { appDataAtom } from "./app";
import Fasad from "../classes/Fasad";
import { FasadMaterial } from "../types/enums";
import { TableFields } from "../types/server";

export const materialListAtom = atom(new Map())

export const loadMaterialListAtom = atom(null, async (get, set, setAsInitial = false) => {
    try {
        const data = await fetchData('api/materials/list', "POST", "")
        const mList = getMaterialList(data)
        set(materialListAtom, mList)
        const { rootFasades } = get(appDataAtom)
        const material = [...mList.keys()][0] as FasadMaterial
        const extMaterials = mList.get(material);
        const extMaterial = extMaterials && extMaterials[0].name
        if (setAsInitial) setInitialMaterials(rootFasades, material, extMaterial || "")
    } catch (e) { console.error(e) }
})

export const imageUrlAtom = atom((get) => {
    get(materialListAtom)
})

export const deleteMaterialAtom = atom(null, async (get, set, material: ExtMaterial, callback: (result: { success: boolean }) => void) => {
    const user = get(userAtom)
    try {
        const result = await fetchData("api/materials/delete", "DELETE", JSON.stringify({ name: material.name, material: material.material, token: user.token }))
        await set(loadMaterialListAtom)
        callback(result)
    } catch (e) { console.error(e) }
})

export const addMaterialAtom = atom(null, async (get, set, material: ExtMaterial, image: File | null, callback: (result: { success: boolean }) => void) => {
    const user = get(userAtom)
    const formData = new FormData()
    if (image) formData.append(TableFields.IMAGE, image)
    formData.append(TableFields.NAME, material.name)
    formData.append(TableFields.MATERIAL, material.material)
    formData.append(TableFields.CODE, material.code)
    formData.append(TableFields.TOKEN, user.token)
    try {
        const result = await fetchFormData("api/materials/add", "POST", formData)
        await set(loadMaterialListAtom)
        callback(result)
    } catch (e) { console.error(e) }
})

export const updateMaterialAtom = atom(null, async (get, set, { name, material, newCode, newName, image }, callback: (result: { success: boolean }) => void) => {
    const user = get(userAtom)
    const formData = new FormData()
    if (image) formData.append(TableFields.IMAGE, image)
    formData.append(TableFields.NAME, name)
    formData.append(TableFields.NEWNAME, newName)
    formData.append(TableFields.MATERIAL, material)
    formData.append(TableFields.CODE, newCode)
    formData.append(TableFields.TOKEN, user.token)
    try {
        const result = await fetchFormData("api/materials/update", "PUT", formData)
        await set(loadMaterialListAtom)
        callback(result)
    } catch (e) { console.error(e) }
})

export function setInitialMaterials(rootFasades: Fasad[], material: FasadMaterial, extMaterial: string) {
    rootFasades.forEach((f: Fasad) => {
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