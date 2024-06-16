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
    const header = [...MaterialGroupCaptions.entries()].map((item, index) => <div key={index} className={(group === item[0] ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setGroup(item[0] as MaterialGroup) }} role="button">{item[1]}</div>)
    const content = getGroup(group)
    return <div>
        <div className="d-flex justify-content-center">{header}</div>
        <br />
        {content}
    </div>
}

function getGroup(group: MaterialGroup) {
    const groups = {
        [MaterialGroup.PLATE]: <EditPlates />,
        [MaterialGroup.PROFILE]: <EditProfile />,
        [MaterialGroup.EDGE]: <EditEdge />,
        [MaterialGroup.ZAGLUSHKI]: <EditZaglushka />,
        [MaterialGroup.BRUSH]: <EditBrush />,
        [MaterialGroup.TREMPEL]: <EditTrempel />,
    }
    return groups[group] || <></>
}