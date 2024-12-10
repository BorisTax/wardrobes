import { MouseEvent, ReactElement, WheelEvent, useEffect, useMemo, useRef, useState } from "react";
import FasadState from "../../classes/FasadState";
import { Division } from "../../types/enums";
import FixedHeight from "./FixedHeight";
import FixedWidth from "./FixedWidth";
import FixedBoth from "./FixedBoth";
import { useAtomValue, useSetAtom } from "jotai";
import { setActiveFasadAtom } from "../../atoms/fasades";
import { useImageUrl } from "../../custom-hooks/useImage";
import { settingsAtom } from "../../atoms/settings";
import { hasFasadImage } from "../../functions/fasades";
type FasadSectionProps = {
    fasad: FasadState
    rootFasad: FasadState
    activeFasad?: FasadState
}
export default function FasadSection(props: FasadSectionProps): ReactElement {
    const fasad = props.fasad
    const adjustImage = hasFasadImage(fasad)
    const onlyFasad = fasad.children.length === 0
    const activeFasad = props.activeFasad
    const backImageProps = fasad.backImageProps
    if (!adjustImage) {
        backImageProps.top = 0
        backImageProps.left = 0
        backImageProps.size = ""
    }
    const { showFixIcons } = useAtomValue(settingsAtom)
    const setActiveFasad = useSetAtom(setActiveFasadAtom)
    const imageUrl = useImageUrl(fasad.materialId)
    const fasadRef = useRef<HTMLDivElement>(null)
    const nullRef = useRef<HTMLDivElement>(null)
    let gridTemplate: {
        gridTemplateColumns: string;
        gridTemplateRows: string;
    } = { gridTemplateRows: "1fr", gridTemplateColumns: "1fr" };
    if (!onlyFasad) {
        const divHeight = fasad.division === Division.HEIGHT
        const total = divHeight ? fasad.height : fasad.width
        const template = fasad.children.map((f: FasadState) => `${(divHeight ? (f.height + 1) / total : (f.width + 1) / total).toFixed(3)}fr`).join(" ")
        gridTemplate = divHeight ? { gridTemplateRows: template, gridTemplateColumns: "1fr" } : { gridTemplateRows: "1fr", gridTemplateColumns: template }
    }
    let styles: object = fasad.level === 0 ? { height: "100%" } : {}
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
            backgroundRepeat: "repeat",
        }
        events = { 
            onClick: (e: MouseEvent) => { 
                e.stopPropagation(); 
                setActiveFasad(fasad)
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
    const fixedHeight = fasad.children.length === 0 && fasad.fixedHeight && showFixIcons
    const fixedWidth = fasad.children.length === 0 && fasad.fixedWidth && showFixIcons
    const fixedBoth = fixedHeight && fixedWidth
    const fixed = fixedBoth ? <FixedBoth /> : fixedHeight ? <FixedHeight /> : fixedWidth ? <FixedWidth /> : <></>
    const contents = fasad.children.length > 1 ? fasad.children.map((f: FasadState, i: number) => <FasadSection key={i} fasad={f} activeFasad={props.activeFasad} rootFasad={props.rootFasad}/>) : ""

    useEffect(() => {
        const image = new Image()
        const imageSrc = imageUrl
        image.src = imageSrc
        if (fasadRef.current) {
            fasadRef.current.style.backgroundImage = imageSrc || getComputedStyle(fasadRef.current).getPropertyValue('--default-image')
            //fasadRef.current.style.backgroundPosition = `top 0px left 0px`
            //fasadRef.current.style.backgroundSize = ""
            //setBackImagePosition(prev => ({ ...prev, hasImage: false }))
        }
        if (fasadRef.current && onlyFasad && imageSrc) {
                fasadRef.current.style.backgroundImage = `url(${imageSrc})`
            }
    }, [imageUrl, onlyFasad])

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

