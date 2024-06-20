export type EditContainerProps = {
    children: React.ReactNode[]
}
export default function EditContainer({ children }: EditContainerProps) {
    const cols = [8, 4]
    return <div className="p-5">
        <div className="container">
            <div className="row">
                {children.map((c, index) => <div key={index} className={`col-${cols[index]}`}>{c}</div>)}
            </div>
        </div>
    </div>
        }
