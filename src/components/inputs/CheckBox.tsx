import { useId } from "react"

type CheckBoxProps = {
    checked: boolean
    disabled?: boolean
    onChange: () => void
    id?: string
    caption?: string
    styles?: object
}
export default function CheckBox({ checked, disabled = false, onChange, caption = "", id, styles = {} }: CheckBoxProps) {
    const usedId = useId()
    const props = {
        type: "checkbox",
        checked,
        disabled,
        onChange,
        id: id || usedId
    }
    return <div className="d-flex flex-nowrap gap-1" style={{ ...styles }}><input {...props} /><span onClick={() => { onChange() }}>{caption}</span></div>
}

