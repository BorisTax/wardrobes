import { useToolTip } from './useToolTip';

type ButtonProps = {
        caption: string
        onClick: () => void
        title?: string
        disabled?: boolean
        visible?: boolean
}

export default function Button({ caption, onClick, title = "", disabled = false, visible = true }: ButtonProps) {
        const { onMouseOver, onMouseLeave } = useToolTip(title);
        return <input
                type="button"
                style={{visibility:visible?"visible":"hidden"}}
                value = {caption}
                onMouseOver={(e) => { onMouseOver(e, { disabled }) }}
                onMouseLeave={() => { onMouseLeave() }}
                disabled={disabled} 
                onClick={() => { onClick() }} 
        />
}
