import { atom } from "jotai";
import { Profile } from "../types/materials";
import { fetchData } from "../functions/fetch";

export const profileListAtom = atom<Profile[]>([])
export const activeProfileIndexAtom = atom(0)

export const loadProfileListAtom = atom(null, async (get, set) => {
    try {
        const data = await fetchData('api/materials/profiles', "POST", "")
        set(profileListAtom, data)
    } catch (e) { console.error(e) }
})