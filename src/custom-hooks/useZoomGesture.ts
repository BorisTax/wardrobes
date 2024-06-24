export default function useZoomGesture(onZoom: (e: Event, zoom: number) => void) {
    let prevScale = 0
    return (e: TouchEvent) => {
        //e.preventDefault()
        //const scale = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY)
        //onZoom(e, scale - prevScale)
        //prevScale = scale
    }
}