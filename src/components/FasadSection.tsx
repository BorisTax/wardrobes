import { ReactElement, useEffect, useRef, useState } from "react";
import Fasad from "../classes/Fasad";
import { Division } from "../types/enums";
import FixedHeight from "./FixedHeight";
import FixedWidth from "./FixedWidth";
import FixedBoth from "./FixedBoth";
import { useSetAtom } from "jotai";
import { setActiveFasadAtom } from "../atoms/fasades";
import { useImageUrl } from "../atoms/materials";
import { imagesSrcUrl } from "../options";
type FasadSectionProps = {
    fasad: Fasad
    rootFasad: Fasad
    activeFasad: Fasad | null
}
export default function FasadSection(props: FasadSectionProps): ReactElement {
    const fasad = props.fasad
    const onlyFasad = fasad.Children.length === 0
    const rootFasad = props.rootFasad
    const activeFasad = props.activeFasad
    const [backgroundBackupImage, setBackgroundBackupImage] = useState("")
    const setActiveFasad = useSetAtom(setActiveFasadAtom)
    const imageUrl = useImageUrl(fasad.ExtMaterial)
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
    styles = { ...styles, border: (fasad === activeFasad ? "3px solid red" : "") }
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
            objectFit: "contain",
            cursor: "pointer",
        }
        events = { onClick: (e: Event) => { e.stopPropagation(); setActiveFasad(fasad) } }
        classes = "fasad-section"
    }
    const fixedHeight = fasad.Children.length === 0 && fasad.FixedHeight()
    const fixedWidth = fasad.Children.length === 0 && fasad.FixedWidth()
    const fixedBoth = fixedHeight && fixedWidth
    const contents = fasad.Children.length > 1 ? fasad.Children.map((f: Fasad, i: number) => <FasadSection key={i} fasad={f} activeFasad={activeFasad} rootFasad={rootFasad} />) : ""
    const fixed = fixedBoth ? <FixedBoth /> : fixedHeight ? <FixedHeight /> : fixedWidth ? <FixedWidth /> : <></>
    useEffect(() => {
        if (fasadRef.current) setBackgroundBackupImage(fasadRef.current.style.backgroundImage)
    }, [])
    useEffect(() => {
        const image = new Image()
        const imageSrc = `${imagesSrcUrl}${imageUrl}`
        const backImage = `url("${imageSrc}")`
        image.src = imageSrc
        if (fasadRef.current) fasadRef.current.style.backgroundImage = backgroundBackupImage
        image.onload = () => {
            if (fasadRef.current) fasadRef.current.style.backgroundImage = backImage
        }
    }, [imagesSrcUrl, imageUrl])
    return <div ref={onlyFasad ? fasadRef : nullRef} className={classes} style={{
        display: "grid",
        ...gridTemplate,
        gap: "2px",
        ...styles,
    }}
        {...events}>
        {contents}
        {fixed}
    </div>
}



