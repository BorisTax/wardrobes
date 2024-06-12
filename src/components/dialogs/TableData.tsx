export type TableDataProps = {
    heads: string[]
    content: string[][]
    onSelectRow: (index: number) => void
}
export default function TableData(props: TableDataProps) {
    const contents = props.content.map((r, index) => <tr key={'row' + index} onClick={() => props.onSelectRow(index)}>
        {r.map((i, index) => <td key={'item' + index} className="table-data-cell">{i}</td>)}
    </tr>)
    return <div className="table-data">
            <table>
                <thead>
                    <tr>
                    {props.heads.map((h, index) => <th key={'head' + index} className="table-header">{h}</th>)}
                    </tr>
                </thead>
                <tbody>{contents}</tbody>
            </table>
        </div>
}
