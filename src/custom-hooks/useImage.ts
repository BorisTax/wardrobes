import { useAtomValue, useSetAtom } from "jotai";
import { loadCharImageAtom, charImageAtom } from "../atoms/materials/chars";


export function useImageUrl(id: number) {
    const materials = useAtomValue(charImageAtom);
    const loadMaterialImage = useSetAtom(loadCharImageAtom);
    const mat = materials.find(m => m.id === id);
    if (mat) return mat.image; else loadMaterialImage(id);
    return "";
}
