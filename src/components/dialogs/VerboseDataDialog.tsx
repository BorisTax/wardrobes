import { useEffect, useRef } from "react"
import { useAtom, useAtomValue } from "jotai"
import { verboseDialogAtom } from "../../atoms/dialogs"
import DialogWindow from "./DialogWindow"
import TableData from "../TableData"
import { verboseDataAtom } from "../../atoms/verbose"

export default function VerboseDataDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const { data: verboseData, title } = useAtomValue(verboseDataAtom)
    const [, setVerboseDialogAtomRef] = useAtom(verboseDialogAtom)
    const heads = verboseData[0]
    const verboseContent = verboseData.filter((r, index) => index > 0)
    const contents = verboseContent.map(v => [...v])
    useEffect(() => {
        setVerboseDialogAtomRef(dialogRef)
    }, [setVerboseDialogAtomRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title={title}>
        <div className="overflow-scroll">
            <TableData heads={heads} content={contents} />
        </div>
    </DialogWindow>
}
