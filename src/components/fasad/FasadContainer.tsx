import { ReactElement, useLayoutEffect, useRef } from "react";
import FasadSection from "./FasadSection";
import { useAtom, useAtomValue } from "jotai";
import { appDataAtom } from "../../atoms/app";
import { activeFasadAtom, activeRootFasadIndexAtom } from "../../atoms/fasades";

type FasadContainerProps = {
    index: number
}

export default function FasadContainer({ index }: FasadContainerProps): ReactElement {
    const [{ rootFasades }] = useAtom(appDataAtom)
    const activeRootFasadIndex = useAtomValue(activeRootFasadIndexAtom)
    const innerWidth = window.innerWidth
    const rootFasad = rootFasades[index]
    const ratio = rootFasad.Width / rootFasad.Height
    const aspectRatio = `${rootFasad.Width}/${rootFasad.Height}`
    const [activeFasad] = useAtom(activeFasadAtom)
    const sectionRef = useRef<HTMLDivElement>(null)
    const activeClass = activeRootFasadIndex === index ? "fw-bold" : ""
    const resize = (ratio: number) => {
        if (sectionRef.current) {
            sectionRef.current.style.width = sectionRef.current.offsetHeight * ratio + "px"
        }
    }
    useLayoutEffect(() => {
        resize(ratio)
    }, [ratio, innerWidth])
    return <div className="fasad-container">
        <div className={`text-center ${activeClass}`}>{`Фасад ${index + 1}`}</div>
        <div ref={sectionRef} className='fasad-section-container' style={{ aspectRatio, height: "100%", width: "auto" }}>
            <FasadSection fasad={rootFasad} activeFasad={activeFasad} rootFasad={rootFasad} />
        </div>
    </div>
}