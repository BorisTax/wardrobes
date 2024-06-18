import { Division, FasadMaterial, SandBase } from "../types/enums"

export type FasadBackImageProps = {
    top: number
    left: number
    size: number | string
    repeat: boolean

}
export function getInitialBackImageProps(): FasadBackImageProps {
    return { top: 0, left: 0, size: 100, repeat: true }
}
export default class FasadState {
    public active: boolean = false
    public level: number = 0
    public width: number = 0
    public height: number = 0
    public fixedWidth: boolean = false
    public fixedHeight: boolean = false
    public outerEdges: {left: boolean, right: boolean, top: boolean, bottom: boolean} = {left: true, right: true, top: true, bottom: true}
    public material: FasadMaterial = FasadMaterial.EMPTY
    public extMaterial: string = ''
    public sandBase: SandBase = SandBase.MIRROR
    public division: Division = Division.HEIGHT
    public children: FasadState[] = []
    public backImageProps: FasadBackImageProps = getInitialBackImageProps()
}