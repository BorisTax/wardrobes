import { ReactNode } from "react"

type ImageButtonBarProps = {
    children: ReactNode[] | ReactNode,
    justifyContent?: string,
}

export default function ImageButtonBar(props: ImageButtonBarProps) {
    return <div style={{
        display: "flex",
        justifyContent: props.justifyContent || "flex-start",
        flexWrap: "nowrap",
    }}>
        {props.children}
    </div>
}