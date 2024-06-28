export type FetchResult<T> = {
    success?: boolean
    status?: number
    message?: string
    data?: T
}
export async function fetchGetData<T>(url: string): Promise<FetchResult<T>> {
    try {
        const result = await fetch(url, { method: "GET" }).then(r => r.json())
        return result
    } catch (e) {
        return { success: false }
    }
}
export async function fetchData<T>(url: string, method: string, body: string): Promise<FetchResult<T>> {
    try {
        const result = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body }).then(r => r.json())
        return result
    } catch (e) {
        return { success: false }
    }
}
export async function fetchFormData(url: string, method: string, body: FormData) {
    try {
        const result = await fetch(url, { method, body }).then(r => r.json())
        return result
    } catch (e) {
        return { success: false }
    }
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