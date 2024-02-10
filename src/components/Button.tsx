import { useToolTip } from '../custom-hooks/useToolTip';

type ButtonProps = {
        caption: string
        title?: string
        onClick: () => void
        disabled?: boolean
}

export default function Button(props: ButtonProps) {
        const { onMouseOver, onMouseLeave } = useToolTip(props.title);
        return <input type="button"
                disabled={props.disabled}
                value={props.caption}
                onClick={() => { props.onClick() }}
                onMouseOver={(e) => { onMouseOver(e) }}
                onMouseLeave={() => { onMouseLeave() }}
                onContextMenu={(e) => { e.preventDefault(); }}
        >
        </input>
}
