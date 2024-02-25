import { useEffect, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { editUsersDialogAtom } from "../atoms/dialogs"
import useMessage from "../custom-hooks/useMessage"
import useConfirm from "../custom-hooks/useConfirm"
import ImageButton from "./ImageButton"
import ComboBox from "./ComboBox"
import InputField from "./InputField"
import { UserRolesCaptions, allUsersAtom, createUserAtom } from "../atoms/users"
import { UserRoles } from "../server/types/server"
import messages from "../server/messages"
import { rusMessages } from "../functions/messages"
type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
}

const roles = [UserRoles.CLIENT, UserRoles.MANAGER, UserRoles.EDITOR]
const minNameLen = 3
const minPassLen = 6
export default function AddUserDialog({ dialogRef }: DialogProps) {
    const closeDialog = () => { dialogRef.current?.close() }
    const [{ name, password }, setState] = useState({ name: "", password: "" })
    const [roleIndex, setRoleIndex] = useState(0)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const createUser = useSetAtom(createUserAtom)
    const rolesCaptions = roles.map(r => UserRolesCaptions[r])
    const passwordCorrect = checkPassword(password)
    const create = () => {
        if (password.length < 6) return showMessage("Пароль слишком короткий")
        if (name.length < 3) return showMessage("Логин слишком короткий")
        if (!passwordCorrect) return showMessage("Пароль должен содержать только цифры и/или латинские буквы")
        showConfirm(`Создать пользователя ${name} с правами ${rolesCaptions[roleIndex]}?`, () => {
            createUser({ name, password, role: roles[roleIndex] }, (result) => {
                showMessage(rusMessages[result.message])
            })
        })
    }
    return <dialog ref={dialogRef} onClose={() => { setState(prev => ({ ...prev, password: "" })) }}>
        <div className="dialog-header-bar">
            <div className="d-flex gap-2">
            </div>
            <ImageButton title="Закрыть" icon='close' onClick={() => closeDialog()} />
        </div>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); create() }}>
            <div className="property-grid">
                <div>{`Логин (мин. ${minNameLen} символов):`}</div>
                <input required value={name} onChange={(e) => { setState((prev) => ({ ...prev, name: e.target.value })); }} />
                <div>{`Пароль (мин. ${minPassLen} символов):`}</div>
                <input required style={{ color: passwordCorrect ? "black" : "red" }} value={password} onChange={(e) => { setState((prev) => ({ ...prev, password: e.target.value })); }} />
                <ComboBox title="Права:" value={rolesCaptions[roleIndex]} items={rolesCaptions} onChange={(index) => { setRoleIndex(index) }} />
            </div>
            <hr />
            <input type="submit" value="Создать" />
        </form>
    </dialog>
}

function checkPassword(pass: string){
    return !pass.match("[^a-zA-Z0-9]")
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