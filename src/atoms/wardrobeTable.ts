import { atom } from "jotai";
import { WARDROBE_KIND, WardrobeDetailTable } from "../types/wardrobe";
import { userAtom } from "./users";
import { FetchResult, fetchData } from "../functions/fetch";
import { TableFields } from "../types/server";

export const wardrobeTableAtom = atom<WardrobeDetailTable[]>([])

export const loadWardrobeTableAtom = atom(null, async (get, set, kind: WARDROBE_KIND) => {
    const { token } = get(userAtom)
    const formData: any = {}
    formData[TableFields.KIND] = kind
    formData[TableFields.TOKEN] = token
    try {
        const result: FetchResult<WardrobeDetailTable[]> = await fetchData('api/wardrobeTable', "POST", JSON.stringify(formData))
        set(wardrobeTableAtom, result.data as WardrobeDetailTable[])
    } catch (e) { console.error(e) }
})


