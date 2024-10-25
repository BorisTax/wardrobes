import { ReactElement, useEffect, useRef, useState } from "react";
import Hammer from "hammerjs"
import FasadState from "../../classes/FasadState";
import { Division } from "../../types/enums";
import useDoubleClick from "../../custom-hooks/useDoubleClick";
import { useAtomValue } from "jotai";
import { materialListAtom } from "../../atoms/materials/chars";
import { useMaterialMap } from "../../custom-hooks/useMaterialMap";
import { getFasadCutHeight, getFasadCutWidth } from "../../functions/fasades";
type FasadSectionProps = {
    fasad: FasadState
}
export default function FasadSchemaSection(props: FasadSectionProps): ReactElement {
    const [{ vertical, fontSize }, setState] = useState({ vertical: false, fontSize: "1rem" })
    const sectionRef = useRef<HTMLDivElement>(null)
    const captionRef = useRef<HTMLDivElement>(null)
    const nullRef = useRef<HTMLDivElement>(null)
    const materialList = useAtomValue(materialListAtom)
    const matMap = useMaterialMap(materialList)
    const fasad = props.fasad
    const lastFasad = fasad.children.length === 0
    let gridTemplate: {
        gridTemplateColumns: string;
        gridTemplateRows: string;
    } = { gridTemplateRows: "1fr", gridTemplateColumns: "1fr" };
    if (!lastFasad) {
        const divHeight = fasad.division === Division.HEIGHT
        const total = divHeight ? fasad.height : fasad.width
        const template = fasad.children.map((f: FasadState) => `${(divHeight ? (f.height + 1) / total : (f.width + 1) / total).toFixed(3)}fr`).join(" ")
        gridTemplate = divHeight ? { gridTemplateRows: template, gridTemplateColumns: "1fr" } : { gridTemplateRows: "1fr", gridTemplateColumns: template }
    }
    let styles: object = fasad.level === 0 ? { height: "100%" } : {}
    let events = {}
    let classes = ""
    const onZoom = (zoom: number, scale = 0.1) => {
        setState(prev => {
            let newFontSize = parseFloat(prev.fontSize)
            const font = newFontSize - scale * Math.sign(zoom)
            if (font > 0.1) newFontSize = font
            return { ...prev, fontSize: newFontSize + "rem" }
        })
    }
    const doubleClick = useDoubleClick((e: Event) => { setState(prev => ({ ...prev, vertical: !prev.vertical })); e.stopPropagation() })
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
            onClick: doubleClick,
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
    const caption = <div ref={captionRef} style={captionStyle}>
        {`${matMap.get(fasad.materialId)?.type} ${matMap.get(fasad.materialId)?.name} (${Math.floor(getFasadCutHeight(fasad))}x${Math.floor(getFasadCutWidth(fasad))})`}
    </div>
    const contents = !lastFasad ? fasad.children.map((f: FasadState, i: number) => <FasadSchemaSection key={i} fasad={f} />) : caption
    const [, setHammer] = useState<HammerManager | null>(null)
    
    useEffect(() => {
        if (captionRef.current) {
            const hammer = new Hammer(captionRef.current)
            hammer.get("pan").set({ enable: false })
            hammer.get("pinch").set({ enable: true })
            hammer.on("pinch", (e: HammerInput) => {
                onZoom(1 - e.scale, 0.005)
            })
            setHammer(hammer)
        }
    }, [captionRef.current])
    useEffect(() => {
        const onWhell = (e: WheelEvent) => {
            e.preventDefault();
            if (!e.shiftKey) {
                onZoom(e.deltaY)
                return
            }
            setState(prev => ({ ...prev, vertical: !prev.vertical }))
        }
        const current = sectionRef.current
        current?.addEventListener('wheel', onWhell, { passive: false })
        return () => {
            current?.removeEventListener('wheel', onWhell)
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



