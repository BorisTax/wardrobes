import { useState } from "react"
import { MaterialGroup } from "../../types/enums"
import { MaterialGroupCaptions } from "../../functions/materials"
import EditPlates from "./editDialogs/EditPlates"
import EditProfile from "./editDialogs/EditProfile"
import EditEdge from "./editDialogs/EditEdge"
import EditZaglushka from "./editDialogs/EditZaglushka"
import EditBrush from "./editDialogs/EditBrush"
import EditTrempel from "./editDialogs/EditTrempel"

export default function EditMaterialDialog() {
    const [group, setGroup] = useState<MaterialGroup>(MaterialGroup.PLATE)
    const className = "p-1 border"
    const active = `${className} fw-bold`
    const header = [...MaterialGroupCaptions.entries()].map((item, index) => <div key={index} className={(group === item[0] ? active : className)} onClick={() => { setGroup(item[0] as MaterialGroup) }} role="button">{item[1]}</div>)
    let content = <></>
    switch (group) {
        case MaterialGroup.PLATE:
            content = <EditPlates />
            break;
        case MaterialGroup.PROFILE:
            content = <EditProfile />
            break;
        case MaterialGroup.EDGE:
            content = <EditEdge />
            break;
        case MaterialGroup.ZAGLUSHKI:
            content = <EditZaglushka />
            break;
        case MaterialGroup.BRUSH:
            content = <EditBrush />
            break;
        case MaterialGroup.TREMPEL:
            content = <EditTrempel />
            break;
        default:
    }
    return <div>
        База материалов
        <div className="d-flex">{header}</div>
        <br />
        {content}
    </div>
}
