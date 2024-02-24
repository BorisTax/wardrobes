import { useEffect, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { editUsersDialogAtom } from "../atoms/dialogs"
import useMessage from "../custom-hooks/useMessage"
import useConfirm from "../custom-hooks/useConfirm"
import ImageButton from "./ImageButton"
import { UserRolesCaptions, activeUsersAtom, allUsersAtom, deleteUserAtom, loadActiveUsersAtom, loadUsersAtom, logoutUserAtom, userAtom } from "../atoms/users"
import { timeToString } from "../functions/user"
import AddUserDialog from "./AddUserDialog"
import { UserRoles } from "../types/server"
import { AtomCallbackResult } from "../types/atoms"
import { rusMessages } from "../functions/messages"

export default function EditUsersDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const addUserDialogRef = useRef<HTMLDialogElement>(null)
    const closeDialog = () => { dialogRef.current?.close() }
    const setEditUsersDialogRef = useSetAtom(editUsersDialogAtom)
    const { token } = useAtomValue(userAtom)
    const users = useAtomValue(allUsersAtom)
    const activeUsers = useAtomValue(activeUsersAtom)
    const loadActiveUsers = useSetAtom(loadActiveUsersAtom)
    const loadUsers = useSetAtom(loadUsersAtom)
    const logoutUser = useSetAtom(logoutUserAtom)
    const deleteUser = useSetAtom(deleteUserAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const userListHeader = <><div className="text-center">Имя</div><div className="text-center">Права</div><div></div></>
    const activeUserListHeader = <><div className="text-center">Имя</div><div className="text-center">Права</div><div className="text-center">Время</div><div></div></>
    const onDelete: AtomCallbackResult = (result) => { showMessage(rusMessages[result.message]) }
    const userlist = users.map(u => {
        const isAdmin = u.role === UserRoles.ADMIN
        const deleteButton = <div className={isAdmin ? "text-center" : " text-center user-logout-button"} onClick={() => { if (!isAdmin) showConfirm(`Удалить пользователя ${u.name}?`, () => deleteUser({ name: u.name }, onDelete)) }}>{isAdmin ? "" : "Удалить"}</div>
        return <><div>{u.name}</div>
            <div>{UserRolesCaptions[u.role]}</div>
            <div>{deleteButton}</div>
        </>
    })
    const activeuserlist = activeUsers.map(u => {
        const you = u.token === token
        return <><div>{u.name}</div>
            <div>{UserRolesCaptions[u.role]}</div>
            <TimeField time={u.time} />
            <div className={you ? "text-center" : " text-center user-logout-button"} onClick={() => { if (!you) showConfirm(`Отключить пользователя ${u.name}?`, () => logoutUser(u.token)) }}>{you ? "Это вы" : "Отсоединить"}</div>
        </>
    }
    )
    useEffect(() => {
        setEditUsersDialogRef(dialogRef)
    }, [setEditUsersDialogRef, dialogRef])
    return <dialog ref={dialogRef}>
        <div className="dialog-header-bar">
            <div className="d-flex gap-2">
                <ImageButton title="Обновить" icon='update' onClick={() => { loadUsers(); loadActiveUsers() }} />
                <ImageButton title="Добавить" icon='add' onClick={() => { addUserDialogRef.current?.showModal() }} />
            </div>
            <ImageButton title="Закрыть" icon='close' onClick={() => closeDialog()} />
        </div>
            <hr />
        <div className="userlist-container">
            <div className="text-center">Зарегистрированные пользователи</div>
            <div className="users-list">
                {userListHeader}
                {userlist}
            </div>
            <hr />
            <div className="text-center">Активные пользователи</div>
            <div className="activeusers-list">
                {activeUserListHeader}
                {activeuserlist}
            </div>
        </div>
        <AddUserDialog dialogRef={addUserDialogRef} />
    </dialog>
}

function TimeField({ time }: { time: number }) {
    const [, rerender] = useState(0)
    useEffect(() => {
        const timeout = setTimeout(() => rerender(Math.random()))
        return () => clearTimeout(timeout)
    })
    return <div className="text-center">{timeToString(Date.now() - time)}</div>
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