import { atom, useAtom } from "jotai";
import { ExtMaterial } from "../types/materials";
import { fetchData, fetchFormData, getMaterialList } from "../functions/functions";
import { userAtom } from "./users";
import { FasadMaterial } from "../types/enums";

export const Materials: Map<string, string> = new Map()
Materials.set("ДСП", FasadMaterial.DSP)
Materials.set("ЗЕРКАЛО", FasadMaterial.MIRROR)
Materials.set("ЛАКОБЕЛЬ", FasadMaterial.LACOBEL)
Materials.set("ЛАКОБЕЛЬ(СТЕКЛО)", FasadMaterial.LACOBELGLASS)
Materials.set("ФМП", FasadMaterial.FMP)
Materials.set("ПЕСКОСТРУЙ", FasadMaterial.SAND)

export const MaterialCaptions: Map<string, string> = new Map()
MaterialCaptions.set(FasadMaterial.DSP, "ДСП")
MaterialCaptions.set(FasadMaterial.MIRROR, "ЗЕРКАЛО")
MaterialCaptions.set(FasadMaterial.LACOBEL, "ЛАКОБЕЛЬ")
MaterialCaptions.set(FasadMaterial.LACOBELGLASS, "ЛАКОБЕЛЬ(СТЕКЛО)")
MaterialCaptions.set(FasadMaterial.FMP, "ФМП")
MaterialCaptions.set(FasadMaterial.SAND, "ПЕСКОСТРУЙ")

export type MaterialList = Map<string, ExtMaterial[]>

export const materialListAtom = atom(new Map())

export const loadMaterialListAtom = atom(null, async (get, set) => {
    try {
        const data = await fetchData('api/materials/list', "POST", "")
        const mList = getMaterialList(data.materials)
        set(materialListAtom, mList)
    } catch (e) { }
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
    if (image) formData.append("image", image)
    formData.append("name", material.name)
    formData.append("material", material.material)
    formData.append("code1c", material.code1c)
    formData.append("token", user.token)
    try {
        const result = await fetchFormData("api/materials/add", "POST", formData)
        await set(loadMaterialListAtom)
        callback(result)
    } catch (e) { console.error(e) }
})

export const updateMaterialAtom = atom(null, async (get, set, { name, material, newCode, newName, image }, callback: (result: { success: boolean }) => void) => {
    const user = get(userAtom)
    const formData = new FormData()
    if (image) formData.append("image", image)
    formData.append("name", name)
    formData.append("newName", newName)
    formData.append("material", material)
    formData.append("code1c", newCode)
    formData.append("token", user.token)
    try {
        const result = await fetchFormData("api/materials/update", "PUT", formData)
        await set(loadMaterialListAtom)
        callback(result)
    } catch (e) { console.error(e) }
})

export function useImageUrl(extMaterial: string) {
    const [materials] = useAtom(materialListAtom)
    for (let k of materials.keys()) {
        const mat = (materials.get(k) as ExtMaterial[]).find((m: ExtMaterial) => m.name === extMaterial)
        if (mat) return mat.imageurl
    }
    return ""
}