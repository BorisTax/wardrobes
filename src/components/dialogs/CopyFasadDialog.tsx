import { useEffect, useRef } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { copyFasadDialogAtom } from "../../atoms/dialogs"
import DialogWindow from "./DialogWindow"
import { activeRootFasadIndexAtom, copyFasadAtom } from "../../atoms/fasades"
import { appDataAtom } from "../../atoms/app"

export default function CopyFasadDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const setCopyFasadDialogRef = useSetAtom(copyFasadDialogAtom)
    const activeRootFasadIndex = useAtomValue(activeRootFasadIndexAtom)
    const { fasadCount } = useAtomValue(appDataAtom)
    const copyFasad = useSetAtom(copyFasadAtom)
    const contents = (new Array(fasadCount)).fill(0)
        .map((_, index) => index + 1)
        .filter(i => i !== (activeRootFasadIndex + 1))
        .map(i => <div key={i} className="copyFasadIndex" onClick={() => { copyFasad(activeRootFasadIndex, i - 1); dialogRef.current?.close() }}>{i}</div>)
    useEffect(() => {
        setCopyFasadDialogRef(dialogRef)
    }, [setCopyFasadDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title="Выберите фасад">
        {contents}
    </DialogWindow>
}
