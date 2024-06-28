import { useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import ImageButton from "../../inputs/ImageButton"
import ComboBox from "../../inputs/ComboBox"
import { createUserAtom, userRolesAtom } from "../../../atoms/users"
import { rusMessages } from "../../../functions/messages"
type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
    setLoading: (state: boolean) => void
}

const minNameLen = 3
const minPassLen = 6
export default function AddUserDialog({ dialogRef, setLoading }: DialogProps ) {
    const closeDialog = () => { dialogRef.current?.close() }
    const [{ name, password }, setState] = useState({ name: "", password: "" })
    const [roleIndex, setRoleIndex] = useState(0)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const createUser = useSetAtom(createUserAtom)
    const roles = useAtomValue(userRolesAtom)
    const role = roles[roleIndex]?.name || ""
    const passwordCorrect = checkPassword(password)
    const create = () => {
        if (password.length < 6) return showMessage("Пароль слишком короткий")
        if (name.length < 3) return showMessage("Логин слишком короткий")
        if (!passwordCorrect) return showMessage("Пароль должен содержать только цифры и/или латинские буквы")
        showConfirm(`Создать пользователя ${name} с правами ${roles[roleIndex].name}?`, () => {
            setLoading(true)
            createUser({ name, password, role: roles[roleIndex] }, (result) => {
                setLoading(false)
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
            <div className="table-grid">
                <div>{`Логин (мин. ${minNameLen} символов):`}</div>
                <input required value={name} onChange={(e) => { setState((prev) => ({ ...prev, name: e.target.value })); }} />
                <div>{`Пароль (мин. ${minPassLen} символов):`}</div>
                <input required style={{ color: passwordCorrect ? "black" : "red" }} value={password} onChange={(e) => { setState((prev) => ({ ...prev, password: e.target.value })); }} />
                <ComboBox title="Права:" value={role} items={roles.map(r => r.name)} onChange={(index) => { setRoleIndex(index) }} />
            </div>
            <hr />
            <input type="submit" value="Создать" />
        </form>
    </dialog>
}

function checkPassword(pass: string){
    return !pass.match("[^a-zA-Z0-9]")
}

