import { useMemo } from "react"
import { EdgeType, FasadMaterial, Profile } from "../types/materials"

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

export function useEdgeTypeMap(edgeTypeList: EdgeType[]) {
    return useMemo(() => {
        const m = new Map()
        edgeTypeList.forEach(mat => m.set(mat.id, mat.caption))
        return m 
    }, [edgeTypeList])
}