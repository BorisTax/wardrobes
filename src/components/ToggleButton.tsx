import React from 'react';
import { useToolTip } from '../custom-hooks/useToolTip';

type ToggleButtonProps = {
        title: string
        onClick: () => void
        disabled: boolean
        iconPressed: string
        iconUnPressed: string
        pressed: boolean
}

export default function ToggleButton(props: ToggleButtonProps) {
        let className = props.disabled ? "button-disabled" : "button"
        className += props.pressed ? " button-down" : " button-up";
        const { onMouseOver, onMouseLeave } = useToolTip(props.title);
        return <div
                className={`${className} ${props.pressed ? props.iconPressed : props.iconUnPressed} noselect`}
                onClick={(e) => { if (!props.disabled) { e.stopPropagation(); props.onClick() } }}
                onMouseOver={(e) => { onMouseOver(e) }}
                onMouseLeave={() => { onMouseLeave() }}
                onContextMenu={(e) => { e.preventDefault(); }}
        >
        </div>
}
