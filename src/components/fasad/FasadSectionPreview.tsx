import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import Fasad from "../../classes/Fasad";
import { Division, FasadMaterial, SandBase } from "../../types/enums";
import { useImageUrl } from "../../atoms/materials";
import { imagesSrcUrl } from "../../options";
import { FasadBackImageProps } from "../../classes/FasadState";
import { hasFasadImage } from "../../functions/fasades";
import FixedBoth from "./FixedBoth";
import FixedHeight from "./FixedHeight";
import FixedWidth from "./FixedWidth";
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
    useMemo(() => { setBackImagePosition(prev => ({ ...prev, ...backImageProps })) }, [fasad, backImageProps.top, backImageProps.left, backImageProps.size, backImageProps.repeat])
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
            mixBlendMode: (fasad.Material === FasadMaterial.SAND && fasad.SandBase === SandBase.SAND) ? "difference" : "normal"
        }
        classes = "fasad-section-preview"
    }else{
        styles = {
            ...styles,
            backgroundImage: ""
        }
    }
    const fixedHeight = fasad.Children.length === 0 && fasad.FixedHeight()
    const fixedWidth = fasad.Children.length === 0 && fasad.FixedWidth()
    const fixedBoth = fixedHeight && fixedWidth
    const fixed = fixedBoth ? <FixedBoth /> : fixedHeight ? <FixedHeight /> : fixedWidth ? <FixedWidth /> : <></>
    const contents = fasad.Children.length > 1 ? fasad.Children.map((f: Fasad, i: number) => <FasadSectionPreview key={i} fasad={f} />) : ""
    useEffect(() => {
        const image = new Image()
        const imageSrc = `${imagesSrcUrl}${imageUrl}`
        const backImage = `url("${imageSrc}")`
        image.src = imageSrc
        if (fasadRef.current) {
            fasadRef.current.style.backgroundImage = getComputedStyle(fasadRef.current).getPropertyValue('--default-image')
            fasadRef.current.style.backgroundPosition = `top 0px left 0px`
            fasadRef.current.style.backgroundSize = ""
            setBackImagePosition(prev => ({ ...prev, hasImage: false }))
        }
        image.onload = () => {
            if (fasadRef.current && onlyFasad) {
                fasadRef.current.style.backgroundImage = backImage
                setBackgroundStyle(fasadRef.current, {top, left, size, repeat})
                setBackImagePosition(prev => ({ ...prev, hasImage: true }))
            }
        }
    }, [imageUrl, onlyFasad])

    return <div ref={onlyFasad ? fasadRef : nullRef} className={classes} style={{
        display: "grid",
        ...gridTemplate,
        gap: "1px",
        ...styles,
    }}

    >
        {contents}
        {fixed}
    </div>
}

function setBackgroundStyle(element: HTMLDivElement, props: FasadBackImageProps){
    element.style.backgroundPosition = `top ${props.top}px left ${props.left}px`
    element.style.backgroundSize = typeof props.size === "number" ? `${props.size}%` : props.size
    element.style.backgroundRepeat = props.repeat ? "repeat" : "no-repeat"

}