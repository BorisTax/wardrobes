import { useState } from 'react';
import { useToolTip } from '../custom-hooks/useToolTip';

type ImageButtonProps = {
        onClick: () => void
        icon: string
        title?: string
        caption?: string
        disabled?: boolean
        visible?: boolean
        classes?: string
}

export default function ImageButton({ title, caption, onClick, icon, disabled = false, visible = true, classes = "" }: ImageButtonProps) {
        const [pressed, setPressed] = useState(false)
        let className = disabled ? "button-disabled" : "button"
        className += pressed ? " button-down" : " button-up";
        className += " " + classes
        const { onMouseOver, onMouseLeave } = useToolTip(title);
        return <div className='image-button'
                role="button"
                style={{ visibility: visible ? "visible" : "hidden" }}
                onClick={(e) => { if (!disabled) { e.stopPropagation(); onClick() } }}
                onMouseDown={() => { setPressed(true) }}
                onMouseUp={() => { setPressed(false) }}
                onMouseOver={(e) => { onMouseOver(e, { disabled }) }}
                onMouseLeave={() => { setPressed(false); onMouseLeave() }}
                onContextMenu={(e) => { e.preventDefault(); }}
        >
                <div className={`${className} ${icon} noselect`}>
                </div>
                {caption && <div>{caption}</div>}
        </div>
}
