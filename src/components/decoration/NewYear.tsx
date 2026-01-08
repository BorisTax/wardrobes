import { useEffect } from "react"
import './girland.css'
import './snow.min.css'
import "./Snow"
export default function NewYear() {
    useEffect(() => {
        // @ts-ignore
        new Snow({ iconColor: "#AAAAFF"})
    }, [])
    return <ul className="lightrope">
        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li>
    </ul>
}