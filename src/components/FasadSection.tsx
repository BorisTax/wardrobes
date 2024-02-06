import React, { ReactElement, useContext } from "react";
import Fasad from "../classes/Fasad";
import { Division } from "../types/enums";
import { AppContext } from "../App";
import { colors } from "../assets/data";
import { setActiveFasad } from "../actions/AppActions";
import FixedHeight from "./FixedHeight";
import FixedWidth from "./FixedWidth";
import FixedBoth from "./FixedBoth";
type FasadSectionProps = {
    fasad: Fasad
}
export default function FasadSection(props: FasadSectionProps): ReactElement {
    const fasad = props.fasad
    const { state, dispatch } = useContext(AppContext)
    const rootFasad = state.rootFasades[state.activeRootFasadIndex]
    const activeFasad = rootFasad.getActiveFasad()
    const contents = fasad.Children.length > 1 ? fasad.Children.map((f: Fasad, i: number) => <FasadSection key={i} fasad={f} />) : ""
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
    let styles: ExtStyles = fasad.Parent === null ? { height: "100%" } : {}
    styles = { ...styles, border: (fasad === activeFasad ? "3px solid red" : "") }
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
            backgroundColor: colors[fasad.Material],
            cursor: "pointer",
            //border: (fasad === activeFasad ? "3px solid red" : ""),

        }
        events = { onClick: (e: Event) => { e.stopPropagation(); dispatch(setActiveFasad(fasad)) } }
        classes = "fasad-section"
    } else {
        //styles ={...styles, border}
    }
    const fixedHeight = fasad.Children.length === 0 && fasad.FixedHeight()
    const fixedWidth = fasad.Children.length === 0 && fasad.FixedWidth()
    const fixedBoth = fixedHeight && fixedWidth
    const fixed = fixedBoth ? <FixedBoth /> : fixedHeight ? <FixedHeight /> : fixedWidth ? <FixedWidth /> : <></>
    return <div className={classes} style={{
        display: "grid",
        ...gridTemplate,
        gap: "1px",
        ...styles,
    }}
        {...events}>
        {contents}
        {fixed}
    </div>
}

type ExtStyles = {
    display?: string
    justifyContent?: string
    overflow?: string
    flexShrink?: string
    alignItems?: string
    aspectRatio?: string
    width?: string
    height?: string
    backgroundColor?: string
    cursor?: string
    border?: string
}

