import { atom } from 'jotai'
import { SERVER_EVENTS } from '../types/enums'
import { loadActiveUsersAtom, logoutAtom } from './users'

const url = window.location.hostname

const webSocketAtom = atom<WebSocket | null>(null)

export const webSocketSetAtom = atom(null, (get, set, token: string) => {
    let wsClient = get(webSocketAtom)
    if (wsClient) wsClient.close()
    if(!token) return
    console.log('new websocket')
    wsClient = new WebSocket(`ws://${url}:8080?token=${token}`)
    wsClient.addEventListener('error', (ev) => {
        console.error(ev)
    });

    wsClient.addEventListener('open', function open() {
        wsClient.send('something');
    });

    wsClient.addEventListener('message', function message(event) {
        const message = event.data
        switch(message){
            case SERVER_EVENTS.LOGOUT:
                set(logoutAtom)
                break;
            case SERVER_EVENTS.UPDATE_ACTIVE_USERS:
                set(loadActiveUsersAtom)
                break;
            default:
        }
    });
    set(webSocketAtom, wsClient)
})