import { atom } from 'jotai'
import { SERVER_EVENTS } from '../types/enums'
import { logoutAtom } from './users'
import { API_ROUTE, USERS_ROUTE } from '../types/routes'
import { notifyMessageAtom } from './messages'

export const eventSourceAtom = atom<EventSource | null>(null)
export const newEventSourceAtom = atom(null, async (get, set) => {
    const eventSource = new EventSource(`${API_ROUTE}${USERS_ROUTE}/events`);
    eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data)
        console.log("Новое сообщение", data);
        switch(data.message){
            case SERVER_EVENTS.LOGOUT:
                set(notifyMessageAtom, "Сеанс завершен администратором")
                set(logoutAtom)
                break;
            case SERVER_EVENTS.EXPIRE:
                set(notifyMessageAtom, "Сеанс завершен из-за длительной неактивности")
                set(logoutAtom)
                break;
            default:
        }
    };
    eventSource.onerror = ev => {
        console.error('EventSource', ev)
        set(closeEventSourceAtom)
    }
    set(eventSourceAtom, eventSource)
})
export const closeEventSourceAtom = atom(null, async (get, set) => {
    try {
        get(eventSourceAtom)?.close()
    } catch (e) {
        console.error(e)
    }
    set(eventSourceAtom, null)
})