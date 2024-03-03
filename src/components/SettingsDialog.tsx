import { useEffect, useRef } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { settingsDialogAtom } from "../atoms/dialogs"
import { setSettingsAtom, settingsAtom } from "../atoms/settings"
import DialogWindow from "./DialogWindow"
import InputField from "./InputField"
import { PropertyType } from "../types/property"

export default function SettingsDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const setSettingsDialogRef = useSetAtom(settingsDialogAtom)
    const settings = useAtomValue(settingsAtom)
    const setSettings = useSetAtom(setSettingsAtom)
    useEffect(() => {
        setSettingsDialogRef(dialogRef)
    }, [setSettingsDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef}>
        <div className="d-flex gap-2">
            <input id="showFix" type="checkbox" checked={settings.showFixIcons} onChange={(e) => { setSettings({ ...settings, showFixIcons: !settings.showFixIcons }) }} />
            <label htmlFor="showFix">{`Отображать значок фиксации на фасаде`}</label>
        </div>
        <div className="d-flex gap-2">
        <div>Мин. размер секции:</div>
        <InputField type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} value={settings.minSize} setValue={(value) => { setSettings({ ...settings, minSize: +value }) }} />
        </div>
    </DialogWindow>
}
