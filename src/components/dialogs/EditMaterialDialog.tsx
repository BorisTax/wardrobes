import { useEffect, useState } from "react"
import { MaterialGroup } from "../../types/enums"
import { MaterialGroupCaptions } from "../../functions/materials"
import EditPlates from "./editMaterialDialogs/EditPlates"
import EditProfile from "./editMaterialDialogs/EditProfile"
import EditEdge from "./editMaterialDialogs/EditEdge"
import EditZaglushka from "./editMaterialDialogs/EditZaglushka"
import EditBrush from "./editMaterialDialogs/EditBrush"
import EditTrempel from "./editMaterialDialogs/EditTrempel"
import EditUplotnitel from "./editMaterialDialogs/EditUplotnitel"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"

export default function EditMaterialDialog() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MATERIALS)
    const [group, setGroup] = useState<MaterialGroup>(MaterialGroup.PLATE)
    const header = [...MaterialGroupCaptions.entries()].map((item, index) => <div key={index} className={(group === item[0] ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setGroup(item[0] as MaterialGroup) }} role="button">{item[1]}</div>)
    const content = getGroup(group)
    useEffect(() => {
        if (!perm?.Read) window.location.replace('/')
    }, [perm])
    return <div className="database-edit-container">
        <div className="tab-header-container">{header}</div>
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
        [MaterialGroup.UPLOTNITEL]: <EditUplotnitel />,
    }
    return groups[group] || <></>
}