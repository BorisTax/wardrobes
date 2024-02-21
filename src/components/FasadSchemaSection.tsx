import { ReactElement, useEffect, useRef, useState } from "react";
import Fasad from "../classes/Fasad";
import { Division, FasadMaterial } from "../types/enums";
import { MaterialCaptions, SandBasesCaptions } from "../functions/materials";
type FasadSectionProps = {
    fasad: Fasad
}
export default function FasadSchemaSection(props: FasadSectionProps): ReactElement {
    const [{ vertical, fontSize }, setState] = useState({ vertical: false, fontSize: "1rem" })
    const sectionRef = useRef<HTMLDivElement>(null)
    const nullRef = useRef<HTMLDivElement>(null)
    const fasad = props.fasad
    const lastFasad = fasad.Children.length === 0
    let gridTemplate: {
        gridTemplateColumns: string;
        gridTemplateRows: string;
    } = { gridTemplateRows: "1fr", gridTemplateColumns: "1fr" };
    if (!lastFasad) {
        const divHeight = fasad.Division === Division.HEIGHT
        const total = divHeight ? fasad.Height : fasad.Width
        const template = fasad.Children.map((f: Fasad) => `${(divHeight ? (f.Height + 1) / total : (f.Width + 1) / total).toFixed(3)}fr`).join(" ")
        gridTemplate = divHeight ? { gridTemplateRows: template, gridTemplateColumns: "1fr" } : { gridTemplateRows: "1fr", gridTemplateColumns: template }
    }
    let styles: object = fasad.Parent === null ? { height: "100%" } : {}
    let events = {}
    let classes = ""
    if (lastFasad) {
        styles = {
            ...styles,
            display: "flex",
            overflow: "hidden",
            flexShrink: "0",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box"
        }
        events = {
            onClick: (e: Event) => { e.stopPropagation(); },
        }
        classes = "fasad-schema-section"
    }

    const captionStyle: object = {
        writingMode: vertical ? "vertical-lr" : "horizontal-tb",
        transform: vertical ? "rotate(180deg)" : "",
        fontSize,
        textAlign: "center",
        padding: "0px",
    }
    const caption = <div style={captionStyle}>
        {`${MaterialCaptions.get(fasad.Material)} ${fasad.ExtMaterial} ${fasad.Material === FasadMaterial.SAND ? SandBasesCaptions.get(fasad.SandBase) : ""} (${Math.floor(fasad.cutHeight)}x${Math.floor(fasad.cutWidth)})`}
    </div>
    const contents = !lastFasad ? fasad.Children.map((f: Fasad, i: number) => <FasadSchemaSection key={i} fasad={f} />) : caption
    useEffect(() => {
        const onWhell = (e: WheelEvent) => {
            e.preventDefault();
            if (!e.shiftKey) {
                setState(prev => {
                    let newFontSize = parseFloat(prev.fontSize)
                    const font = newFontSize + 0.1 * Math.sign(e.deltaY)
                    if (font > 0.1) newFontSize = font
                    return { ...prev, fontSize: newFontSize + "rem" }
                })
                return
            }
            setState(prev => ({ ...prev, vertical: !prev.vertical }))
        }
        sectionRef.current?.addEventListener('wheel', onWhell, { passive: false })
        return () => {
            sectionRef.current?.removeEventListener('wheel', onWhell)
        }
    }, [])
    return <div ref={lastFasad ? sectionRef : nullRef} className={classes} style={{
        display: "grid",
        ...gridTemplate,
        gap: "1px",
        ...styles,
    }}
        {...events}>
        {contents}
    </div>
}



