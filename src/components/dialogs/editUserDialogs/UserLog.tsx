import { useEffect, useState } from "react"
import ImageButton from "../../inputs/ImageButton"
import { clearUserActions, loadUserActions } from "../../../atoms/users"
import TableData from "../../inputs/TableData"
import { UserLogSchema } from "../../../types/schemas/userSchemas"
import { useUsers } from "../../../custom-hooks/users"

export default function UserLog() {
    const users = useUsers()
    const [userActions, setUserAction] = useState<UserLogSchema[]>([])
    const sorted = userActions.toSorted((u1, u2) => u1.time > u2.time ? -1 : 1)
    const header = [{ caption: "Имя" }, { caption: "Время" },{ caption: "Действие" }]
    const list = sorted.map((u, index) => {
        return {
            key: index, data: [users.get(u.userId)?.name,
            new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: "2-digit",
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            }).format(u.time),
            u.action]
        }
    }
    )
    const loadData = () => loadUserActions().then(data => setUserAction(data)) 
    useEffect(() => {
        loadData()
    }, [])
    return <div className="p-2">
        <div className="d-flex gap-2">
            <ImageButton title="Обновить" icon='update' onClick={() => { loadData();}} />
            <ImageButton title="Очистить" icon='delete' onClick={() => { clearUserActions(); loadData()}} />
        </div>
        <hr />
        Журнал
            <TableData header={header} content={list} styles={{maxHeight: "300px"}}/>
        <hr />
    </div>
}

