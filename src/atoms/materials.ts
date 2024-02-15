import { atom, useAtom } from "jotai";
import { ExtMaterial, Profile } from "../types/materials";
import { fetchData, fetchFormData } from "../functions/fetch";
import { userAtom } from "./users";
import { getMaterialList } from "../functions/materials";
import { appDataAtom } from "./app";
import Fasad from "../classes/Fasad";
import { setActiveFasadAtom, setMaterialAtom } from "./fasades";
import { FasadMaterial } from "../types/enums";

export const materialListAtom = atom(new Map())

export const loadMaterialListAtom = atom(null, async (get, set, setAsInitial: boolean = false) => {
    try {
        const data = await fetchData('api/materials/list', "POST", "")
        const mList = getMaterialList(data)
        set(materialListAtom, mList)
        const { rootFasades } = get(appDataAtom)
        const material = [...mList.keys()][0] as FasadMaterial
        if (setAsInitial) {
            rootFasades.forEach((f: Fasad) => {
                set(setActiveFasadAtom, f)
                set(setMaterialAtom, material)
            })
        }
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
    if (image) formData.append("image", image)
    formData.append("name", material.name)
    formData.append("material", material.material)
    formData.append("code1c", material.code)
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