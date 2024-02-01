import React, { ReactElement, useContext } from "react";
import Fasad from "../classes/Fasad";
import { Division, FasadMaterial } from "../types/enums";
import { AppContext } from "../App";
import { colors } from "../assets/data";
import { setActiveFasad } from "../actions/AppActions";
type FasadSectionProps = {
    fasad: Fasad
}
export default function FasadSection(props: FasadSectionProps): ReactElement {
    const fasad = props.fasad
    const {state, dispatch} = useContext(AppContext)
    const contents = fasad.Children.length > 1 ? fasad.Children.map((f: Fasad, i: number) => <FasadSection key={i} fasad={f} />) : ""
    let gridTemplate: {
        gridTemplateColumns: string;
        gridTemplateRows: string;
    } = { gridTemplateRows: "1fr", gridTemplateColumns: "1fr" };
    if (fasad.Children.length > 1) {
        const divHeight = fasad.Division === Division.HEIGHT
        const total = divHeight ? fasad.Height : fasad.Width
        const template = fasad.Children.map((f: Fasad) => `${(divHeight ? f.Height / total : f.Width / total).toFixed(3)}fr`).join(" ")
        gridTemplate = divHeight ? { gridTemplateRows: template, gridTemplateColumns: "1fr" } : { gridTemplateRows: "1fr", gridTemplateColumns: template }
    }
    let styles: ExtStyles = fasad.Parent === null ? { height: "100%" } : {}
    let events = {}
    let classes = ""
    if (fasad.Children.length === 0) {
        styles = { ...styles, backgroundColor: colors[fasad.Material], cursor: "pointer", border: (fasad === state.activeFasad ? "3px solid red" : "") }
        events = { onClick: (e: Event) => {e.stopPropagation(); dispatch(setActiveFasad(fasad))}}
        classes = "fasad-section" 
    }
    return <div className={classes} style={{
        ...styles,
        display: "grid",
        ...gridTemplate,
        gap: "1px",
    }}
    {...events}>
        {contents}
    </div>
}

type ExtStyles = {
    aspectRatio?: string
    width?: string
    height?: string
    backgroundColor?: string
    cursor?: string
    border?: string
}