export type EditContainerProps = {
    children: React.ReactNode[]
}
export default function EditContainer({ children }: EditContainerProps) {
    return <div className="edit-container">
        {children.map((c, index) => <div key={index} >{c}</div>)}
    </div>
}
