import { useToolTip } from '../custom-hooks/useToolTip';
import ImageButton from './inputs/ImageButton';

type ButtonProps = {
        caption: string
        onClick: () => void
        icon: string
        title?: string
        disabled?: boolean
        visible?: boolean
}

export default function ImageTextButton({ caption, icon, onClick, title = "", disabled = false, visible = true }: ButtonProps) {
        const { onMouseOver, onMouseLeave } = useToolTip(title);
        return <div
                className='image-text-button'
                onMouseOver={(e) => { onMouseOver(e, { disabled }) }}
                onMouseLeave={() => { onMouseLeave() }}
        >
                <ImageButton icon={icon} disabled={disabled} visible={visible} onClick={() => { onClick() }} />
                <div>{caption}</div>
        </div >
}
