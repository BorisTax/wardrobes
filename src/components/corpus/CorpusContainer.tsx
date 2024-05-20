import { ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { appDataAtom } from "../../atoms/app";
import Fasad from "../../classes/Fasad";
import { isLandscape } from "../../functions/functions";
import ShapeElement from "./ShapeElement";
import { shapesAtom } from "../../atoms/corpus";

export default function CorpusContainer(): ReactElement {
    const [, rerender] = useState(0)
    const shapes = useAtomValue(shapesAtom)
    const corpusContainerRef = useRef<HTMLDivElement>(null)
    const innerWidth = window.innerWidth
    const shapeElements = [...shapes].map(s=><ShapeElement shape={s} />)
    useEffect(() => {
        const onresize = () => rerender(Math.random())
        window.addEventListener('resize', onresize)
        return () => {
            window.removeEventListener('resize', onresize)
        }
    }, [])
    useLayoutEffect(() => {
        //resize(ratio, rootFasades, corpusContainerRef)
    }, [innerWidth])
    return <div ref={corpusContainerRef} className="corpus-container">
        {shapeElements}
    </div>
}

const resize = (ratio: number, rootFasades: Fasad[], corpusContainerRef: React.RefObject<HTMLDivElement>) => {
    if (!corpusContainerRef.current) return
    const propertiesContainer = document.querySelector('.properties-container') as HTMLDivElement
    const mainContainer = document.querySelector('.main-container') as HTMLDivElement
    const landscape = isLandscape()
    const gapWidth = parseFloat(getComputedStyle(corpusContainerRef.current).gap)
    if (landscape) {
        const height = propertiesContainer.offsetHeight
        const spaceWidth = mainContainer.offsetWidth - propertiesContainer.offsetWidth
        const fasadWidth = height * ratio
        const visibleCount = Math.min(Math.floor(spaceWidth / (fasadWidth + gapWidth)), rootFasades.length)
        const width = fasadWidth * visibleCount
        corpusContainerRef.current.style.height = `${height}px`
        corpusContainerRef.current.style.width = `${width}px`
        corpusContainerRef.current.style.overflowX = visibleCount < rootFasades.length ? "scroll" : "unset"
    } else {
        const visibleCount = Math.ceil(rootFasades.length / 2)
        const width = parseFloat(getComputedStyle(propertiesContainer).width);
        //const width = mainContainer.offsetWidth - padding * 2;
        const fasadWidth = width / visibleCount
        const height = fasadWidth / ratio
        corpusContainerRef.current.style.width = `${width}px`
        corpusContainerRef.current.style.height = `${height}px`
        corpusContainerRef.current.style.overflowX = visibleCount < rootFasades.length ? "scroll" : "unset"
    }
    
}

