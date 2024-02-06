import { ReactElement, useContext } from "react";
import FasadSection from "./FasadSection";
import Fasad from "../classes/Fasad";
import ToolButton from "./ToolButton";
import { AppContext } from "../App";
import { setRootfasad } from "../actions/AppActions";

export default function FasadContainer({ rootFasad }: { rootFasad: Fasad }): ReactElement {
    const ratio = `${rootFasad.Width}/${rootFasad.Height}`
    const { state, dispatch } = useContext(AppContext)
    return <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", alignItems: "center", gap: "0.5em" }}>
        <ToolButton title="Предыдущий фасад" icon={"prevFasad"} disabled={state.activeRootFasadIndex === 0} onClick={() => { dispatch(setRootfasad(state.activeRootFasadIndex - 1)) }} />
        <div className="fasad-container" style={{ aspectRatio: ratio, width: "auto", height: "90svh" }}>
            <FasadSection fasad={rootFasad} />
        </div>
        <ToolButton title="Следующий фасад" icon={"nextFasad"} disabled={state.activeRootFasadIndex === state.rootFasades.length - 1} onClick={() => { dispatch(setRootfasad(state.activeRootFasadIndex + 1)) }} />
    </div>
}