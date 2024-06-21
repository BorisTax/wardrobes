import { useEffect } from "react";
import { isMobile } from "../../functions/functions";

export const useToolTip = (title: string | undefined) => {
  const toolTip: any = document.getElementById("tooltip");
  useEffect(() => {
    return () => {
      toolTip && (toolTip.style.display = "none");
    }
  }, [toolTip])
  if (!title) return { onMouseLeave: () => { }, onMouseOver: () => { } }
  const onMouseOver = (e: React.MouseEvent, {text = "", disabled = false}) => {
    if (isMobile()) return
    if (disabled) return
    const { top: elementTop, left: elementLeft, height: elementHeight } = e.target ? (e.target as HTMLElement).getBoundingClientRect() : { top: 0, left: 0, height: 0 };
    if (title && toolTip) {
      toolTip.innerText = text || title;
      toolTip.style.display = "inline";
      toolTip.showPopover()
      toolTip.style.zIndex = "10"
      toolTip.style.fontSize = "0.8rem"
      const { width: toolTipWidth, height: toolTipHeight } = toolTip.getBoundingClientRect()
      const top = elementTop + window.scrollY + 5
      const bottom = top + elementHeight
      const left = elementLeft + window.scrollX
      if ((left + toolTipWidth) > window.innerWidth) {
        toolTip.style.right = "0px";
        toolTip.style.left = "auto";
      }
      else {
        toolTip.style.left = left + "px";
        toolTip.style.right = "auto"
      }
      if ((elementTop + elementHeight + toolTipHeight + 5) > window.innerHeight) {
        toolTip.style.top = top - toolTipHeight + "px";
        toolTip.style.bottom = "auto";
      } else {
        toolTip.style.bottom = "auto";
        toolTip.style.top = bottom + "px";
      }
    }
  }
  const onMouseLeave = () => {
    toolTip && (toolTip.style.display = "none");
  }

  return { onMouseOver, onMouseLeave };
};
