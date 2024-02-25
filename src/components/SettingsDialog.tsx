import { useEffect, useRef } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { settingsDialogAtom } from "../atoms/dialogs"
import useMessage from "../custom-hooks/useMessage"
import useConfirm from "../custom-hooks/useConfirm"
import ImageButton from "./ImageButton"
import { UserRoles } from "../types/server"
import { setShowFixIconsAtom, settingsAtom } from "../atoms/settings"

export default function SettingsDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const setSettingsDialogRef = useSetAtom(settingsDialogAtom)
    const closeDialog = () => { dialogRef.current?.close() }
    const settings = useAtomValue(settingsAtom)
    const setShowFixed = useSetAtom(setShowFixIconsAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    useEffect(() => {
        setSettingsDialogRef(dialogRef)
    }, [setSettingsDialogRef, dialogRef])
    return <dialog ref={dialogRef}>
        <div className="dialog-header-bar">
            <div className="d-flex gap-2">
            </div>
            <ImageButton title="Закрыть" icon='close' onClick={() => closeDialog()} />
        </div>
        <hr />
        <div className="d-flex gap-2">
            <input id="showFix" type="checkbox" checked={settings.showFixIcons} onChange={(e) => { setShowFixed(!settings.showFixIcons) }} />
            <label htmlFor="showFix">{`Отображать значок фиксации на фасаде`}</label>
        </div>
    </dialog>
}
