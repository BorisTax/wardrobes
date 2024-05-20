import Shape, { ShapeType } from "./shape"

export default class DetailShape extends Shape {
    constructor(){
        super()
        this.ShapeType = ShapeType.DETAIL

    }
}
