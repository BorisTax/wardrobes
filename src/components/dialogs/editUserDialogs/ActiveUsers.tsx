import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import useConfirm from "../../../custom-hooks/useConfirm"
import ImageButton from "../../inputs/ImageButton"
import { timeToString } from "../../../server/functions/user"
import { ActiveUser, RESOURCE } from "../../../types/user"
import TableData from "../../inputs/TableData"
import { useNavigate } from "react-router-dom"
import { loadActiveUsers, logoutUser, userAtom } from "../../../atoms/users"
import { eventSourceAtom } from "../../../atoms/serverEvents"
import { SERVER_EVENTS } from "../../../types/enums"

export default function ActiveUsers() {
    const eventSource = useAtomValue(eventSourceAtom)
    const navigate = useNavigate()
    const { userSessionId, permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
    const showConfirm = useConfirm()
    const activeUserListHeader = [{ caption: "Пользователь" }, { caption: "Время с момента входа" }, { caption: "Время последней активности" }]
    const activeuserlist = activeUsers.map(u => {
        const you = u.userSessionId === userSessionId
        return {
            key: u.name, data: [u.name,
            <TimeField key={u.userSessionId + "1"} time={u.loginTime} />,
            <TimeField key={u.userSessionId + "2"} time={u.lastActionTime} />,
            <div key={u.userSessionId + "3"} className={you ? "text-center" : " text-center user-logout-button"} 
                onClick={async () => { 
                    if (!you && await showConfirm(`Отключить пользователя ${u.name}?`)) {
                        logoutUser(u.userSessionId)
                    } }}>{you ? "Это вы" : "Отсоединить"}</div>]
        }
    }
    )
    const loadData = () => loadActiveUsers().then(data => setActiveUsers(data))
    const events = (event: MessageEvent) => { 
        if (event.data.message === SERVER_EVENTS.UPDATE_ACTIVE_USERS) loadData()
    }
    useEffect(() => {
        if (!perm?.Read) navigate("/")
    }, [perm?.Read, navigate])
    useEffect(() => {
        loadData()
        eventSource?.addEventListener("message", events)
        return () => {
            eventSource?.removeEventListener("message", events)
        }
    }, [perm])
    return <div className="p-2">
        <div className="d-flex gap-2">
            <ImageButton title="Обновить" icon='update' onClick={() => { loadData()}} />
        </div>
        <hr />
        В сети
        <div className="p-2">
            <TableData header={activeUserListHeader} content={activeuserlist} />
        </div>
    </div>
}

export function TimeField({ time }: { time: number }) {
    const [, rerender] = useState(0)
    useEffect(() => {
        const timeout = setTimeout(() => rerender(Math.random()))
        return () => clearTimeout(timeout)
    })
    return <div className="text-center">{timeToString(Date.now() - time)}</div>
}

