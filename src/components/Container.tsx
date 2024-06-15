export type ContainerProps = {
    children: React.ReactNode[]
}
export default function Container({ children }: ContainerProps) {
    return <div className="container">
        <div className="row">
            {children.map(c => <div className="col-6">{c}</div>)}
        </div>
    </div>
}
