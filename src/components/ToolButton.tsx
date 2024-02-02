import React, { useState } from 'react';
import { useToolTip } from '../custom-hooks/useToolTip';

type ToolButtonProps = {
        title: string
        onClick: ()=>void
        disabled: boolean
        icon: string
}

export default function ToolButton(props: ToolButtonProps) {
        const [pressed, setPressed] = useState(false)
        let className = props.disabled ? "button-disabled" : "button"
        className += pressed ? " button-down" : " button-up";
        const { onMouseOver, onMouseLeave } = useToolTip(props.title);
        return <div
                className={`${className} ${props.icon} noselect`}
                onClick={(e) => { if (!props.disabled) { e.stopPropagation(); props.onClick() } }}
                onMouseDown={() => { setPressed(true) }}
                onMouseUp={() => { setPressed(false) }}
                onMouseOver={(e) => { onMouseOver(e) }}
                onMouseLeave={() => { setPressed(false); onMouseLeave() }}
                onContextMenu={(e) => { e.preventDefault(); }}
        >
        </div>
}
