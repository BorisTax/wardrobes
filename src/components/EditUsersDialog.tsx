import { useEffect, useRef } from "react"
import { useAtom, useSetAtom } from "jotai"
import { editUsersDialogAtom } from "../atoms/dialogs"
import useMessage from "../custom-hooks/useMessage"
import useConfirm from "../custom-hooks/useConfirm"
import ImageButton from "./ImageButton"

export default function EditUsersDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const closeDialog = () => { dialogRef.current?.close() }
    const setEditUsersDialogRef = useSetAtom(editUsersDialogAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    useEffect(() => {
        setEditUsersDialogRef(dialogRef)
    }, [setEditUsersDialogRef, dialogRef])
    return <dialog ref={dialogRef}>
        <div className="dialog-header-bar">
            <div>

            </div>
            <ImageButton title="Закрыть" icon='close' onClick={() => closeDialog()} />
        </div>
        <hr/>
    
    </dialog>
}

function checkFields({ nameChecked = true, codeChecked = true, newName, newCode }: { nameChecked?: boolean, codeChecked?: boolean, newName: string, newCode: string }, showMessage: (message: string) => void) {
    if (nameChecked && newName.trim() === "") {
        showMessage("Введите наименование")
        return false
    }
    if (codeChecked && newCode.trim() === "") {
        showMessage("Введите код")
        return false
    }
    return true
}

function getMessage({ nameChecked, codeChecked, name, code, newName, newCode }: { nameChecked: boolean, codeChecked: boolean, name: string, code: string, newName: string, newCode: string }): string {
    const changeName = nameChecked ? `профиль: "${name}"` : ""
    const changeCode = codeChecked ? `код:"${code}"` : ""
    const changeName2 = nameChecked ? `"${newName}"` : ""
    const changeCode2 = codeChecked ? `код:"${newCode}"` : ""
    const sub2 = nameChecked || codeChecked ? "на" : ""
    const message = `Заменить ${changeName} ${changeCode} ${sub2} ${changeName2} ${changeCode2}?`
    return message
}

function getAddMessage({ type, name, code }: { type: string, name: string, code: string }): string {
    const message = `Добавить профиль (Тип: ${type}) - ${name}, код: ${code} ?`
    return message
}