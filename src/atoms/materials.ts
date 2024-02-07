import { atom } from "jotai";
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

