import { ReactNode } from "react"

export type TableDataProps = {
    heads: (string | number)[]
    content: (string | number | boolean | ReactNode)[][]
    styles?: object[][]
    rowNumbers?: boolean
    onSelectRow?: (index: number) => void
}
export default function TableData({ heads, content, styles = [[{}]], rowNumbers = true, onSelectRow = () => { } }: TableDataProps) {
    const defStyles = content.map((i, r) => i.map((i, c) => { if (styles[r]) return styles[r][c]; else return {} }))
    const contents = content.map((r, rowIndex) => <tr className="table-data-row" key={'row' + rowIndex} onClick={() => { if (onSelectRow) onSelectRow(rowIndex) }}>
        {rowNumbers && <td className="table-data-cell">{rowIndex + 1}</td>}
        {r.map((i, colIndex) => <td key={'item' + colIndex} className="table-data-cell" style={{ ...defStyles[rowIndex][colIndex] }}>{i}</td>)}
    </tr>)
    return <div className="table-data">
        <table>
            <thead>
                <tr>
                    {rowNumbers && <th className="table-header">№</th>}
                    {heads.map((h, index) => <th key={'head' + index} className="table-header">{h}</th>)}
                </tr>
            </thead>
            <tbody>{contents}</tbody>
        </table>
    </div>
}
