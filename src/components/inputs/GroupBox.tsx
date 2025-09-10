import { ReactNode } from "react"

type GroupBoxProps = {
    caption: string
    children: ReactNode
}
export default function GroupBox(props: GroupBoxProps) {
    return <div className="groupbox">
        <div className="groupbox-caption">{props.caption}</div>
        {props.children}
    </div>
}