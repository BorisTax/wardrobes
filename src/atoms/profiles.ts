import { atom } from "jotai";
import { Profile } from "../types/materials";
import { fetchGetData } from "../functions/fetch";

export const profileListAtom = atom<Profile[]>([])
export const activeProfileIndexAtom = atom(0)

export const loadProfileListAtom = atom(null, async (get, set) => {
    try {
        const data = await fetchGetData('api/materials/profiles')
        set(profileListAtom, data)
    } catch (e) { console.error(e) }
})