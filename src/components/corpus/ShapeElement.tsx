import Shape from "../../classes/corpus/shape";
type ShapeElementProps = {
    shape: Shape
}
export default function ShapeElement({ shape }: ShapeElementProps) {
    return <div style={{position: "absolute",
                        top: shape.Top,
                        left: shape.Left,
                        width: shape.Vertical?shape.Thick:shape.Length + "px",
                        height: shape.Vertical?shape.Length:shape.Thick + "px",
                        border: "1px solid black",
    }}>

    </div>
}