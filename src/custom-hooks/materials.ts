import { useMemo } from "react"
import { FasadMaterial } from "../types/materials"
import { useAtomValue } from "jotai"
import { fasadDefaultCharsAtom } from "../atoms/materials/chars"
import { FASAD_TYPE } from "../types/enums"

export function useMaterialMap(materialList: FasadMaterial[]): Map<number, FasadMaterial> {
    return useMemo(() => {
        const m = new Map()
        materialList.forEach(mat => m.set(mat.id, mat))
        return m 
    }, [materialList])
}

export function useDefaultFasadChars(){
    const fasadDefaultChars = useAtomValue(fasadDefaultCharsAtom)
    const dspDefaultId = fasadDefaultChars.get(FASAD_TYPE.DSP)?.charId || 0
    const mirrorDefaultId = fasadDefaultChars.get(FASAD_TYPE.MIRROR)?.charId || 0
    const lacobelDefaultId = fasadDefaultChars.get(FASAD_TYPE.LACOBEL)?.charId || 0
    const sandDefaultId = fasadDefaultChars.get(FASAD_TYPE.SAND)?.charId || 0
    const fmpDefaultId = fasadDefaultChars.get(FASAD_TYPE.FMP)?.charId || 0
    return {
        dspDefaultId,
        mirrorDefaultId,
        lacobelDefaultId,
        sandDefaultId,
        fmpDefaultId
    }
}


export function useMapValue<T extends { id: number }>(list: T[], getValue: (value: T) => string) {
    return useMemo(() => {
        const m = new Map()
        list.forEach(l => m.set(l.id, getValue(l)))
        return m 
    }, [list, getValue])
}