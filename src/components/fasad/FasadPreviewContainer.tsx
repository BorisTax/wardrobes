import { ReactElement, useLayoutEffect } from "react";
import FasadState from "../../classes/FasadState";
import FasadSectionPreview from "./FasadSectionPreview";

type FasadContainerProps = {
    fasad: FasadState
    refObject: React.RefObject<HTMLDivElement>
}

export default function FasadPreviewContainer(props: FasadContainerProps): ReactElement {
    const innerWidth = window.innerWidth
    const rootFasad = props.fasad
    const ratio = rootFasad.width / rootFasad.height
    const aspectRatio = `${rootFasad.width}/${rootFasad.height}`
    const resize = (ratio: number) => {
        if (props.refObject.current) {
            props.refObject.current.style.width = props.refObject.current.offsetHeight * ratio + "px"
        }
    }
    useLayoutEffect(() => {
        resize(ratio)
    }, [ratio, innerWidth, resize])
    return <div className="fasad-container">
        <div ref={props.refObject} className='fasad-section-container' style={{ aspectRatio, height: "300px", width: "auto" }}>
            <FasadSectionPreview fasad={rootFasad}/>
        </div>
    </div>
}