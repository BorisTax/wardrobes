import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useSetAtom } from "jotai"
import { specificationDialogAtom } from "../atoms/dialogs"
import { loadPriceListAtom, priceListAtom } from "../atoms/prices"
import { PriceListItem } from "../types/server"
import { UnitCaptions } from "../functions/materials"
import { calculateSpecificationsAtom, specificationAtom } from "../atoms/specification"
import { SpecificationItem } from "../types/enums"
import ImageButton from "./ImageButton"


export default function SpecificationDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const loadPriceList = useSetAtom(loadPriceListAtom)
    const calcSpecification = useSetAtom(calculateSpecificationsAtom)
    const [priceList] = useAtom(priceListAtom)
    useMemo(() => { calcSpecification() }, [priceList])
    const [specifications] = useAtom(specificationAtom)
    const [fasadIndex, setFasadIndex] = useState(0)
    const closeDialog = () => { dialogRef.current?.close() }
    const [, setSpecificationDialogRef] = useAtom(specificationDialogAtom)
    const specification = specifications[fasadIndex]
    const contents = priceList?.map((i: PriceListItem, index: number) => {
        const amount = specification.get(i.name as SpecificationItem) || 0
        const price = i.price || 0
        const className = amount > 0 ? "tr-attention" : "tr-noattention"
        return <tr key={index} className={className}>
            <td className="pricelist-cell">{i.caption}</td>
            <td className="pricelist-cell">{amount.toFixed(3)}</td>
            <td className="pricelist-cell">{UnitCaptions.get(i.units || "")}</td>
            <td className="pricelist-cell">{price.toFixed(2)}</td>
            <td className="pricelist-cell">{(amount * price).toFixed(2)}</td>
            <td className="pricelist-cell">{i.markup}</td>
            <td className="pricelist-cell">{i.code || ""}</td>
            <td className="pricelist-cell">{i.id || ""}</td>
        </tr >
    })
    useEffect(() => {
        setSpecificationDialogRef(dialogRef)
    }, [setSpecificationDialogRef, dialogRef])
    return <dialog ref={dialogRef}>
        <div className="d-flex flex-row flex-nowrap justify-content-center align-items-center gap-1">
            <ImageButton title="Предыдущая спецификация" icon="prevFasad" visible={fasadIndex > 0} disabled={fasadIndex === 0} onClick={() => { setFasadIndex((prev) => prev - 1) }} />
            <div>Фасад{` ${fasadIndex + 1}`}</div>
            <ImageButton title="Следующая спецификация" icon="nextFasad" visible={fasadIndex < specifications.length - 1} disabled={fasadIndex === specifications.length - 1} onClick={() => { setFasadIndex((prev) => prev + 1) }} />
        </div>
        <div className="pricelist">
            <table>
                <thead>
                    <th className="priceheader">Наименование</th>
                    <th className="priceheader">Кол-во</th>
                    <th className="priceheader">Ед</th>
                    <th className="priceheader">Цена за ед</th>
                    <th className="priceheader">Цена</th>
                    <th className="priceheader">Наценка</th>
                    <th className="priceheader">Код</th>
                    <th className="priceheader">Идентификатор</th>
                </thead>
                <tbody>{contents}</tbody>
            </table>
        </div>
        <hr />
        <div className="d-flex flex-column gap-1 align-items-start">
            <input type="button" value="Закрыть" onClick={() => closeDialog()} />
        </div>
    </dialog>
}
