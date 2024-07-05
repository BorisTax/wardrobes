import { atom } from 'jotai'
import { SERVER_EVENTS } from '../types/enums'
import { loadActiveUsersAtom, logoutAtom } from './users'

export const eventSourceAtom = atom<EventSource | null>(null)
export const newEventSourceAtom = atom(null, async (get, set, token: string) => {
    const eventSource = new EventSource(`/api/users/events?token=${token}`);
    eventSource.onopen = ev => {
        set(eventSourceAtom, eventSource)
    }
    eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data)
        console.log("Новое сообщение", data);
        switch(data.message){
            case SERVER_EVENTS.LOGOUT:
                set(logoutAtom)
                break;
            case SERVER_EVENTS.UPDATE_ACTIVE_USERS:
                set(loadActiveUsersAtom)
                break;
            default:
        }
    };
    eventSource.onerror = ev => {
        console.error('EventSource', ev)
        set(closeEventSourceAtom)
    }
})
export const closeEventSourceAtom = atom(null, async (get, set) => {
    try {
        get(eventSourceAtom)?.close()
    } catch (e) {
        console.error(e)
    }
    set(eventSourceAtom, null)
})