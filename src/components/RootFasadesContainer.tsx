import { ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { appDataAtom } from "../atoms/app";
import FasadContainer from "./FasadContainer";
import Fasad from "../classes/Fasad";
import { isLandscape } from "../functions/functions";

export default function RootFasadesContainer(): ReactElement {
    const [, rerender] = useState(0)
    const [{ rootFasades }] = useAtom(appDataAtom)
    const ratio = rootFasades[0].Width / rootFasades[0].Height
    const rootFasadesContainerRef = useRef<HTMLDivElement>(null)
    const fasadContainers = rootFasades.map((_, i: number) => <FasadContainer key={i} index={i} />)
    const innerWidth = window.innerWidth
    useEffect(() => {
        const onresize = () => rerender(Math.random())
        window.addEventListener('resize', onresize)
        return () => {
            window.removeEventListener('resize', onresize)
        }
    }, [])
    useLayoutEffect(() => {
        resize(ratio, rootFasades, rootFasadesContainerRef)
    }, [innerWidth, ratio, rootFasades])
    return <div ref={rootFasadesContainerRef} className="rootfasades-container">
        {fasadContainers}
    </div>
}



const resize = (ratio: number, rootFasades: Fasad[], rootFasadesContainerRef: React.RefObject<HTMLDivElement>) => {
    if (!rootFasadesContainerRef.current) return
    const propertiesContainer = document.querySelector('.properties-container') as HTMLDivElement
    const mainContainer = document.querySelector('.main-container') as HTMLDivElement
    const landscape = isLandscape()
    const gapWidth = parseFloat(getComputedStyle(rootFasadesContainerRef.current).gap)
    if (landscape) {
        const height = propertiesContainer.offsetHeight
        const spaceWidth = mainContainer.offsetWidth - propertiesContainer.offsetWidth
        const fasadWidth = height * ratio
        const visibleCount = Math.min(Math.floor(spaceWidth / (fasadWidth + gapWidth)), rootFasades.length)
        const width = fasadWidth * visibleCount
        rootFasadesContainerRef.current.style.height = `${height}px`
        rootFasadesContainerRef.current.style.width = `${width}px`
        rootFasadesContainerRef.current.style.overflowX = visibleCount < rootFasades.length ? "scroll" : "unset"
    } else {
        const visibleCount = Math.ceil(rootFasades.length / 2)
        const width = parseFloat(getComputedStyle(propertiesContainer).width);
        //const width = mainContainer.offsetWidth - padding * 2;
        const fasadWidth = width / visibleCount
        const height = fasadWidth / ratio
        rootFasadesContainerRef.current.style.width = `${width}px`
        rootFasadesContainerRef.current.style.height = `${height}px`
        rootFasadesContainerRef.current.style.overflowX = visibleCount < rootFasades.length ? "scroll" : "unset"
    }
    
}

