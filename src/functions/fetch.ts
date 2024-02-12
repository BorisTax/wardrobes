export async function fetchData(url: string, method: string, body: string) {
    return fetch(url, { method, headers: { "Content-Type": "application/json" }, body }).then(r => r.json())
}
export async function fetchFormData(url: string, method: string, body: FormData) {
    return fetch(url, { method, body }).then(r => r.json())
}