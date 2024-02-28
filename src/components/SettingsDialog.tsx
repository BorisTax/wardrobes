import { useEffect, useRef } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { settingsDialogAtom } from "../atoms/dialogs"
import { setShowFixIconsAtom, settingsAtom } from "../atoms/settings"
import DialogWindow from "./DialogWindow"

export default function SettingsDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const setSettingsDialogRef = useSetAtom(settingsDialogAtom)
    const settings = useAtomValue(settingsAtom)
    const setShowFixed = useSetAtom(setShowFixIconsAtom)
    useEffect(() => {
        setSettingsDialogRef(dialogRef)
    }, [setSettingsDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef}>
        <div className="d-flex gap-2">
            <input id="showFix" type="checkbox" checked={settings.showFixIcons} onChange={(e) => { setShowFixed(!settings.showFixIcons) }} />
            <label htmlFor="showFix">{`Отображать значок фиксации на фасаде`}</label>
        </div>
    </DialogWindow>
}
