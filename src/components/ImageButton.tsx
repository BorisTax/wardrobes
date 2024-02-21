import { useState } from 'react';
import { useToolTip } from '../custom-hooks/useToolTip';

type ImageButtonProps = {
        onClick: () => void
        icon: string
        title?: string
        disabled?: boolean
        visible?: boolean
        classes?: string
}

export default function ImageButton({ title, onClick, icon, disabled = false, visible = true, classes = "" }: ImageButtonProps) {
        const [pressed, setPressed] = useState(false)
        let className = disabled ? "button-disabled" : "button"
        className += pressed ? " button-down" : " button-up";
        className += " " + classes
        const { onMouseOver, onMouseLeave } = useToolTip(title);
        return <div
                style={{ visibility: visible ? "visible" : "hidden" }}
                className={`${className} ${icon} noselect`}
                onClick={(e) => { if (!disabled) { e.stopPropagation(); onClick() } }}
                onMouseDown={() => { setPressed(true) }}
                onMouseUp={() => { setPressed(false) }}
                onMouseOver={(e) => { onMouseOver(e, { disabled }) }}
                onMouseLeave={() => { setPressed(false); onMouseLeave() }}
                onContextMenu={(e) => { e.preventDefault(); }}
        >
        </div>
}
