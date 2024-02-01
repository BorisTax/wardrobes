import { ReactElement } from "react";
import FasadSection from "./FasadSection";
import Fasad from "../classes/Fasad";

export default function FasadContainer({ rootFasad }: { rootFasad: Fasad }): ReactElement {
    const ratio = `${rootFasad.Width}/${rootFasad.Height}`
    return <div className="fasad-container col-10 p-0" style={{ aspectRatio: ratio, width: "auto", height: "90svh" }}><FasadSection fasad={rootFasad} /></div>
}