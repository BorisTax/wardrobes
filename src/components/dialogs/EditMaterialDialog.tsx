import { useEffect, useState } from "react"
import { MaterialGroup } from "../../types/enums"
import { MaterialGroupCaptions } from "../../functions/materials"
import EditPlates from "./editDialogs/EditPlates"
import EditProfile from "./editDialogs/EditProfile"
import EditEdge from "./editDialogs/EditEdge"
import EditZaglushka from "./editDialogs/EditZaglushka"
import EditBrush from "./editDialogs/EditBrush"
import EditTrempel from "./editDialogs/EditTrempel"
import EditUplotnitel from "./editDialogs/EditUplotnitel"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"

export default function EditMaterialDialog() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.PRICES)
    const [group, setGroup] = useState<MaterialGroup>(MaterialGroup.PLATE)
    const header = [...MaterialGroupCaptions.entries()].map((item, index) => <div key={index} className={(group === item[0] ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setGroup(item[0] as MaterialGroup) }} role="button">{item[1]}</div>)
    const content = getGroup(group)
    useEffect(() => {
        if (!perm?.read) window.location.replace('/')
    }, [perm])
    return <div className="p-2">
        <div className="d-flex justify-content-center gap-1">{header}</div>
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