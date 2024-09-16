import { FasadMaterial } from "./enums"

export type FasadProps = {
    width?: number
    height?: number
    material?: FasadMaterial
    extMaterial?: string
    minSize?: number
}
export type FasadBackup = {
    height?: number
    width?: number
    material?: FasadMaterial
    hasBackup?: boolean
}