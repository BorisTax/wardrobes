import { useAtom, useSetAtom } from "jotai"
import { confirmDialogAtom, confirmDialogRefAtom, messageDialogAtom, messageDialogRefAtom } from "../atoms/dialogs"
import { useEffect } from "react"

type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
}

export default function ConfirmDialog(props: DialogProps) {
    const setConfirmDialogRef = useSetAtom(confirmDialogRefAtom)
    const [{ message, onYesAction, onNoAction = () => { } }] = useAtom(confirmDialogAtom)
    useEffect(() => {
        setConfirmDialogRef(props.dialogRef)
    }, [])
    return <dialog ref={props.dialogRef}>
        <div className="confirm-message">{message}</div>
        <div className="d-flex justify-content-center gap-2">
            <button className="btn btn-primary" onClick={() => { onYesAction(); props.dialogRef.current?.close(); }}>Да</button>
            <button className="btn btn-secondary"  onClick={() => { onNoAction(); props.dialogRef.current?.close(); }}>Нет</button>
        </div>

    </dialog>
}