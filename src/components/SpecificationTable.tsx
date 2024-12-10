import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { CHAR_PURPOSE } from "../types/enums"
import { userAtom } from "../atoms/users"
import { OutputSpecSchema, specificationInProgress } from "../atoms/specification"
import { setVerboseDataAtom } from "../atoms/verbose"
import { showVerboseDialogAtom } from "../atoms/dialogs"
import { SpecificationResult, VerboseData } from "../types/wardrobe"
import { RESOURCE } from "../types/user"
import CheckBox from "./inputs/CheckBox"
import { unitsAtom } from "../atoms/storage"
import { charAtom } from "../atoms/materials/chars"
import { specListAtom } from "../atoms/specification"
import TableData, { TableDataHeader, TableDataRow } from "./inputs/TableData"


type SpecificationTableProps = {
    purposes: CHAR_PURPOSE[],
    specification: SpecificationResult[],
    hint?: string,
    legendToRight?: boolean
}
type ExtOutputSpecSchema = OutputSpecSchema & { specId: number, verbose: VerboseData }

export default function SpecificationTable(props: SpecificationTableProps) {
    const { permissions } = useAtomValue(userAtom)
    const unitsData = useAtomValue(unitsAtom)
    const loading = useAtomValue(specificationInProgress)
    const permSpec = permissions.get(RESOURCE.SPECIFICATION)
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
    }, [specData, charData, unitsData, props.specification])
    const [showAll, setShowAll] = useState(false)
    const [showCodes, setShowCodes] = useState(false)
    const header: TableDataHeader[] = [
        { caption: "Код", sorted: true },
        { caption: "Наименование", sorted: true, defaultSorted: true },
        { caption: "Характеристика" },
        { caption: "Кол-во", sorted: true },
        { caption: "Ед" }]
    const contents: TableDataRow[] = list.filter(i => props.purposes.some(_ => i.amount !== 0 || showAll)).toSorted((s1, s2) => s1.specName > s2.specName ? 1 : -1).map((item: ExtOutputSpecSchema, index: number) => {
        const amount = item.amount || 0
        const charCode = (item?.charCode && showCodes) ? `(${item.charCode})` : ""
        const char = `${item.charName} ${charCode}`
        const verbose = (item.verbose) ? { className: "table-data-cell-verbose", role: "button", onClick: () => { if (!permSpec?.Read) return; setVerboseData(item.verbose, item.specId); showVerbose() } } : {}
        return {
            key: index, data: [
                item.specCode,
                <span key={index} {...verbose}>{item.specName}</span>,
                char,
                Number(amount.toFixed(3)),
                item.units
            ]
        }
    })
    return <div className={`d-flex ${props.legendToRight ? "flex-row" : "flex-column"}`}>
        <div className="specification-table">
            <TableData header={header} content={contents} setRowStyle={row => row[3] !== 0 ? "tr-attention" : "tr-noattention"} />
            {loading && <div className="spinner-container" onClick={(e) => { e.stopPropagation() }}><div className="spinner"></div></div>}
        </div>
        <div className="p-3">
            {props.hint && <div className="fw-bold text-danger">{props.hint}</div>}
            <div>Нажмите на наименование номенклатуры, чтобы получить детальную информацию</div>
            <CheckBox checked={showAll} caption="Показать все позиции" onChange={() => { setShowAll(!showAll) }} />
            <CheckBox checked={showCodes} caption="Отображать код характеристики" onChange={() => { setShowCodes(!showCodes) }} />
        </div>
    </div>
}

