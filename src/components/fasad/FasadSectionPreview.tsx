import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import FasadState from "../../classes/FasadState";
import { Division, FASAD_TYPE } from "../../types/enums";
import { useImageUrl } from "../../custom-hooks/useImage";
import { FasadBackImageProps } from "../../classes/FasadState";
import { hasFasadImage } from "../../functions/fasades";
type FasadSectionProps = {
    fasad: FasadState
}
export default function FasadSectionPreview(props: FasadSectionProps): ReactElement {
    const fasad = props.fasad
    const adjustImage = hasFasadImage(fasad)
    const onlyFasad = fasad.children.length === 0
    const backImageProps = fasad.backImageProps
    if (!adjustImage) {
        backImageProps.top = 0
        backImageProps.left = 0
        backImageProps.size = ""
    }
    const [{ top, left, size, repeat }, setBackImagePosition] = useState({...backImageProps })
    useMemo(() => { setBackImagePosition(prev => ({ ...prev, ...backImageProps })) }, [backImageProps])
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
            border: "1px solid black",
            backgroundPosition: `top ${top}px left ${left}px`,
            backgroundSize: typeof size === "number" ? `${size}%` : size,
            backgroundRepeat: repeat ? "repeat" : "no-repeat",
        }
        classes = "fasad-section-preview"
    }else{
        styles = {
            ...styles,
            backgroundImage: ""
        }
    }
    const contents = fasad.children.length > 1 ? fasad.children.map((f: FasadState, i: number) => <FasadSectionPreview key={i} fasad={f} />) : ""
    useEffect(() => {
        const image = new Image()
        const imageSrc = imageUrl
        image.src = imageSrc
        if (fasadRef.current) {
            fasadRef.current.style.backgroundImage = getComputedStyle(fasadRef.current).getPropertyValue('--default-image')
            fasadRef.current.style.backgroundPosition = `top 0px left 0px`
            fasadRef.current.style.backgroundSize = ""
            setBackImagePosition(prev => ({ ...prev, hasImage: false }))
        }
        image.onload = () => {
            if (fasadRef.current && onlyFasad) {
                fasadRef.current.style.backgroundImage = `url(${imageSrc})`
                setBackgroundStyle(fasadRef.current, {top, left, size, repeat})
                setBackImagePosition(prev => ({ ...prev, hasImage: true }))
            }
        }
    }, [imageUrl, onlyFasad, top, left, size, repeat])

    return <div ref={onlyFasad ? fasadRef : nullRef} className={classes} style={{
        display: "grid",
        ...gridTemplate,
        gap: "1px",
        ...styles,
    }}

    >
        {contents}
    </div>
}

function setBackgroundStyle(element: HTMLDivElement, props: FasadBackImageProps){
    element.style.backgroundPosition = `top ${props.top}px left ${props.left}px`
    element.style.backgroundSize = typeof props.size === "number" ? `${props.size}%` : props.size
    element.style.backgroundRepeat = props.repeat ? "repeat" : "no-repeat"

}