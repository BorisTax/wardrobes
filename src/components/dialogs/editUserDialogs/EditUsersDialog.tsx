import { useEffect, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import ImageButton from "../../inputs/ImageButton"
import { activeUsersAtom, allUsersAtom, deleteUserAtom, loadActiveUsersAtom, loadUsersAtom, logoutUserAtom, userAtom } from "../../../atoms/users"
import { timeToString } from "../../../functions/user"
import AddUserDialog from "./AddUserDialog"
import { RESOURCE } from "../../../types/user"
import { AtomCallbackResult } from "../../../types/atoms"
import { rusMessages } from "../../../functions/messages"
import EditPermissionsDialog from "./EditPermissionsDialog"
import TableData from "../../TableData"
import AddUserRoleDialog from "./AddUserRoleDialog"
import { useNavigate } from "react-router-dom"

enum ListType {
    REGISTERED = "REGISTERED",
    ACTIVE = "ACTIVE"
}

export default function EditUsersDialog() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const addUserDialogRef = useRef<HTMLDialogElement>(null)
    const { token, permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    const users = useAtomValue(allUsersAtom)
    const activeUsers = useAtomValue(activeUsersAtom)
    const loadActiveUsers = useSetAtom(loadActiveUsersAtom)
    const loadUsers = useSetAtom(loadUsersAtom)
    const logoutUser = useSetAtom(logoutUserAtom)
    const deleteUser = useSetAtom(deleteUserAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const [listType, setListType] = useState(ListType.REGISTERED)
    const userListHeader = ["Имя", "Права", ""]
    const activeUserListHeader = ["Имя", "Права", "Время", "Время простоя"]
    const onDelete: AtomCallbackResult = (result) => { showMessage(rusMessages[result.message]) }
    const userlist = users.map(u => {
        const removeUser = perm?.remove
        const deleteButton = <div className={removeUser ? "text-center user-logout-button" : "text-center"} onClick={() => { if (removeUser) showConfirm(`Удалить пользователя ${u.name}?`, () => deleteUser({ name: u.name }, onDelete)) }}>{removeUser ? "Удалить" : ""}</div>
        return [u.name, u.role.name, deleteButton]
    })
    const activeuserlist = activeUsers.map(u => {
        const you = u.token === token
        return [u.name,
        u.role.name,
        <TimeField time={u.time} />,
        <TimeField time={u.lastActionTime} />,
        <div className={you ? "text-center" : " text-center user-logout-button"} onClick={() => { if (!you) showConfirm(`Отключить пользователя ${u.name}?`, () => logoutUser(u.token)) }}>{you ? "Это вы" : "Отсоединить"}</div>]
    }
    )
    useEffect(() => {
        if (!perm?.read) navigate("/")
    }, [perm?.read])
    useEffect(() => {
        loadUsers()
        loadActiveUsers()
    }, [perm])
    return <div className="edit-user-container">
        <div className="d-flex gap-2">
            <ImageButton title="Обновить" icon='update' onClick={() => { loadUsers(); loadActiveUsers() }} />
            {perm?.create && <ImageButton title="Добавить" icon='add' onClick={() => { addUserDialogRef.current?.showModal() }} />}
        </div>
        <div className="tab-header-container">
            <div className={`${listType === ListType.REGISTERED ? "tab-button-active" : "tab-button-inactive"}`} onClick={() => { setListType(ListType.REGISTERED) }}>Все</div>
            <div className={`${listType === ListType.ACTIVE ? "tab-button-active" : "tab-button-inactive"}`} onClick={() => { setListType(ListType.ACTIVE) }}>Активные ({activeUsers.length})</div>
        </div>
        <hr />
        <TableData heads={listType === ListType.REGISTERED ? userListHeader : activeUserListHeader} content={listType === ListType.REGISTERED ? userlist : activeuserlist} />
        <EditPermissionsDialog />
        <AddUserDialog dialogRef={addUserDialogRef} setLoading={(state: boolean) => setLoading(state)} />
        {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
    </div>
}

function TimeField({ time }: { time: number }) {
    const [, rerender] = useState(0)
    useEffect(() => {
        const timeout = setTimeout(() => rerender(Math.random()))
        return () => clearTimeout(timeout)
    })
    return <div className="text-center">{timeToString(Date.now() - time)}</div>
}
