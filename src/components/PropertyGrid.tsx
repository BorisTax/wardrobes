export type PropertyGridProps = {
    children: React.ReactNode
    style?: object
}
export default function PropertyGrid(props: PropertyGridProps){
    return <div className="table-grid" style={{...props.style}}>{props.children}</div>
}