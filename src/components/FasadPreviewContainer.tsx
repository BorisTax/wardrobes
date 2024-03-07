import { ReactElement, useLayoutEffect, useRef } from "react";
import Fasad from "../classes/Fasad";
import FasadSectionPreview from "./FasadSectionPreview";

type FasadContainerProps = {
    fasad: Fasad
}

export default function FasadPreviewContainer(props: FasadContainerProps): ReactElement {
    const innerWidth = window.innerWidth
    const rootFasad = props.fasad
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
    }, [ratio, innerWidth])
    return <div className="fasad-container">
        <div ref={sectionRef} className='fasad-section-container' style={{ aspectRatio, height: "300px", width: "auto" }}>
            <FasadSectionPreview fasad={rootFasad}/>
        </div>
    </div>
}