import { useState } from 'react';
import { useToolTip } from '../custom-hooks/useToolTip';
import { Link } from 'react-router-dom';

type ImageLinkProps = {
        icon: string
        link: string
        caption?: string
        title?: string
        disabled?: boolean
        visible?: boolean
        classes?: string
}

export default function ImageLink({ title, caption, icon, link, disabled = false, visible = true, classes = "" }: ImageLinkProps) {
        const [pressed, setPressed] = useState(false)
        let className = disabled ? "button-disabled" : "button"
        className += pressed ? " button-down" : " button-up";
        className += " " + classes
        const { onMouseOver, onMouseLeave } = useToolTip(title);
        return <Link
                to={link}
                style={{ visibility: visible ? "visible" : "hidden" }}
        >
                <div className='data-navbar-button'>
                        <div className={`${className} ${icon} noselect`}
                                onMouseDown={() => { setPressed(true) }}
                                onMouseUp={() => { setPressed(false) }}
                                onMouseOver={(e) => { onMouseOver(e, { disabled }) }}
                                onMouseLeave={() => { setPressed(false); onMouseLeave() }}
                                onContextMenu={(e) => { e.preventDefault(); }}>
                        </div>
                        <div className='data-navbar-button-title'>{caption}</div>
                </div>
        </Link>
}
