import { useEffect, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { editUsersDialogAtom } from "../atoms/dialogs"
import useMessage from "../custom-hooks/useMessage"
import useConfirm from "../custom-hooks/useConfirm"
import ImageButton from "./ImageButton"
import ComboBox from "./ComboBox"
import InputField from "./InputField"
import { UserRolesCaptions, allUsersAtom, createUserAtom } from "../atoms/users"
import { UserRoles } from "../types/server"
import messages from "../server/messages"
import { rusMessages } from "../functions/messages"
type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
}

const roles = [UserRoles.CLIENT, UserRoles.MANAGER, UserRoles.EDITOR]
export default function AddUserDialog({ dialogRef }: DialogProps) {
    const closeDialog = () => { dialogRef.current?.close() }
    const [{ name, password }, setState] = useState({ name: "", password: "" })
    const [roleIndex, setRoleIndex] = useState(0)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const createUser = useSetAtom(createUserAtom)
    const rolesCaptions = roles.map(r => UserRolesCaptions[r])

    return <dialog ref={dialogRef}>
        <div className="dialog-header-bar">
            <div className="d-flex gap-2">
            </div>
            <ImageButton title="Закрыть" icon='close' onClick={() => closeDialog()} />
        </div>
        <hr />
        <div className="property-grid">
            <div>Логин:</div>
            <input value={name} onChange={(e) => { setState((prev) => ({ ...prev, name: e.target.value })); }} />
            <div>Пароль:</div>
            <input value={password} onChange={(e) => { setState((prev) => ({ ...prev, password: e.target.value })); }} />
            <ComboBox title="Права:" value={rolesCaptions[roleIndex]} items={rolesCaptions} onChange={(index) => { setRoleIndex(index) }} />
        </div>
        <input type="button" value="Создать" onClick={()=>{
            if (password.length < 6) return showMessage("Пароль слишком короткий")
            if (name.length < 3) return showMessage("Логин слишком короткий")
            showConfirm(`Создать пользователя ${name} с правами ${rolesCaptions[roleIndex]}?`, ()=>{
                createUser({name, password, role: roles[roleIndex]}, (result)=>{
                    showMessage(rusMessages[result.message])
                })
            })
        }}/>
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