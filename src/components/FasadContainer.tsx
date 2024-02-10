import { ReactElement, useEffect } from "react";
import FasadSection from "./FasadSection";
import ImageButton from "./ImageButton";
import { useAtom } from "jotai";
import { activeRootFasadIndexAtom, rootFasadesAtom } from "../atoms/fasades";

export default function FasadContainer(): ReactElement {
    const [activeRootFasadIndex, setActiveRootFasadIndex] = useAtom(activeRootFasadIndexAtom)
    const [rootFasades] = useAtom(rootFasadesAtom)
    const rootFasad = rootFasades[activeRootFasadIndex]
    const activeFasad = rootFasad.getActiveFasad()
    const ratio = `${rootFasad.Width}/${rootFasad.Height}`
    return <div className='fasad-container' style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", alignItems: "center", gap: "0.5em" }}>
        <ImageButton title="Предыдущий фасад" icon={"prevFasad"} disabled={activeRootFasadIndex === 0} onClick={() => { setActiveRootFasadIndex(activeRootFasadIndex - 1) }} />
        <div className='fasad-section-container' style={{ aspectRatio: ratio }}>
            <FasadSection fasad={rootFasad} activeFasad={activeFasad} rootFasad={rootFasad} />
        </div>
        <ImageButton title="Следующий фасад" icon={"nextFasad"} disabled={activeRootFasadIndex === rootFasades.length - 1} onClick={() => { setActiveRootFasadIndex(activeRootFasadIndex + 1) }} />
    </div>
}