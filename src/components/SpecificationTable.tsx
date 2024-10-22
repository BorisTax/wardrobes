import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { MAT_PURPOSE } from "../types/enums"
import { userAtom } from "../atoms/users"
import { OutputSpecSchema, specificationInProgress } from "../atoms/specification"
import { setVerboseDataAtom } from "../atoms/verbose"
import { showVerboseDialogAtom } from "../atoms/dialogs"
import { SpecificationResult, TotalData, VerboseData } from "../types/wardrobe"
import { RESOURCE } from "../types/user"
import CheckBox from "./inputs/CheckBox"
import { unitsAtom } from "../atoms/storage"
import { charAtom } from "../atoms/materials/chars"
import { specListAtom } from "../atoms/specification"

type SpecificationTableProps = {
    purposes: MAT_PURPOSE[],
    specification: SpecificationResult[],
    hint?: string
}
type ExtOutputSpecSchema = OutputSpecSchema & { specId: number, verbose: VerboseData }

export default function SpecificationTable(props: SpecificationTableProps) {
    const { permissions } = useAtomValue(userAtom)
    const unitsData = useAtomValue(unitsAtom)
    const loading = useAtomValue(specificationInProgress)
    const permSpec =  permissions.get(RESOURCE.SPECIFICATION)
    const specData = useAtomValue(specListAtom)
    const charData = useAtomValue(charAtom)
    const showVerbose = useSetAtom(showVerboseDialogAtom)
    const setVerboseData = useSetAtom(setVerboseDataAtom)
    const list: ExtOutputSpecSchema[] = useMemo(() => {
        const specList: ExtOutputSpecSchema[] = []
        props.specification.forEach(sp => {
            const specCode = specData.get(sp[0])?.code || ""
            const specName = specData.get(sp[0])?.name || ""
            const charCode = charData.get(sp[1]?.data?.charId || 0)?.code || ""
            const charName = charData.get(sp[1]?.data?.charId || 0)?.name || ""
            const amount = sp[1].data.amount
            const units = unitsData.get(specData.get(sp[0])?.units || 0) || ""
            specList.push({ specId: sp[0], specCode, specName, charCode, charName, amount, units, verbose: sp[1].verbose as VerboseData })
        })
        return [...specList]
    }, [specData, props.specification]) 
    const [showAll, setShowAll] = useState(false)
    const [showCodes, setShowCodes] = useState(false)
    const contents = list.filter(i => props.purposes.some(p => i.amount !== 0 || showAll)).map((item: ExtOutputSpecSchema, index: number) => {
        const amount = item.amount || 0
        const charCode = (item?.charCode && showCodes) ? `(${item.charCode})` : ""
        const char = `${item.charName} ${charCode}`
        const className = (amount > 0) ? "tr-attention" : "tr-noattention"
        const verbose = (item.verbose) ? { className: "table-data-cell table-data-cell-hover", role: "button", onClick: () => { if (!permSpec?.Read) return; setVerboseData(item.verbose, item.specId); showVerbose() } } : {}
        return <tr key={index} className={"table-data-row " + className}>
            <td className="table-data-cell" >{index + 1}</td>
            <td className="table-data-cell" >{item.specCode}</td>
            <td className="table-data-cell" {...verbose}>{item.specName}</td>
            <td className="table-data-cell">{char}</td>
            <td className="table-data-cell">{Number(amount.toFixed(3))}</td>
            <td className="table-data-cell">{item.units}</td>
        </tr >
    })
    return <div className="specification-table">
        <div className="table-data">
            <table>
                <thead>
                    <tr>
                        <th className="table-header">№</th>
                        <th className="table-header">Код</th>
                        <th className="table-header">Наименование</th>
                        <th className="table-header">Характеристика</th>
                        <th className="table-header">Кол-во</th>
                        <th className="table-header">Ед</th>
                    </tr>
                </thead>
                <tbody>{contents}</tbody>
            </table>
        </div>
        <hr />
        {props.hint && <div className="fw-bold text-danger">{props.hint}</div>}
        <CheckBox checked={showAll} caption="Показать все позиции" onChange={() => { setShowAll(!showAll) }} />
        <CheckBox checked={showCodes} caption="Отображать код характеристики" onChange={() => { setShowCodes(!showCodes) }} />
        {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
    </div>
}

