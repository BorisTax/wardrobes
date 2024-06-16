import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { priceListAtom } from "../atoms/prices"
import { PriceData, SpecificationData } from "../types/server"
import { UnitCaptions } from "../functions/materials"
import { MAT_PURPOSE } from "../types/enums"
import { SpecificationItem } from "../types/specification"
import { userAtom } from "../atoms/users"
import { isManagerAtLeast } from "../server/functions/user"
import { specificationDataAtom } from "../atoms/specification"
import VerboseDataDialog from "./dialogs/VerboseDataDialog"
import { getRoute } from "../atoms/verbose"
import { wardrobeDataAtom } from "../atoms/wardrobe"
import { showVerboseDialogAtom } from "../atoms/dialogs"
import { verbose } from "sqlite3"
import { SpecificationResultItem } from "../types/wardrobe"

type SpecificationTableProps = {
    purposes: MAT_PURPOSE[],
    specification: Map<SpecificationItem, SpecificationResultItem>
}
type TotalData = PriceData & SpecificationData
export default function SpecificationTable(props: SpecificationTableProps) {
    const { role } = useAtomValue(userAtom)
    const specList = useAtomValue(specificationDataAtom)
    const priceList = useAtomValue(priceListAtom)
    const wardrobeData = useAtomValue(wardrobeDataAtom)
    const showVerbose = useSetAtom(showVerboseDialogAtom)
    const list: TotalData[] = useMemo(() => specList.map(s => ({ ...s, ...priceList.find(p => p.name === s.name) })), [specList, priceList])
    const [showAll, setShowAll] = useState(false)
    const contents = list?.filter(i => props.purposes.some(p => i.purpose === p) && (props.specification.get(i.name as SpecificationItem)?.amount || showAll)).map((i: TotalData, index: number) => {
        const amount = props.specification.get(i.name as SpecificationItem)?.amount || 0
        const price = i.price || 0
        const className = (amount > 0) ? "tr-attention" : "tr-noattention"
        const verbose = getRoute(i.name) ? {className:"table-data-cell table-data-cell-hover", role: "button", onClick: () => { showVerbose(wardrobeData, i.name) } } : {}
        return <tr key={index} className={className}>
            <td className="table-data-cell" {...verbose}>{i.caption}</td>
            <td className="table-data-cell">{Number(amount.toFixed(3))}</td>
            <td className="table-data-cell">{UnitCaptions.get(i.units || "")}</td>
            {isManagerAtLeast(role) ? <td className="table-data-cell">{price.toFixed(2)}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="table-data-cell">{(amount * price).toFixed(2)}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="table-data-cell">{i.markup}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="table-data-cell">{i.code || ""}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="table-data-cell">{i.id || ""}</td> : <></>}
        </tr >
    })
    return <div>
        <div className="table-data">
            <table>
                <thead>
                    <tr>
                        <th className="table-header">Наименование</th>
                        <th className="table-header">Кол-во</th>
                        <th className="table-header">Ед</th>
                        {isManagerAtLeast(role) ? <th className="table-header">Цена за ед</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="table-header">Цена</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="table-header">Наценка</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="table-header">Код</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="table-header">Идентификатор</th> : <></>}
                    </tr>
                </thead>
                <tbody>{contents}</tbody>
            </table>
        </div>
        <hr />
        <div className="d-flex justify-content-start gap-2">
            <input id="showAll" type="checkbox" checked={showAll} onChange={() => { setShowAll(!showAll) }} />
            <label htmlFor="showAll" >Показать все позиции</label>
        </div>

    </div>
}
