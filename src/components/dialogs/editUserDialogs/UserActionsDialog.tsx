import { useEffect } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import ImageButton from "../../inputs/ImageButton"
import { clearUserActionsAtom, loadUserActionsAtom, userActionsAtom, userAtom} from "../../../atoms/users"
import TableData from "../../inputs/TableData"
import { TimeField } from "./EditUsersDialog"
import { timeToString } from "../../../server/functions/user"

export default function UserActionsDialog() {
    const user  = useAtomValue(userAtom)
    const userActions = useAtomValue(userActionsAtom).toSorted((u1, u2) => u1.time > u2.time ? -1 : 1)
    const loadUserActions = useSetAtom(loadUserActionsAtom)
    const clearUserActions = useSetAtom(clearUserActionsAtom)
    const header = [{ caption: "Имя" }, { caption: "Время" },{ caption: "Действие" }]
    const list = userActions.map(u => {
        return {
            key: u.name, data: [u.name,
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
    useEffect(() => {
        loadUserActions()
    }, [user.name])
    return <div className="p-2">
        <div className="d-flex gap-2">
            <ImageButton title="Обновить" icon='update' onClick={() => { loadUserActions();}} />
            <ImageButton title="Очистить" icon='delete' onClick={() => { clearUserActions();}} />
        </div>
        <hr />
        Журнал
            <TableData header={header} content={list} styles={{maxHeight: "300px"}}/>
        <hr />
    </div>
}

