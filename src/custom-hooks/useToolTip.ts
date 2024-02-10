import { useEffect } from "react";
import { isMobile } from "../functions/functions";

export const useToolTip = (title: string | undefined) => {
  if (!title) return { onMouseLeave: () => { }, onMouseOver: () => { } }
  const toolTip: HTMLElement | null = document.getElementById("tooltip");
  const onMouseOver = (e: React.MouseEvent) => {
    if (isMobile()) return
    const { top: elementTop, left: elementLeft, height: elementHeight } = e.target ? (e.target as HTMLElement).getBoundingClientRect() : { top: 0, left: 0, height: 0 };
    if (title && toolTip) {
      toolTip.innerText = title;
      toolTip.style.display = "inline";
      toolTip.showPopover()
      toolTip.style.zIndex = "10"
      toolTip.style.fontSize = "0.8rem"
      const { width: toolTipWidth, height: toolTipHeight } = toolTip.getBoundingClientRect()
      let top = elementTop + elementHeight + window.scrollY + 5
      let left = elementLeft + window.scrollX
      if ((left + toolTipWidth) > window.innerWidth) {
        toolTip.style.right = "0px";
        toolTip.style.left = "auto";
      }
      else {
        toolTip.style.left = left + "px";
        toolTip.style.right = "auto"
      }
      if ((elementTop + elementHeight + toolTipHeight + 5) > window.innerHeight) {
        toolTip.style.bottom = "0px";
        toolTip.style.top = "auto";
      } else {
        toolTip.style.bottom = "auto";
        toolTip.style.top = top + "px";
      }
    }
  }
  const onMouseLeave = () => {
    toolTip && (toolTip.style.display = "none");
  }
  useEffect(() => {
    return () => {
      toolTip && (toolTip.style.display = "none");
    }
  }, [])
  return { onMouseOver, onMouseLeave };
};
