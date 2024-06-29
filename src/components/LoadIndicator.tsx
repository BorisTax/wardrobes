export default function LoadIndicator() {
    return <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>
}