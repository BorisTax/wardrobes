import { MouseEvent, ReactElement, WheelEvent, useEffect, useMemo, useRef, useState } from "react";
import Fasad from "../../classes/Fasad";
import { Division, FASAD_TYPE } from "../../types/enums";
import FixedHeight from "./FixedHeight";
import FixedWidth from "./FixedWidth";
import FixedBoth from "./FixedBoth";
import { useAtomValue, useSetAtom } from "jotai";
import { setActiveFasadAtom } from "../../atoms/fasades";
import { useImageUrl } from "../../custom-hooks/useImage";
import { settingsAtom } from "../../atoms/settings";
import { FasadBackImageProps, getInitialBackImageProps } from "../../classes/FasadState";
import { hasFasadImage } from "../../functions/fasades";
type FasadSectionProps = {
    fasad: Fasad
    rootFasad: Fasad
    activeFasad: Fasad | null
}
export default function FasadSection(props: FasadSectionProps): ReactElement {
    const fasad = props.fasad
    const adjustImage = hasFasadImage(fasad)
    const onlyFasad = fasad.Children.length === 0
    const activeFasad = props.activeFasad
    const backImageProps = fasad.BackImageProps
    if (!adjustImage) {
        backImageProps.top = 0
        backImageProps.left = 0
        backImageProps.size = ""
    }
    const [{ top, left, size, repeat, drag, x0, y0, hasImage }, setBackImagePosition] = useState({ hasImage: false, ...backImageProps, drag: false, x0: 0, y0: 0 })
    useMemo(() => { setBackImagePosition(prev => ({ ...prev, ...backImageProps })) }, [fasad, backImageProps.top, backImageProps.left, backImageProps.size, backImageProps.repeat])
    const { showFixIcons } = useAtomValue(settingsAtom)
    const setActiveFasad = useSetAtom(setActiveFasadAtom)
    const imageUrl = useImageUrl(fasad.MaterialId)
    const fasadRef = useRef<HTMLDivElement>(null)
    const nullRef = useRef<HTMLDivElement>(null)
    let gridTemplate: {
        gridTemplateColumns: string;
        gridTemplateRows: string;
    } = { gridTemplateRows: "1fr", gridTemplateColumns: "1fr" };
    if (!onlyFasad) {
        const divHeight = fasad.Division === Division.HEIGHT
        const total = divHeight ? fasad.Height : fasad.Width
        const template = fasad.Children.map((f: Fasad) => `${(divHeight ? (f.Height + 1) / total : (f.Width + 1) / total).toFixed(3)}fr`).join(" ")
        gridTemplate = divHeight ? { gridTemplateRows: template, gridTemplateColumns: "1fr" } : { gridTemplateRows: "1fr", gridTemplateColumns: template }
    }
    let styles: object = fasad.Parent === null ? { height: "100%" } : {}
    styles = { ...styles, boxShadow: (fasad === activeFasad) ? "inset 0px 0px 10px red" : "" }
    let events = {}
    let classes = ""
    if (onlyFasad) {
        styles = {
            ...styles,
            display: "flex",
            overflow: "hidden",
            flexShrink: "0",
            justifyContent: "center",
            alignItems: "center",
            objectFit: "cover",
            cursor: "pointer",
            border: "1px solid black",
            backgroundPosition: `top ${top}px left ${left}px`,
            backgroundSize: typeof size === "number" ? `${size}%` : size,
            backgroundRepeat: repeat ? "repeat" : "no-repeat",
        }
        events = { 
            onClick: (e: MouseEvent) => { 
                e.stopPropagation(); 
                setActiveFasad(fasad)
             },
            onMouseDown: (e: MouseEvent) => { 
                if(!adjustImage) return
                if (e.button === 1) {
                    const initProps = getInitialBackImageProps()
                    setBackImagePosition(prev => ({ ...prev, ...initProps }))
                    fasad.BackImageProps = {...initProps}
                    return
                }
                if (e.button !== 0) return
                if (!e.shiftKey) return
                if (!hasImage) return;
                setBackImagePosition(prev => ({ ...prev, drag: true, x0: e.clientX, y0: e.clientY })) 
            },
            onMouseMove: (e: MouseEvent) => {
                if (e.button !== 0) return
                if (!drag) return;
                const dx = e.clientX - x0
                const dy = e.clientY - y0
                setBackImagePosition(prev => ({ ...prev, top: prev.top + dy, left: prev.left + dx, x0: e.clientX, y0: e.clientY }))
            },
            onMouseUp: (e: MouseEvent) => { 
                if(!adjustImage) return
                if (e.button !== 0) return true; 
                setBackImagePosition(prev => ({ ...prev, drag: false })) 
                fasad.BackImageProps = {top, left, size, repeat}
            },
            onMouseLeave: () => { 
                if(!adjustImage) return
                setBackImagePosition(prev => ({ ...prev, drag: false }))
                fasad.BackImageProps = {top, left, size, repeat}
            },

        }
        classes = "fasad-section"
    }else{
        styles = {
            ...styles,
            border: (fasad === activeFasad) ? "1px solid red" : "",
            backgroundColor: "white",
            backgroundImage: ""
        }
    }
    const fixedHeight = fasad.Children.length === 0 && fasad.FixedHeight() && showFixIcons
    const fixedWidth = fasad.Children.length === 0 && fasad.FixedWidth() && showFixIcons
    const fixedBoth = fixedHeight && fixedWidth
    const fixed = fixedBoth ? <FixedBoth /> : fixedHeight ? <FixedHeight /> : fixedWidth ? <FixedWidth /> : <></>
    const contents = fasad.Children.length > 1 ? fasad.Children.map((f: Fasad, i: number) => <FasadSection key={i} fasad={f} activeFasad={props.activeFasad} rootFasad={props.rootFasad}/>) : ""

    useEffect(() => {
        const image = new Image()
        const imageSrc = imageUrl
        image.src = imageSrc
        if (fasadRef.current) {
            fasadRef.current.style.backgroundImage = imageSrc || getComputedStyle(fasadRef.current).getPropertyValue('--default-image')
            fasadRef.current.style.backgroundPosition = `top 0px left 0px`
            fasadRef.current.style.backgroundSize = ""
            setBackImagePosition(prev => ({ ...prev, hasImage: false }))
        }
        if (fasadRef.current && onlyFasad && imageSrc) {
                fasadRef.current.style.backgroundImage = `url(${imageSrc})`
                setBackgroundStyle(fasadRef.current, {top, left, size, repeat})
                setBackImagePosition(prev => ({ ...prev, hasImage: true }))
                setActiveFasad(fasad)
            }
    }, [imageUrl, onlyFasad])
    useEffect(() => {
        if(!adjustImage) return
        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (!hasImage) return;
            const dx = e.clientX - (e.target as HTMLDivElement).offsetLeft - left
            const dy = e.clientY - (e.target as HTMLDivElement).offsetTop - top
            const scale = Math.sign(e.deltaY) >= 0 ? e.shiftKey ? 0.99 : 0.9 : e.shiftKey ? 1.01 : 1.1;
            setBackImagePosition(prev => {
                const pSize = typeof prev.size === "string" ? 100 : prev.size;
                return ({ ...prev, size: pSize * scale, top: top + dy * (1 - scale), left: left + dx * (1 - scale) })
            })
            fasad.BackImageProps = { top, left, size, repeat }
        }
        // @ts-ignore
        fasadRef.current?.addEventListener("wheel", onWheel, { passive: false })
        return () => {
            // @ts-ignore
            fasadRef.current?.removeEventListener("wheel", onWheel)
        }
    }, [hasImage, left, top, adjustImage])
    return <div ref={onlyFasad ? fasadRef : nullRef} className={classes} style={{
        display: "grid",
        ...gridTemplate,
        gap: "1px",
        ...styles,
    }}
        {...events}>
        {contents}
        {fixed}
    </div>
}



function setBackgroundStyle(element: HTMLDivElement, props: FasadBackImageProps){
    element.style.backgroundPosition = `top ${props.top}px left ${props.left}px`
    element.style.backgroundSize = typeof props.size === "number" ? `${props.size}%` : props.size
    element.style.backgroundRepeat = props.repeat ? "repeat" : "no-repeat"

}