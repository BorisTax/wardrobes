import { atom } from "jotai";
import { WARDROBE_KIND } from "../types/wardrobe";
import { WardrobeDetailTableSchema } from "../types/schemas";
import { userAtom } from "./users";
import { FetchResult, fetchData } from "../functions/fetch";
import { TableFields } from "../types/server";
import { API_ROUTE } from "../types/routes";

export const wardrobeTableAtom = atom<WardrobeDetailTableSchema[]>([])

export const loadWardrobeTableAtom = atom(null, async (get, set, kind: WARDROBE_KIND) => {
    const { token } = get(userAtom)
    const formData: any = {}
    formData[TableFields.KIND] = kind
    formData[TableFields.TOKEN] = token
    try {
        const result: FetchResult<WardrobeDetailTableSchema[]> = await fetchData(`${API_ROUTE}/wardrobeTable`, "POST", JSON.stringify(formData))
        set(wardrobeTableAtom, result.data as WardrobeDetailTableSchema[])
    } catch (e) { console.error(e) }
})


