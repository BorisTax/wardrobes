import { getId } from "../functions/fasades"
import { Division, FASAD_TYPE } from "../types/enums"

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
    public id: string
    public active = false
    public level = 0
    public width = 0
    public height = 0
    public widthRatio: number = 1
    public heightRatio: number = 1
    public fixedWidth = false
    public fixedHeight = false
    public outerEdges: {left: boolean, right: boolean, top: boolean, bottom: boolean} = {left: true, right: true, top: true, bottom: true}
    public materialId: number = -1
    public fasadType: FASAD_TYPE = FASAD_TYPE.DSP
    public division: Division = Division.HEIGHT
    public children: FasadState[] = []
    public parentId: string | undefined
    public backImageProps: FasadBackImageProps = getInitialBackImageProps()
    constructor() {
        this.id = getId()
    }
}