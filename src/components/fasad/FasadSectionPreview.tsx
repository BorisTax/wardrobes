import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import Fasad from "../../classes/Fasad";
import { Division, FASAD_TYPE } from "../../types/enums";
import { useImageUrl } from "../../atoms/materials/materials";
import { FasadBackImageProps } from "../../classes/FasadState";
import { hasFasadImage } from "../../functions/fasades";
type FasadSectionProps = {
    fasad: Fasad
}
export default function FasadSectionPreview(props: FasadSectionProps): ReactElement {
    const fasad = props.fasad
    const adjustImage = hasFasadImage(fasad)
    const onlyFasad = fasad.Children.length === 0
    const backImageProps = fasad.BackImageProps
    if (!adjustImage) {
        backImageProps.top = 0
        backImageProps.left = 0
        backImageProps.size = ""
    }
    const [{ top, left, size, repeat }, setBackImagePosition] = useState({...backImageProps })
    useMemo(() => { setBackImagePosition(prev => ({ ...prev, ...backImageProps })) }, [backImageProps])
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
    const contents = fasad.Children.length > 1 ? fasad.Children.map((f: Fasad, i: number) => <FasadSectionPreview key={i} fasad={f} />) : ""
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