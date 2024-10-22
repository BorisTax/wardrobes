import { ReactNode, useState } from "react"

export type TableDataRow = {
    key: number | string,
    data: ReactNode[]
}

export type TableDataProps = {
    heads: (string | number)[]
    content: TableDataRow[]
    styles?: object[][]
    rowNumbers?: boolean
    onSelectRow?: (index: number) => void
    onSelectKey?: (key: number | string) => void
}
export default function TableData({ heads, content, styles = [[{}]], rowNumbers = true, onSelectRow = () => { }, onSelectKey = () => { } }: TableDataProps) {
    const [selectedRow, setSelectedRow] = useState(-1)
    const defStyles = content.map((i, r) => i.data.map((i, c) => { if (styles[r]) return styles[r][c]; else return {} }))
    const contents = content.map((r, rowIndex) => 
        <tr className={"table-data-row " + (rowIndex === selectedRow ? "table-data-row-selected" : "")}
            key={'row' + rowIndex}
            onClick={() => {
                if (onSelectRow) { onSelectRow(rowIndex); }
                if (onSelectKey) { onSelectKey(r.key) }
                setSelectedRow(rowIndex)
            }}>
            {rowNumbers && <td className="table-data-cell">{rowIndex + 1}</td>}
            {r.data.map((i, colIndex) => <td key={'item' + colIndex} className="table-data-cell" style={{ ...defStyles[rowIndex][colIndex] }}>{i}</td>)}
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
