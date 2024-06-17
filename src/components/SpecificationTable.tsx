import { useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { priceListAtom } from "../atoms/prices"
import { PriceData } from "../types/server"
import { UnitCaptions } from "../functions/materials"
import { MAT_PURPOSE } from "../types/enums"
import { userAtom } from "../atoms/users"
import { isManagerAtLeast } from "../server/functions/user"
import { specificationDataAtom } from "../atoms/specification"
import { setVerboseDataAtom } from "../atoms/verbose"
import { showVerboseDialogAtom } from "../atoms/dialogs"
import { SpecificationResult, TotalData, VerboseData } from "../types/wardrobe"
import { spec } from "node:test/reporters"

type SpecificationTableProps = {
    purposes: MAT_PURPOSE[],
    specification: SpecificationResult[]
}

export default function SpecificationTable(props: SpecificationTableProps) {
    const { role } = useAtomValue(userAtom)
    const specData = useAtomValue(specificationDataAtom)
    const priceList = useAtomValue(priceListAtom)
    const showVerbose = useSetAtom(showVerboseDialogAtom)
    const setVerboseData = useSetAtom(setVerboseDataAtom)
    const list: TotalData[] = useMemo(() => {
        const specList: TotalData[] = []
        specData.forEach(sd => {
            const spec = props.specification.filter(s => s[0] === sd.name)
            const priceItem = priceList.find(p => p.name === sd.name) as PriceData
            spec.forEach(sp => {
                specList.push({ ...sd, ...sp[1].data, ...priceItem, amount: sp[1].data.amount, char: sp[1].data.char, verbose: sp[1].verbose as VerboseData })
            })
        })
        return [...specList]
    }, [specData, priceList, props.specification]) 
    const [showAll, setShowAll] = useState(false)
    const contents = list.filter(i => props.purposes.some(p => i.purpose === p) && (i.amount !== 0 || showAll)).map((item: TotalData, index: number) => {
        const amount = item.amount || 0
        const char = item.char || { code: "", caption: "" }
        const price = item.price || 0
        const className = (amount > 0) ? "tr-attention" : "tr-noattention"
        const verbose = (item.verbose) ? { className: "table-data-cell table-data-cell-hover", role: "button", onClick: () => { setVerboseData(item.verbose, item.name); showVerbose() } } : {}
        return <tr key={index} className={className}>
            <td className="table-data-cell" {...verbose}>{item.caption}</td>
            <td className="table-data-cell">{Number(amount.toFixed(3))}</td>
            <td className="table-data-cell">{UnitCaptions.get(item.units || "")}</td>
            <td className="table-data-cell">{char.caption}</td>
            {isManagerAtLeast(role) ? <td className="table-data-cell">{price.toFixed(2)}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="table-data-cell">{(amount * price).toFixed(2)}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="table-data-cell">{item.markup}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="table-data-cell">{item.id || ""}</td> : <></>}
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
                        <th className="table-header">Характеристика</th>
                        {isManagerAtLeast(role) ? <th className="table-header">Цена за ед</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="table-header">Цена</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="table-header">Наценка</th> : <></>}
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
