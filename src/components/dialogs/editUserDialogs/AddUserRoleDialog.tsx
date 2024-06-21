import { useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import ImageButton from "../../inputs/ImageButton"
import { createRoleAtom, userRolesAtom } from "../../../atoms/users"
import { rusMessages } from "../../../functions/messages"
type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
    setLoading: (state: boolean) => void
}

export default function AddUserRoleDialog({ dialogRef, setLoading }: DialogProps ) {
    const closeDialog = () => { dialogRef.current?.close() }
    const [{ name }, setState] = useState({ name: "" })
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const createRole = useSetAtom(createRoleAtom)
    const roles = useAtomValue(userRolesAtom)
    const create = () => {
        showConfirm(`Создать роль ${name} ?`, async () => {
            setLoading(true)
            const result = await createRole({ name })
            setLoading(false)
            showMessage(rusMessages[result.message as string])
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
                <div>{`Роль:`}</div>
                <input required value={name} onChange={(e) => { setState((prev) => ({ ...prev, name: e.target.value })); }} />
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