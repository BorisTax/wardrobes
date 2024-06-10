import { useState } from "react"
import { useAtomValue } from "jotai"
import { priceListAtom } from "../atoms/prices"
import { PriceListItem } from "../types/server"
import { UnitCaptions } from "../functions/materials"
import { MAT_PURPOSE, SpecificationItem } from "../types/enums"
import { userAtom } from "../atoms/users"
import { isManagerAtLeast } from "../server/functions/user"

type SpecificationTableProps = {
    purposes: MAT_PURPOSE[],
    specification: Map<SpecificationItem, number>
}

export default function SpecificationTable(props: SpecificationTableProps) {
    const { role } = useAtomValue(userAtom)
    const priceList = useAtomValue(priceListAtom)
    const [showAll, setShowAll] = useState(false)
    const contents = priceList?.filter(i => props.purposes.some(p => i.purpose === p) && (props.specification.get(i.name as SpecificationItem) || showAll)).map((i: PriceListItem, index: number) => {
        const amount = props.specification.get(i.name as SpecificationItem) || 0
        const price = i.price || 0
        const className = (amount > 0) ? "tr-attention" : "tr-noattention"
        return <tr key={index} className={className}>
            <td className="pricelist-cell">{i.caption}</td>
            <td className="pricelist-cell">{amount.toFixed(3)}</td>
            <td className="pricelist-cell">{UnitCaptions.get(i.units || "")}</td>
            {isManagerAtLeast(role) ? <td className="pricelist-cell">{price.toFixed(2)}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="pricelist-cell">{(amount * price).toFixed(2)}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="pricelist-cell">{i.markup}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="pricelist-cell">{i.code || ""}</td> : <></>}
            {isManagerAtLeast(role) ? <td className="pricelist-cell">{i.id || ""}</td> : <></>}
        </tr >
    })
    return <div>
        <div className="pricelist">
            <table>
                <thead>
                    <tr>
                        <th className="priceheader">Наименование</th>
                        <th className="priceheader">Кол-во</th>
                        <th className="priceheader">Ед</th>
                        {isManagerAtLeast(role) ? <th className="priceheader">Цена за ед</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="priceheader">Цена</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="priceheader">Наценка</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="priceheader">Код</th> : <></>}
                        {isManagerAtLeast(role) ? <th className="priceheader">Идентификатор</th> : <></>}
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
