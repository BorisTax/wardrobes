import { useMemo } from "react"
import { KromkaType, FasadMaterial, Profile } from "../types/materials"

export function useMaterialMap(materialList: FasadMaterial[]): Map<number, FasadMaterial> {
    return useMemo(() => {
        const m = new Map()
        materialList.forEach(mat => m.set(mat.id, mat))
        return m 
    }, [materialList])
}

export function useProfileNamesMap(profileList: Profile[]) {
    return useMemo(() => {
        const m = new Map()
        profileList.forEach(mat => m.set(mat.id, mat.name))
        return m 
    }, [profileList])
}

export function useEdgeTypeMap(edgeTypeList: KromkaType[]) {
    return useMemo(() => {
        const m = new Map()
        edgeTypeList.forEach(mat => m.set(mat.id, mat.caption))
        return m 
    }, [edgeTypeList])
}

export function useMapValue<T extends { id: number }>(list: T[], getValue: (value: T) => string) {
    return useMemo(() => {
        const m = new Map()
        list.forEach(l => m.set(l.id, getValue(l)))
        return m 
    }, [list])
}