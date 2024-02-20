import { ReactElement, useLayoutEffect, useRef } from "react";
import { useAtom } from "jotai";
import { appDataAtom } from "../atoms/app";
import FasadSchemaSection from "./FasadSchemaSection";

type FasadContainerProps = {
    index: number
}

export default function FasadSchemaContainer({ index }: FasadContainerProps): ReactElement {
    const [{ rootFasades }] = useAtom(appDataAtom)
    const rootFasad = rootFasades[index]
    const ratio = rootFasad.Width / rootFasad.Height
    const aspectRatio = `${rootFasad.Width}/${rootFasad.Height}`
    const sectionRef = useRef<HTMLDivElement>(null)
    const resize = (ratio: number) => {
        if (sectionRef.current) {
            sectionRef.current.style.width = sectionRef.current.offsetHeight * ratio + "px"
        }
    }
    useLayoutEffect(() => {
        resize(ratio)
    }, [ratio])
    return <div className="fasad-container">
        <div className={`text-center`}>{`Фасад ${index + 1}`}</div>
        <div ref={sectionRef} className='fasad-section-container' style={{ aspectRatio, height: "100%", width: "auto" }}>
            <FasadSchemaSection fasad={rootFasad}/>
        </div>
    </div>
}