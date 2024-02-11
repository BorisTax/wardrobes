import { baseUrl } from "../options"

export async function fetchData(url: string, method: string, body: string) {
    return fetch(baseUrl + url, { method, headers: { "Content-Type": "application/json" }, body }).then(r => r.json())
}
export async function fetchFormData(url: string, method: string, body: FormData) {
    return fetch(baseUrl + url, { method, body }).then(r => r.json())
}