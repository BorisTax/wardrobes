import { isLandscape } from "../functions/functions"

export default function MenuSeparator() {
        const landscape = isLandscape()
        return landscape ? <div style={{ height: "100%", width: "1px", boxSizing: "border-box", border: "inset" }}></div> : <hr />
}
