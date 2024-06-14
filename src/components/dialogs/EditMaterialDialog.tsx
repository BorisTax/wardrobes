import { useEffect, useRef, useState } from "react"

import DialogWindow from "./DialogWindow"
import { MaterialGroup } from "../../types/enums"
import { useAtom } from "jotai"
import { editMaterialDialogAtom } from "../../atoms/dialogs"
import { MaterialGroupCaptions } from "../../functions/materials"
import EditPlates from "./editDialogs/EditPlates"
import EditProfile from "./editDialogs/EditProfile"
import EditEdge from "./editDialogs/EditEdge"
import EditZaglushka from "./editDialogs/EditZaglushka"
import EditBrush from "./editDialogs/EditBrush"
import EditTrempel from "./editDialogs/EditTrempel"

export type EditDialogProps = {
    setLoading: (state: boolean) => void
}

export default function EditMaterialDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [, setMaterialDialogRef] = useAtom(editMaterialDialogAtom)
    const [group, setGroup] = useState<MaterialGroup>(MaterialGroup.PLATE)
    const [loading, setLoading] = useState(false)
    const className = "p-1 border"
    const active = `${className} fw-bold`
    const header = [...MaterialGroupCaptions.entries()].map((item, index) => <div key={index} className={(group === item[0] ? active : className)} onClick={() => { setGroup(item[0] as MaterialGroup) }} role="button">{item[1]}</div>)
    let content = <></>
    switch (group) {
        case MaterialGroup.PLATE:
            content = <EditPlates setLoading={(state: boolean) => setLoading(state)} />
            break;
        case MaterialGroup.PROFILE:
            content = <EditProfile setLoading={(state: boolean) => setLoading(state)} />
            break;
        case MaterialGroup.EDGE:
            content = <EditEdge setLoading={(state: boolean) => setLoading(state)} />
            break;
        case MaterialGroup.ZAGLUSHKI:
            content = <EditZaglushka setLoading={(state: boolean) => setLoading(state)} />
            break;
        case MaterialGroup.BRUSH:
            content = <EditBrush setLoading={(state: boolean) => setLoading(state)} />
            break;
        case MaterialGroup.TREMPEL:
            content = <EditTrempel setLoading={(state: boolean) => setLoading(state)} />
            break;
        default:
    }
    useEffect(() => {
        setMaterialDialogRef(dialogRef)
    }, [setMaterialDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title="База материалов">
        <div className="d-flex">{header}</div>
        <br />
        {content}
        {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
    </DialogWindow>
}
