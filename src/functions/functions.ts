
export function isMobile(): boolean {
    return (navigator.maxTouchPoints > 1)
}

export function createToolTip() {
    const toolTip = document.createElement("span")
    toolTip.id = "tooltip"
    toolTip.setAttribute("popover", "")
    toolTip.style.position = "absolute"
    toolTip.style.border = "1px solid black"
    toolTip.setAttribute("popover", "")
    toolTip.style.padding = "0.5em"
    toolTip.style.backgroundColor = "white"
    toolTip.style.display = "none"
    return toolTip
}
export function isLandscape(): boolean {
    const mainContainer = document.querySelector('.combifasades-container') as HTMLDivElement
    if(!mainContainer) return false
    return getComputedStyle(mainContainer).display === 'grid'
}