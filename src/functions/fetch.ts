export type FetchResult = {
    success?: boolean
    status?: number
    data?: object | string
}
export async function fetchGetData(url: string) {
    try {
        let status: number
        const result = await fetch(url, { method: "GET" }).then(r => { status = r.status; return r.json() })
        if (result.success) return result
        return { success: false }
    } catch (e) {
        return { success: false }
    }
}
export async function fetchData(url: string, method: string, body: string) {
    return fetch(url, { method, headers: { "Content-Type": "application/json" }, body }).then(r => r.json())
}
export async function fetchFormData(url: string, method: string, body: FormData) {
    return fetch(url, { method, body }).then(r => r.json())
}

export default function onFetch(url: string, body: string, onResolve: (r: any) => void, onReject = () => { }, onCatch = () => { }) {
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body })
        .then(r => r.json()).then(r => {
            if (r.success) {
                onResolve(r)
            } else {
                onReject()
            }
        }).catch(e => {
            console.error(e)
            onCatch()
        })
}