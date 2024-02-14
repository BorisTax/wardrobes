import { ReactElement, useLayoutEffect, useRef } from "react";
import FasadSection from "./FasadSection";
import ImageButton from "./ImageButton";
import { useAtom, useSetAtom } from "jotai";
import { appDataAtom } from "../atoms/app";
import { activeRootFasadIndexAtom, setActiveFasadAtom } from "../atoms/fasades";

export default function FasadContainer(): ReactElement {
    const [activeRootFasadIndex, setActiveRootFasadIndex] = useAtom(activeRootFasadIndexAtom)
    const setActiveFasad = useSetAtom(setActiveFasadAtom)
    const [{ rootFasades }] = useAtom(appDataAtom)
    const rootFasad = rootFasades[activeRootFasadIndex]
    const activeFasad = rootFasad.getActiveFasad()
    const ratio = rootFasad.Width / rootFasad.Height
    const sectionContainerRef = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        if (sectionContainerRef.current) {
            const width = sectionContainerRef.current.offsetHeight * ratio
            const height = sectionContainerRef.current.offsetWidth / ratio
            screen.orientation.type.startsWith('landscape-') ? sectionContainerRef.current.style.width = `${width}px` : sectionContainerRef.current.style.height = `${height}px`
        }
    }, [rootFasades, screen.orientation.type])
    return <div className='fasad-container' style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", alignItems: "center", gap: "0.5em" }}>
        <ImageButton title="Предыдущий фасад" icon={"prevFasad"} disabled={activeRootFasadIndex === 0} onClick={() => { setActiveRootFasadIndex(activeRootFasadIndex - 1); setActiveFasad(null) }} />
        <div className="d-flex flex-column align-items-center h-100 w-auto">
            <div>{`Фасад ${activeRootFasadIndex + 1}`}</div>
            <div ref={sectionContainerRef} className='fasad-section-container' >
                <FasadSection fasad={rootFasad} activeFasad={activeFasad} rootFasad={rootFasad} />
            </div>
        </div>
        <ImageButton title="Следующий фасад" icon={"nextFasad"} disabled={activeRootFasadIndex === rootFasades.length - 1} onClick={() => { setActiveRootFasadIndex(activeRootFasadIndex + 1); setActiveFasad(null) }} />
    </div>
}