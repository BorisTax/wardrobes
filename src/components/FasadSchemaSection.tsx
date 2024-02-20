import { ReactElement } from "react";
import Fasad from "../classes/Fasad";
import { Division } from "../types/enums";
type FasadSectionProps = {
    fasad: Fasad
}
export default function FasadSchemaSection(props: FasadSectionProps): ReactElement {
    const fasad = props.fasad
    let gridTemplate: {
        gridTemplateColumns: string;
        gridTemplateRows: string;
    } = { gridTemplateRows: "1fr", gridTemplateColumns: "1fr" };
    if (fasad.Children.length > 1) {
        const divHeight = fasad.Division === Division.HEIGHT
        const total = divHeight ? fasad.Height : fasad.Width
        const template = fasad.Children.map((f: Fasad) => `${(divHeight ? (f.Height + 1) / total : (f.Width + 1) / total).toFixed(3)}fr`).join(" ")
        gridTemplate = divHeight ? { gridTemplateRows: template, gridTemplateColumns: "1fr" } : { gridTemplateRows: "1fr", gridTemplateColumns: template }
    }
    let styles: object = fasad.Parent === null ? { height: "100%" } : {}
    let events = {}
    let classes = ""
    if (fasad.Children.length === 0) {
        styles = {
            ...styles,
            display: "flex",
            overflow: "hidden",
            flexShrink: "0",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box"
        }
        events = { onClick: (e: Event) => { e.stopPropagation(); } }
        classes = "fasad-schema-section"
    }
    const contents = fasad.Children.length > 1 ? fasad.Children.map((f: Fasad, i: number) => <FasadSchemaSection key={i} fasad={f} />) : ""
    return <div className={classes} style={{
        display: "grid",
        ...gridTemplate,
        gap: "1px",
        ...styles,
    }}
        {...events}>
        {contents}
    </div>
}



