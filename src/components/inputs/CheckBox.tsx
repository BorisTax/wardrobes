import { useId } from "react"

type CheckBoxProps = {
    checked: boolean
    disabled?: boolean
    onChange: () => void
    id?: string
    caption?: string
}
export default function CheckBox({ checked, disabled = false, onChange, caption = "", id }: CheckBoxProps) {
    const props = {
        type: "checkbox",
        checked,
        disabled,
        onChange,
        id: id || useId()
    }
    return <div className="d-flex flex-nowrap gap-1"><input {...props} /><span>{caption}</span></div>
}

