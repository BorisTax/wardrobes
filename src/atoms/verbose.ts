import { atom } from "jotai";
import { VerboseData } from "../types/wardrobe";
import { SpecItem } from "../types/specification";
import { specAtom } from "./storage";

export const verboseDataAtom = atom<{ data: VerboseData, title: string }>({ data: [[]], title: "" })

export const setVerboseDataAtom = atom(null, (get, set, verbose: VerboseData, item: SpecItem) => {
    const spec = get(specAtom)
    const title = spec.get(item)?.name || ""
    set(verboseDataAtom, { data: verbose, title })
})