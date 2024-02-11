
export function isMobile(): boolean {
    return (navigator.maxTouchPoints > 1)
}

export function createToolTip() {
    const toolTip = document.createElement("span")
    toolTip.id = "tooltip"
    toolTip.style.position = "absolute"
    toolTip.style.border = "1px solid black"
    toolTip.setAttribute("popover", "")
    toolTip.style.padding = "0.5em"
    toolTip.style.backgroundColor = "white"
    toolTip.style.display = "none"
    return toolTip
}
