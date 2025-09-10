export type PropertyGridProps = {
    children: React.ReactNode
    style?: object
    hidden?: boolean
}
export default function PropertyGrid(props: PropertyGridProps){
    return !props.hidden && <div className="table-grid" style={{ ...props.style }}>{props.children}</div>
}