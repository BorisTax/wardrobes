import React from 'react';
import { useToolTip } from '../custom-hooks/useToolTip';

type ToggleButtonProps = {
        title: string
        onClick: () => void
        iconPressed: string
        iconUnPressed: string
        pressed: boolean
        disabled?: boolean
        visible?: boolean
}

export default function ToggleButton({ title, onClick, iconPressed, iconUnPressed, pressed, disabled = false, visible = true }: ToggleButtonProps) {
        let className = disabled ? "button-disabled" : "button"
        className += pressed ? " button-down" : " button-up";
        const { onMouseOver, onMouseLeave } = useToolTip(title);
        return <div
                style={{ visibility: visible ? "visible" : "hidden" }}
                className={`${className} ${pressed ? iconPressed : iconUnPressed} noselect`}
                onClick={(e) => { if (!disabled) { e.stopPropagation(); onClick() } }}
                onMouseOver={(e) => { onMouseOver(e, { disabled }) }}
                onMouseLeave={() => { onMouseLeave() }}
                onContextMenu={(e) => { e.preventDefault(); }}
        >
        </div>
}
