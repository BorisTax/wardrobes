import { ReactNode, useEffect, useState } from "react"
import "./tables.scss";

export type TableDataHeader = {
    caption: ReactNode
    sorted?: boolean,
    defaultSorted?: boolean,
}
export type TableDataRow = {
    key: number | string,
    data: ReactNode[],
    styles?: object[]
}

export type TableDataProps = {
    header: TableDataHeader[]
    content: TableDataRow[]
    styles?: object
    rowNumbers?: boolean
    onSelectRow?: (key: number | string) => void
    setRowStyle?:(row: ReactNode[]) => string
}
function initSorted(header: TableDataHeader[]) {
    const def = header.findIndex(h => h.defaultSorted)
    if (def >= 0) return def
    const sort = header.findIndex(h => h.sorted)
    return sort
}
export default function TableData({ header, content, styles = {}, rowNumbers = true, onSelectRow = () => { }, setRowStyle = () => "" }: TableDataProps) {
    const [selectedRow, setSelectedRow] = useState(-1)
    const [sortedColumn, setSortedColumn] = useState(initSorted(header))
    const [desc, setDesc] = useState(true)
    const sorted = sortedColumn >= 0 ? content.toSorted((r1, r2) => r1.data[sortedColumn] !== null && r1.data[sortedColumn] !== undefined && r2.data[sortedColumn] !== null && r2.data[sortedColumn] !== undefined && r1.data[sortedColumn] < r2.data[sortedColumn] ? desc ? -1 : 1 : desc ? 1 : -1) : content 
    const contents = sorted.map((r, rowIndex) => {
        const className = setRowStyle(r.data)
        return <tr className={className + " table-data-row " + (rowIndex === selectedRow ? "table-data-row-selected" : "")}
            key={'row' + rowIndex}
            onClick={() => {
                if (onSelectRow) { onSelectRow(r.key) }
            }}>
            {rowNumbers && <td className="table-data-cell">{rowIndex + 1}</td>}
            {r.data.map((i, colIndex) => <td key={'item' + colIndex} className="table-data-cell" style={r.styles ? r.styles[colIndex] : {}}>{i}</td>)}
        </tr>})
    // useEffect(() => {
    //     setSortedColumn(header.findIndex(h => h.sorted))
    // }, [header])
    return <div className="table-data" style={{ ...styles }}>
        <table>
            <thead>
                <tr>
                    {rowNumbers && <th className="table-header">№</th>}
                    {header.map((h, index) => <th key={'head' + index} className="table-header">
                        <div role={h.sorted ? "button" : ""} className="d-flex flex-nowrap justify-content-center align-items-center gap-1"  onClick={() => { if (!h.sorted) return; if (index !== sortedColumn) setSortedColumn(index); setDesc(!desc) }}>
                            {h.sorted && (index === sortedColumn) && <span className={desc ? "sortDesc" : "sortAsc"}></span>}
                            <span >
                                {h.caption}
                            </span>
                        </div>
                        </th>)}
                </tr>
            </thead>
            <tbody>{contents}</tbody>
        </table>
    </div>
}
