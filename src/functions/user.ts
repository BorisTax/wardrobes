import { FetchResult, fetchGetData } from "./fetch.js";

export async function waitForMessageFromServer(token:string, onMessage: (message: string, data: string) => boolean) {
    const result: FetchResult = await fetchGetData(`api/users/events?token=${token}`)
    if (result.success) {
        if (onMessage(result.message as string, result.data as string)) return
    }
    await waitForMessageFromServer(token, onMessage)
}

export function timeToString(time: number): string{
    const seconds = Math.floor(time / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`
} 

export function dateToString(date: Date): string{
    return `${pad(date.getDate())}-${pad(date.getMonth())}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
} 

function pad(num: number) {
    const s = num.toString();
    return (s.length < 2) ? "0" + s : s
}