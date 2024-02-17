import { isLandscape } from "../functions/functions"

export default function MenuSeparator() {
        const landscape = isLandscape()
        return <div className={landscape ? "vertical-separator" : "horizontal-separator"}></div>
}
