import { useAtom, useSetAtom } from "jotai"
import { messageDialogAtom, messageDialogRefAtom } from "../atoms/dialogs"
import { useEffect } from "react"

type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
}

export default function MessageDialog(props: DialogProps) {
    const setMessageDialogRef = useSetAtom(messageDialogRefAtom)
    const [{ message }] = useAtom(messageDialogAtom)
    useEffect(() => {
        setMessageDialogRef(props.dialogRef)
    }, [])
    return <dialog ref={props.dialogRef}>
        <div>{message}</div>
        <div className="d-flex justify-content-center">
            <button onClick={() => { props.dialogRef.current?.close(); }}>OK</button>
        </div>

    </dialog>
}