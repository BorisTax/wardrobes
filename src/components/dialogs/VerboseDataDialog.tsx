import { useEffect, useRef } from "react"
import { useAtom, useAtomValue } from "jotai"
import { verboseDialogAtom } from "../../atoms/dialogs"
import DialogWindow from "./DialogWindow"
import TableData from "../TableData"
import { verboseDataAtom } from "../../atoms/verbose"

export default function VerboseDataDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const verboseData = useAtomValue(verboseDataAtom)
    const [, setVerboseDialogAtomRef] = useAtom(verboseDialogAtom)
    const heads = verboseData[0].data
    const verboseContent= verboseData.filter((r, index) => index > 0)
    const contents = verboseContent.map(v => [...v.data])
    const styles = verboseContent.map(r => r.active ? r.data.map(d => ({ fontWeight: "bold" })) : r.data.map(d => ({})))
    useEffect(() => {
        setVerboseDialogAtomRef(dialogRef) 
    }, [setVerboseDialogAtomRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} title="Подробно">
        <div className="overflow-scroll">
            <TableData heads={heads} content={contents} styles={styles}/>
        </div>
    </DialogWindow>
}
