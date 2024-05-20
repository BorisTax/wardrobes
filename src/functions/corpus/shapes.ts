import Shape, { ShapeParams, ShapeType, ShapesParallel } from "../../classes/corpus/shape"

export function prepareToMove(shapes: Set<Shape>, selectedShapes: Set<Shape>) {
    selectedShapes.forEach((s: Shape) => {
        if (!s.getParam(ShapeParams.MOVEABLE_PARAM)) {
            selectedShapes.delete(s)
        } else {
            s.Nearest = getNearest(s, shapes)
            s.LinkedShapes.forEach((s1: Shape) => {
                s1.Nearest = getNearest(s1, shapes)
            })
        }
    })
}

function selectLinkedShapes(selectedShapes: Set<Shape>, value: boolean) {
    selectedShapes.forEach((s: Shape) => {
        s.LinkedShapes.forEach((linked: Shape) => {
            if (value) selectedShapes.add(linked); else selectedShapes.delete(linked)
        })
    });
}

function sortSelected(shapes: Set<Shape>, direction: boolean): Set<Shape>{
    const vert = [...shapes][0].Vertical
    let sorted = [...shapes]
    sorted = sorted.toSorted((s1: Shape, s2: Shape)=>{
        const value1 = vert? s1.Left: s1.Top
        const value2 = vert? s2.Left: s2.Top
        return direction ? (value1 < value2 ? -1 : 1) : (value1 > value2 ? -1 : 1)
    })
    return new Set(sorted)
}

export function moveShapes(active: Shape | null, selectedShapes: Set<Shape>, dx: number, dy: number): number {
    const movedShapes: Shape[] = []
    const movedShapesD: number[] = []
    const shape = active
    if (!shape) return 0
    let d = shape.Vertical ? dx : dy
    let d0 = d
    let minD = d
    const sorted = sortSelected(selectedShapes, d < 0)
    sorted.forEach((shape: Shape) => {
        d0 = moveShape(shape, d, true)
        if (d0 !== 0) {
            if (movedShapes.length === 0) {
                movedShapes.push(shape)
                movedShapesD.push(d0)
            } else {
                movedShapes.unshift(shape)
                movedShapesD.unshift(d0)
            }
        }
        if (Math.abs(minD) > Math.abs(d0)) minD = d0
    })

    if (minD !== d) {
        movedShapes.forEach((s: Shape, index: number) => {
            moveShape(s, -movedShapesD[index] + minD, true)
        })
    }
    return minD
}

export function moveShape(shape: Shape, d: number, doMove: boolean): number {
    let res: number
    if (shape.Vertical) {
        res = tryMoveToVerticalNearest(shape, d)
        res = tryResizeHorizontalJoints(shape, res, doMove)
        if (doMove) shape.Left = shape.Left + res
    } else {
        res = tryMoveToHorizontalNearest(shape, d)
        res = tryResizeVerticalJoints(shape, res, doMove)
        if (doMove) shape.Top = shape.Top + res
    }
    //If Not sCallback Is Nothing Then sCallback.callback sShapeManager
    return res
}

function getNearest(shape: Shape, shapes: Set<Shape>): ShapesParallel{
let minBack = -100000
let minFront = 100000
const res: ShapesParallel = {back: [], front: []}
shapes.forEach((s: Shape)=>{
    if (s.ShapeType === ShapeType.DIMENSION) return;
    if ((s!==shape) && (s.Vertical = shape.Vertical)) {
        if (s.Vertical && isShapesIntersectVertical(s, shape)) {
            let d = s.Left - shape.Left
            if (d > 0) res.front.push(s); else res.back.push(s)
            }
        if ((!s.Vertical) && isShapesIntersectHorizontal(s, shape)){ 
            let d = s.Top - shape.Top
            if (d > 0) res.front.push(s); else res.back.push(s)
            }
    }
})
return res
}

function tryMoveToVerticalNearest(shape: Shape, dx: number): number {
    const back = shape.Nearest.back
    const front = shape.Nearest.front
    let minBack = 10000
    let margin = 0
    let newBack = 0
    back.forEach((s: Shape) => {
        margin = Math.max(shape.getParam(ShapeParams.MARGIN_PARAM), s.getParam(ShapeParams.MARGIN_PARAM))
        newBack = dx
        if ((shape.Left + dx) < (s.Left + s.Thick + margin)) {
            newBack = s.Left + s.Thick + margin - shape.Left
            if (Math.abs(minBack) > Math.abs(newBack)) minBack = newBack
        }

    })
    if (minBack !== 10000) return minBack
    let minFront = 10000
    let newFront = 0
    front.forEach((s: Shape) => {
        newFront = dx
        if ((shape.Left + shape.Thick + dx) > (s.Left - margin)) {
            newFront = s.Left - margin - shape.Left - shape.Thick
            if (Math.abs(minFront) > Math.abs(newFront)) minFront = newFront
        }
        if (minFront !== 10000) return minFront
    })
    return dx
}

