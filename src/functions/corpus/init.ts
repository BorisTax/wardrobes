import DetailShape from "../../classes/corpus/detailshape"
import Shape, { ShapeParams, ShapeType } from "../../classes/corpus/shape"
import ShapeState from "../../classes/corpus/shapeState"

export function newShapeFromState(state: ShapeState): Shape {
    const params: Map<string, any> = new Map(state.params.map((p: { key: string, value: any }) => [p.key, p.value]))
    const shape = createShape(state.id, state.shapeType, state.length, state.width, state.thick, state.name, state.vertical, state.left, state.top, params)
    return shape
}

export function createShape(id: number, shapeType: ShapeType, shapeLength: number, shapeWidth: number, shapeThick: number,  name: string, vertical: boolean, left: number, top: number, params: Map<string, any>): Shape {
    const shape = getShapeByType(shapeType)
    if (!shape) throw new Error('Invalid shape type')
    shape.Id = id
    shape.Name = name
    shape.Length = shapeLength
    shape.Width = shapeWidth
    shape.Vertical = vertical
    shape.Thick = shapeThick
    params.forEach((value, key) => {
        shape.setParam(key as ShapeParams, value)
    })
    shape.Left = left
    shape.Top = top
    return shape
}

function getShapeByType(shapeType: ShapeType): Shape | null {
    switch (shapeType) {
        case ShapeType.DETAIL:
            return new DetailShape()
        default:
            return null
    }
}


export function createSingleWardrobe(wardHeight: number, wardDepth: number, wardWidth: number): Shape[] {
    const params = new Map<string, any>()
    params.set(ShapeParams.MOVEABLE_PARAM, false)
    params.set(ShapeParams.FIXABLE_PARAM, true)
    params.set(ShapeParams.FIXED_PARAM, true)
    params.set(ShapeParams.FIXABLEMOVE_PARAM, true)
    params.set(ShapeParams.REMOVEABLE_PARAM, false)
    const thick = 16
    const leftStand = createShape(0, ShapeType.DETAIL, wardHeight - 62, wardDepth, thick,  "СТОЙКА", true, 0, thick, params) as Shape
    const rightStand = createShape(1, ShapeType.DETAIL, wardHeight - 62, wardDepth, thick, "СТОЙКА", true, wardWidth - thick, thick, params) as Shape
    const roof = createShape(2, ShapeType.DETAIL, wardWidth, wardDepth, thick, "КРЫША", false, 0, 0, params) as Shape
    params.set(ShapeParams.FIXABLEMOVE_PARAM, false)
    const bottom = createShape(3, ShapeType.DETAIL, wardWidth, wardDepth, thick, "ДНО", false, 0, wardHeight - 30 - thick, params) as Shape
    leftStand.JointsToFront.add(roof)
    leftStand.JointsToFront.add(bottom)
    rightStand.JointsToBack.add(roof)
    rightStand.JointsToBack.add(bottom)
    roof.JointsToFront.add(leftStand)
    roof.JointsToFront.add(rightStand)
    bottom.JointsToBack.add(leftStand)
    bottom.JointsToBack.add(rightStand)

    leftStand.BackJoint = roof
    leftStand.FrontJoint = bottom
    rightStand.BackJoint = roof
    rightStand.FrontJoint = bottom
    roof.BackJoint = leftStand
    roof.FrontJoint = rightStand
    bottom.BackJoint = leftStand
    bottom.FrontJoint = rightStand
    const shapes = []
    shapes.push(leftStand)
    shapes.push(rightStand)
    shapes.push(roof)
    shapes.push(bottom)
    return shapes
}