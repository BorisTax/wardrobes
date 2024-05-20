import Shape from "../corpus/shape";
import Handler from "./handler";

export default class SelectHandler extends Handler{
    constructor(){
        super()
    }
    public down(sender: Shape | null, e: MouseEvent){
        super.down(sender, e)
    }
    public move(sender: Shape | null, e: MouseEvent){
        super.move(sender, e)
    }
    public up(sender: Shape | null, e: MouseEvent){
        super.up(sender, e)
    }
}