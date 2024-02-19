import { useAtom, useSetAtom } from "jotai"
import { messageDialogAtom, messageDialogRefAtom } from "../atoms/dialogs"
import { useEffect, useRef } from "react"

export default function MessageDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const setMessageDialogRef = useSetAtom(messageDialogRefAtom)
    const [{ message }] = useAtom(messageDialogAtom)
    useEffect(() => {
        setMessageDialogRef(dialogRef)
    }, [])
    return <dialog ref={dialogRef}>
        <div>{message}</div>
        <div className="d-flex justify-content-center">
            <button onClick={() => { dialogRef.current?.close(); }}>OK</button>
        </div>

    </dialog>
}