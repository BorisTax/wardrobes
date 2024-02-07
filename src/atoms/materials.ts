import { atom, useAtom } from "jotai";
import { ExtMaterial } from "../types/materials";
import { fetchData, getMaterialList } from "../functions/functions";

export type MaterialList = Map<string, ExtMaterial[]>

export const materialListAtom = atom(new Map())

export const loadMaterialListAtom = atom(null, async (get, set) => {
    try {
        const data = await fetchData('api/extmaterials', "")
        const mList = getMaterialList(data.materials)
        set(materialListAtom, mList)
    } catch (e) { }
})

export const imageUrlAtom = atom((get) => {
    get(materialListAtom)
})

export function useImageUrl(extMaterial: string) {
    const [materials] = useAtom(materialListAtom)
    for (let k of materials.keys()) {
        const mat = (materials.get(k) as ExtMaterial[]).find((m: ExtMaterial) => m.name === extMaterial)
        if(mat) return mat.imageurl
    }
    return ""
}