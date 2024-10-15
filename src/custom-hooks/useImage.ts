import { useAtomValue, useSetAtom } from "jotai";
import { loadMaterialImageAtom, materialImageAtom } from "../atoms/materials/chars";


export function useImageUrl(id: number) {
    const materials = useAtomValue(materialImageAtom);
    const loadMaterialImage = useSetAtom(loadMaterialImageAtom);
    const mat = materials.find(m => m.id === id);
    if (mat) return mat.image; else loadMaterialImage(id);
    return "";
}
