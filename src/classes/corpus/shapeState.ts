import { ShapeParams, ShapeType } from "./shape"

export default class ShapeState {
    public id: number = 0
    public length: number = 0
    public width: number = 0
    public thick: number = 0
    public vertical: boolean = false
    public name: string = ""
    public left: number = 0
    public top: number = 0
    public shapeType: ShapeType = ShapeType.DETAIL
    public params: { key: ShapeParams, value: any }[] = []
    public backJointId: number | null = null
    public frontJointId: number | null = null

}