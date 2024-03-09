export default function useDoubleClick(onDoubleClick: (e: Event) => void) {
    let clickCount = 0
    let time = 0
    return (e: Event) => {
        if (clickCount === 0) {
            time = performance.now();
            clickCount++
        }
        else {
            if ((performance.now() - time) < 200) {
                onDoubleClick(e)
            }
            clickCount = 0
        }
    }
}