import { ReactElement } from "react";
import FasadSection from "./FasadSection";
import Fasad from "../classes/Fasad";

export default function FasadContainer({ rootFasad }: { rootFasad: Fasad }): ReactElement {
    const width = rootFasad.Width * 0.5
    const height = rootFasad.Height * 0.5
    return <div className="fasad-container" style={{ width, height }}><FasadSection fasad={rootFasad} /></div>
}