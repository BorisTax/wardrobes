import { FasadMaterial, SandBase } from "./enums"

export type FasadProps = {
    width?: number
    height?: number
    material?: FasadMaterial
    extMaterial?: string
    sandBase?: SandBase
    minSize?: number
}
