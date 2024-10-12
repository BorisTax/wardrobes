import { FASAD_TYPE } from "./enums"
import { FasadMaterial } from "./materials"

export type FasadProps = {
    width?: number
    height?: number
    materialId?: number
    fasadType?: FASAD_TYPE
    minSize?: number
}
export type FasadBackup = {
    height?: number
    width?: number
    materialId?: number
    fasadType?: FASAD_TYPE
    hasBackup?: boolean
}