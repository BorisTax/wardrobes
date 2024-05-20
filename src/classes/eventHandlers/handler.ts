import Shape from "../corpus/shape"

export default abstract class Handler{
    public x: number = 0
    public y: number = 0
    public currentShape: Shape | null = null
    public down(sender: Shape | null, e: MouseEvent){
        this.x = e.clientX
        this.y = e.clientY
        
    }
    public move(sender: Shape | null, e: MouseEvent){
        this.x = e.clientX
        this.y = e.clientY
    }
    public up(sender: Shape | null, e: MouseEvent){
        this.x = e.clientX
        this.y = e.clientY
    }
}