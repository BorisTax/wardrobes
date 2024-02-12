export default function useFetch(url: string, body: string, onResolve: (r: any) => void, onReject: () => void = () => { }, onCatch: () => void = () => { }) {
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