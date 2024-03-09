import { useAtom, useSetAtom } from "jotai"
import { confirmDialogAtom, confirmDialogRefAtom } from "../atoms/dialogs"
import { useEffect, useRef } from "react"

export default function ConfirmDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const setConfirmDialogRef = useSetAtom(confirmDialogRefAtom)
    const [{ message, onYesAction, onNoAction = () => { } }] = useAtom(confirmDialogAtom)
    useEffect(() => {
        setConfirmDialogRef(dialogRef)
    }, [])
    return <dialog ref={dialogRef}>
        <div className="confirm-message">{message}</div>
        <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-primary" onClick={() => { onYesAction(); dialogRef.current?.close(); }}>Да</button>
            <button className="btn btn-secondary"  onClick={() => { onNoAction(); dialogRef.current?.close(); }}>Нет</button>
        </div>

    </dialog>
}