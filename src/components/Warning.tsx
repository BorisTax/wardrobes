type WarningProps = {
    text: string
}
export default function Warning(props: WarningProps){
    return <div className="warning">{props.text}</div>
}