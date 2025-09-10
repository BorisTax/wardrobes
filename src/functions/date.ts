export function getDateFormat(date: number): string {
    const d = (new Date(date))
    return d.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).replace(/\//g, "-")
}

export function getDateInputValue(date: number): string {
    const d = (new Date(date))
    const mm = d.getMonth() + 1 
    const dd = d.getDate() 
    return `${d.getFullYear()}-${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}`
}

export function getMaxDateTime(date: string) {
    const d = new Date(date)
    d.setHours(23,59)
    return d.valueOf()
}