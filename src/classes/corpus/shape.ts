import ShapeState from "./shapeState"

export default abstract class Shape {
    public id: number = 0
    public length: number = 0
    public width: number = 0
    public thick: number = 0
    public vertical: boolean = false
    public name: string = ""
    public left: number = 0
    public top: number = 0
    public shapeType: ShapeType = ShapeType.DETAIL
    private params: Map<ShapeParams, any> = new Map()
    private active: boolean = false
    private backJoint: Shape | null = null
    private frontJoint: Shape | null = null
    private jointsToBack: Set<Shape> = new Set()
    private jointsToFront: Set<Shape> = new Set()
    private nearest: ShapesParallel = { back: [], front: [] }
    private linkedShapes: Set<Shape> = new Set()
    public getParam(param: ShapeParams): any {
        return this.params.get(param)
    }
    public setParam(param: ShapeParams, value: any) {
        this.params.set(param, value)
    }
    public getState(): ShapeState{
        const state: ShapeState = {
            id: this.id,
            name: this.name,
            shapeType: this.shapeType,
            length: this.length,
            width: this.width,
            thick: this.thick,
            left: this.left,
            top: this.top,
            vertical: this.vertical,
            backJointId: this.backJoint?.Id || null,
            frontJointId: this.frontJoint?.Id || null,
            params: [...this.params].map((p: [ShapeParams, any]) => ({ key: p[0], value: p[1] }))
        }
        return state
    }
    public setState(state: ShapeState, shapes: Shape[]){
        this.id = state.id
        this.name = state.name
        this.shapeType = state.shapeType
        this.length = state.length
        this.width = state.width
        this.thick = state.thick
        this.left = state.left
        this.top = state.top
        this.vertical = state.vertical
        this.backJoint = shapes.find(s => s.Id === state.backJointId) || null
        this.frontJoint = shapes.find(s => s.Id === state.frontJointId) || null
        this.params = new Map(state.params.map((p: { key: ShapeParams, value: any }) => [p.key, p.value]))
        return state
    }
    public get Active(): boolean {
        return this.active
    }
    public set Active(value: boolean) {
        this.active = value
    }
    public get Id(): number {
        return this.id
    }
    public set Id(value: number) {
        this.id = value
    }
    public get Name(): string {
        return this.name
    }
    public set Name(value: string) {
        this.name = value
    }
    public get Length(): number {
        return this.length
    }
    public set Length(value: number) {
        this.length = value
    }
    public get Width(): number {
        return this.width
    }
    public set Width(value: number) {
        this.width = value
    }
    public get Thick(): number {
        return this.thick
    }
    public set Thick(value: number) {
        this.thick = value
    }
    public get MinSize(): number {
        return this.params.get(ShapeParams.MINSIZE_PARAM)
    }
    public set MinSize(value: number) {
        this.params.set(ShapeParams.MINSIZE_PARAM, value)
    }
    public get MaxSize(): number {
        return this.params.get(ShapeParams.MAXSIZE_PARAM)
    }
    public set MaxSize(value: number) {
        this.params.set(ShapeParams.MAXSIZE_PARAM, value)
    }
    public get Vertical(): boolean {
        return this.vertical
    }
    public set Vertical(value: boolean) {
        this.vertical = value
    }
    public get Nearest(): ShapesParallel {
        return this.nearest
    }
    public set Nearest(value: ShapesParallel) {
        this.nearest = value
    }
    public get JointsToBack(): Set<Shape> {
        return this.jointsToBack
    }
    public set JointsToBack(value: Set<Shape>) {
        this.jointsToBack = value
    }
    public get JointsToFront(): Set<Shape> {
        return this.jointsToFront
    }
    public set JointsToFront(value: Set<Shape>) {
        this.jointsToFront = value
    }
    public get BackJoint(): Shape | null {
        return this.backJoint
    }
    public set BackJoint(value: Shape | null) {
        this.backJoint = value
    }
    public get FrontJoint(): Shape | null {
        return this.frontJoint
    }
    public set FrontJoint(value: Shape | null) {
        this.frontJoint = value
    }
    public get LinkedShapes(): Set<Shape> {
        return this.linkedShapes
    }
    public set LinkedShapes(value: Set<Shape>) {
        this.linkedShapes = value
    }
    public get Left(): number {
        return this.left
    }
    public set Left(value: number) {
        this.left = value
    }
    public get Top(): number {
        return this.top
    }
    public set Top(value: number) {
        this.top = value
    }
    public get FixedLength(): boolean {
        return this.params.get(ShapeParams.FIXEDLENGTH_PARAM)
    }
    public set FixedLength(value: boolean) {
        this.params.set(ShapeParams.FIXEDLENGTH_PARAM, value)
    }
    public get ShapeType(): ShapeType {
        return this.shapeType
    }
    public set ShapeType(value: ShapeType) {
        this.shapeType = value
    }
}

export enum ShapeParams {
    MOVEABLE_PARAM = "moveable",
    FIXABLE_PARAM = "fixable",
    FIXED_PARAM = "fixed",
    FIXEDLENGTH_PARAM = "fixedLength",
    FIXABLEMOVE_PARAM = "fixablemove",
    REMOVEABLE_PARAM = "removeable",
    MARGIN_PARAM = "margin",
    MINSIZE_PARAM = "minSize",
    MAXSIZE_PARAM = "maxSize",
}

export type ShapesParallel = {
    back: Shape[]
    front: Shape[]
}
export enum ShapeType {
    DETAIL = "DETAIL",
    DIMENSION = "DIMENSION",
    TUBE = "TUBE",
}