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
    const ratio = `${fasad.Width}/${fasad.Height}`
    const dims = fasad.Parent === null ? {aspectRatio: ratio, width: "auto", height: "100svh"} : {width:"100%", height:"100%"}
    return <div style={{
        ...dims,
        display: "flex",
        flexDirection: direction,
        justifyContent: "stretch",
        backgroundColor: colors[fasad.Material],
        border: "1px solid black"
    }}>
        {contents}
    </div>
}
