import { useToolTip } from '../custom-hooks/useToolTip';

type ButtonProps = {
        caption: string
        onClick: () => void
        title?: string
        disabled?: boolean
        visible?: boolean
}

export default function Button({ caption, onClick, title = "", disabled = false, visible = true }: ButtonProps) {
        const { onMouseOver, onMouseLeave } = useToolTip(title);
        return <input type="button"
                style={{ visibility: visible ? "visible" : "hidden" }}
                disabled={disabled}
                value={caption}
                onClick={() => { onClick() }}
                onMouseOver={(e) => { onMouseOver(e) }}
                onMouseLeave={() => { onMouseLeave() }}
                onContextMenu={(e) => { e.preventDefault(); }}
        >
        </input>
}