function tryMoveToHorizontalNearest(shape: Shape, dy: number): number {
    let margin = 0
    const back = shape.Nearest.back
    const front = shape.Nearest.front
    let minBack = 10000
    let newBack = 0
    back.forEach((s: Shape) => {
        margin = Math.max(shape.getParam(ShapeParams.MARGIN_PARAM), s.getParam(ShapeParams.MARGIN_PARAM))
        newBack = dy
        if ((shape.Top + dy) < (s.Top + s.Thick + margin)) {
            newBack = s.Top + s.Thick + margin - shape.Top
            if (Math.abs(minBack) > Math.abs(newBack)) minBack = newBack
        }

    })
    if (minBack !== 10000) return minBack
    let minFront = 10000
    let newFront = 0
    front.forEach((s: Shape) => {
        newFront = dy
        if ((shape.Top + shape.Thick + dy) > (s.Top - margin)) {
            newFront = s.Top - margin - shape.Top - shape.Thick
            if (Math.abs(minFront) > Math.abs(newFront)) minFront = newFront
        }
    })
    if (minFront !== 10000) return minFront
    return dy
}

function tryResizeVerticalJoints(shape: Shape, dy: number, doResize: boolean): number {
    let minBack = 100000
    let minFront = 100000
    if (shape.JointsToBack.size > 0) {
        shape.JointsToBack.forEach((s: Shape) => {
            let d = dy
            if ((s.Length + dy) < s.MinSize) d = s.MinSize - s.Length
            if ((s.Length + dy) > s.MaxSize) d = s.MaxSize - s.Length
            if (Math.abs(d) < Math.abs(minBack)) minBack = d
            if (s.FixedLength) minBack = 0
        })
    }
    if (shape.JointsToFront.size > 0) {
        shape.JointsToFront.forEach((s: Shape) => {
            let d = dy
            if ((s.Length - dy) < s.MinSize) d = s.Length - s.MinSize
            if ((s.Length - dy) > s.MaxSize) d = s.Length - s.MaxSize
            if (Math.abs(d) < Math.abs(minFront)) minFront = d
            if (s.FixedLength) minFront = 0
        })
    }
    const min = (Math.abs(minBack) < Math.abs(minFront) ? minBack : minFront)
    if (min === 0) return 0
    if (shape.JointsToBack.size > 0) {
        shape.JointsToBack.forEach((s: Shape) => {
            if (doResize) s.Length = s.Length + min
        })
    }
    if (shape.JointsToFront.size > 0) {
        shape.JointsToFront.forEach((s: Shape) => {
            if (doResize) {
                s.Length = s.Length - min
                s.Top = s.Top + min
            }

        })
    }
    return min === 100000 ? dy : min
}

function tryResizeHorizontalJoints(shape: Shape, dx: number, doResize: boolean): number {
    let minBack = 100000
    let minFront = 100000
    if (shape.JointsToBack.size > 0) {
        shape.JointsToBack.forEach((s: Shape) => {
            let d = dx
            if ((s.Length + dx) < s.MinSize) d = s.MinSize - s.Length
            if ((s.Length + dx) > s.MaxSize) d = s.MaxSize - s.Length
            if (Math.abs(d) < Math.abs(minBack)) minBack = d
            if (s.FixedLength) minBack = 0
        })
    }
    if (shape.JointsToFront.size > 0) {
        shape.JointsToFront.forEach((s: Shape) => {
            let d = dx
            if ((s.Length - dx) < s.MinSize) d = s.Length - s.MinSize
            if ((s.Length - dx) > s.MaxSize) d = s.Length - s.MaxSize
            if (Math.abs(d) < Math.abs(minFront)) minFront = d
            if (s.FixedLength) minFront = 0
        })
    }
    const min = Math.abs(minBack) < Math.abs(minFront) ? minBack : minFront
    if (min === 0) return 0
    if (shape.JointsToBack.size > 0) {
        shape.JointsToFront.forEach((s: Shape) => {
            if (doResize) s.Length = s.Length + min
        })
    }
    if (shape.JointsToFront.size > 0) {
        shape.JointsToFront.forEach((s: Shape) => {
            if (doResize) {
                s.Length = s.Length - min
                s.Left = s.Left + min
            }

        })
    }
    return min === 100000 ? dx : min
}


function isPointInShapeWidth(x: number, shape: Shape): boolean{
return !shape.Vertical && shape.Left <= x && (shape.Left + shape.Length) >= x
}
function isPointInShapeHeight(y: number, shape: Shape) : boolean{
return shape.Vertical && shape.Top <= y && (shape.Top + shape.Length) >= y
}
function isShapesIntersectVertical(s1: Shape, s2: Shape): boolean{
return (isPointInShapeHeight(s1.Top, s2) || isPointInShapeHeight(s1.Top + s1.Length, s2)) || (isPointInShapeHeight(s2.Top, s1) || isPointInShapeHeight(s2.Top + s2.Length, s1))
}
function isShapesIntersectHorizontal(s1: Shape, s2: Shape) : boolean{
return (isPointInShapeWidth(s1.Left, s2) || isPointInShapeWidth(s1.Left + s1.Length, s2)) || (isPointInShapeWidth(s2.Left, s1) || isPointInShapeWidth(s2.Left + s2.Length, s1))
}