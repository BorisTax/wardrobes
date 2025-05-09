import { ReactElement, useLayoutEffect, useRef } from "react";
import FasadSection from "./FasadSection";
import { useAtomValue } from "jotai";
import { combiStateAtom } from "../../atoms/app";
import { activeFasadAtom, activeRootFasadIndexAtom } from "../../atoms/fasades";

type FasadContainerProps = {
    index: number
}

export default function FasadContainer({ index }: FasadContainerProps): ReactElement {
    const { rootFasades } = useAtomValue(combiStateAtom)
    const activeRootFasadIndex = useAtomValue(activeRootFasadIndexAtom)
    const innerWidth = window.innerWidth
    const rootFasad = rootFasades[index]
    const ratio = rootFasad.width / rootFasad.height
    const activeFasades = useAtomValue(activeFasadAtom)
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
        <div className={`text-center ${activeClass}`}>{`${index + 1}`}</div>
        <div ref={sectionRef} className='fasad-section-container' style={{ height: "100%", width: "auto" }}>
            <FasadSection fasad={rootFasad} activeFasades={activeFasades} rootFasad={rootFasad} />
        </div>
    </div>
}