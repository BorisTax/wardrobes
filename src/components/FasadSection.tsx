import React, { ReactElement } from "react";
import Fasad from "../classes/Fasad";
import { Division, FasadMaterial } from "../types/enums";
type FasadSectionProps = {
    fasad: Fasad
}

export default function FasadSection(props: FasadSectionProps): ReactElement {
    const direction = props.fasad.Division === Division.HEIGHT ? "row" : "column"
    const fasad = props.fasad
    const colors = {
        [FasadMaterial.DSP]: "#ff7b00",
        [FasadMaterial.FMP]: "#ff00f2",
        [FasadMaterial.MIRROR]: "#00e1ff",
        [FasadMaterial.LACOBEL]: "#ffc400",
        [FasadMaterial.LACOBELGLASS]: "#fffb00",
        [FasadMaterial.SAND]: "#15ff00"
    }
    const contents = fasad.Children.length > 1 ? fasad.Children.map((f: Fasad, i: number) => <FasadSection key={i} fasad={f} />) : ""
    let gridTemplate: {
      gridTemplateColumns: string;
      gridTemplateRows: string;
    } = {gridTemplateRows: "1fr" , gridTemplateColumns: "1fr" };
    if (fasad.Children.length > 1) {
        const divHeight = fasad.Division === Division.HEIGHT
        const total = divHeight?fasad.Height:fasad.Width
        const template = fasad.Children.map((f:Fasad)=>`${(divHeight?f.Height/total:f.Width/total).toFixed(3)}fr`).join(" ") 
        gridTemplate = divHeight?  {gridTemplateRows: template, gridTemplateColumns:"1fr"}:{gridTemplateRows: "1fr",gridTemplateColumns: template}
    }
    const ratio = `${fasad.Width}/${fasad.Height}`
    let styles: ExtStyles = fasad.Parent === null ? {aspectRatio: ratio, width: "auto", height: "100svh"} : {}
    if (fasad.Children.length===0) styles={...styles,  backgroundColor: colors[fasad.Material]}
    return <div style={{
        ...styles,
        display: "grid",
        ...gridTemplate,
        gap: "1px",
        
    }}>
        {contents}
    </div>
}

type ExtStyles={
    aspectRatio?: string
    width?: string
    height?: string
    backgroundColor?: string
}