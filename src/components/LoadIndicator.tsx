export default function LoadIndicator() {
    return <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="loader"></div></div>
}