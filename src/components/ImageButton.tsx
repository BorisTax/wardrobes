import { useState } from 'react';
import { useToolTip } from '../custom-hooks/useToolTip';

type ImageButtonProps = {
        title: string
        onClick: ()=>void
        disabled?: boolean
        icon: string
        classes?: string 
}

export default function ImageButton(props: ImageButtonProps) {
        const [pressed, setPressed] = useState(false)
        let className = props.disabled ? "button-disabled" : "button"
        className += pressed ? " button-down" : " button-up";
        if(props.classes) className += " " + props.classes
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
