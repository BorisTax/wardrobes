import { atom, useAtom } from "jotai";
import { ExtMaterial } from "../types/materials";
import { fetchData, fetchFormData, getMaterialList } from "../functions/functions";
import { userAtom } from "./users";

export type MaterialList = Map<string, ExtMaterial[]>

export const materialListAtom = atom(new Map())

export const loadMaterialListAtom = atom(null, async (get, set) => {
    try {
        const data = await fetchData('api/extmaterials', "POST", "")
        const mList = getMaterialList(data.materials)
        set(materialListAtom, mList)
    } catch (e) { }
})

export const imageUrlAtom = atom((get) => {
    get(materialListAtom)
})

export const deleteMaterialAtom = atom(null, async (get, set, material: ExtMaterial) => {
    const user = get(userAtom)
    try {
        await fetchData("api/extmaterials", "DELETE", JSON.stringify({ name: material.name, material: material.material, token: user.token }))
        await set(loadMaterialListAtom)
    } catch (e) { console.error(e) }
})

export const addMaterialAtom = atom(null, async (get, set, material: ExtMaterial, image: File | null) => {
    const user = get(userAtom)
    const formData = new FormData()
    if (image) formData.append("image", image)
    formData.append("name", material.name)
    formData.append("material", material.material)
    formData.append("code1c", material.code1c)
    formData.append("token", user.token)
    console.log(formData)
    try {
        await fetchFormData("api/extmaterials", "PUT", formData)
        await set(loadMaterialListAtom)
    } catch (e) { console.error(e)}
})

export function useImageUrl(extMaterial: string) {
    const [materials] = useAtom(materialListAtom)
    for (let k of materials.keys()) {
        const mat = (materials.get(k) as ExtMaterial[]).find((m: ExtMaterial) => m.name === extMaterial)
        if (mat) return mat.imageurl
    }
    return ""
}