import { useEffect, useRef, useState } from "react"

import DialogWindow from "./DialogWindow"
import { MaterialGroup } from "../../types/enums"
import { useAtom } from "jotai"
import { editMaterialDialogAtom } from "../../atoms/dialogs"
import { MaterialGroupCaptions } from "../../functions/materials"
import EditPlates from "./content/EditPlates"
import EditProfile from "./content/EditProfile"
import EditEdge from "./content/EditEdge"
import EditZaglushka from "./content/EditZaglushka"

export default function EditMaterialDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [, setMaterialDialogRef] = useAtom(editMaterialDialogAtom)
    const [group, setGroup] = useState<MaterialGroup>(MaterialGroup.PLATE)
    const className = "p-1 border"
    const active = `${className} fw-bold`
    let header = [...MaterialGroupCaptions.entries()].map(item => <div className={(group === item[0] ? active : className)} onClick={() => { setGroup(item[0] as MaterialGroup) }} role="button">{item[1]}</div>)
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
        default:
    }
    useEffect(() => {
        setMaterialDialogRef(dialogRef)
    }, [setMaterialDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef}>
        <div className="d-flex">{header}</div>
        <br/>
        {content}
        </DialogWindow>
}
