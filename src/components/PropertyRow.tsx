import { ReactNode } from "react"

type PropertyRowProps = {
    children: ReactNode
}
export default function PropertyRow(props: PropertyRowProps){
    return <div className="property-row">{props.children}</div>
}