import { Division, FasadMaterial, SandBase } from "../types/enums"

export default class FasadState {
    public width: number = 0
    public height: number = 0
    public fixedWidth: boolean = false
    public fixedHeight: boolean = false
    public material: FasadMaterial = FasadMaterial.DSP
    public extMaterial: string = ''
    public sandBase: SandBase = SandBase.MIRROR
    public division: Division = Division.HEIGHT
    public children: FasadState[] = []
}