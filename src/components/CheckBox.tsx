type CheckBoxProps = {
    checked: boolean
    disabled?: boolean
    onChange: () => void
}
export default function CheckBox({ checked, disabled = false, onChange }: CheckBoxProps) {
    const props = {
        type: "checkbox",
        checked,
        disabled,
        onChange
    }
    return (
        <input {...props} />
    );
}

