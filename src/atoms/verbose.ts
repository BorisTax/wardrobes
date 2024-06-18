import { atom } from "jotai";
import { VerboseData } from "../types/wardrobe";
import { SpecificationItem } from "../types/specification";
import { specificationDataAtom } from "./specification";

export const verboseDataAtom = atom<{ data: VerboseData, title: string }>({ data: [[]], title: "" })

export const setVerboseDataAtom = atom(null, (get, set, verbose: VerboseData, item: SpecificationItem) => {
    const spec = get(specificationDataAtom)
    const title = spec.find(s => s.name === item)?.caption || ""
    set(verboseDataAtom, { data: verbose, title })
})