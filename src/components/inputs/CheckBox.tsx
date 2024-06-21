import { useId } from "react"

type CheckBoxProps = {
    checked: boolean
    disabled?: boolean
    onChange: () => void
    id?: string
}
export default function CheckBox({ checked, disabled = false, onChange, id }: CheckBoxProps) {
    const newId = useId()
    const props = {
        type: "checkbox",
        checked,
        disabled,
        onChange,
        id: id || newId
    }
    return <input {...props} />
}

