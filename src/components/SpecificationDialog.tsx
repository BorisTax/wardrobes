import { useEffect, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { specificationDialogAtom } from "../atoms/dialogs"
import { priceListAtom } from "../atoms/prices"
import { PriceListItem } from "../server/types/server"
import { UnitCaptions } from "../functions/materials"
import { specificationAtom } from "../atoms/specification"
import { SpecificationItem } from "../types/enums"
import ImageButton from "./ImageButton"
import { saveToExcelAtom } from "../atoms/export"
import { userAtom } from "../atoms/users"
import { isManagerAtLeast } from "../server/functions/user"
import DialogWindow from "./DialogWindow"

export default function SpecificationDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const { role } = useAtomValue(userAtom)
    const saveToExcel = useSetAtom(saveToExcelAtom)
    const [priceList] = useAtom(priceListAtom)
    const [specifications] = useAtom(specificationAtom)
    const [fasadIndex, setFasadIndex] = useState(0)
    const [showAll, setShowAll] = useState(false)
    const [, setSpecificationDialogRef] = useAtom(specificationDialogAtom)
    const specification = specifications[fasadIndex]
    const contents = priceList?.filter(i => specification.get(i.name as SpecificationItem) || showAll).map((i: PriceListItem, index: number) => {
        const amount = specification.get(i.name as SpecificationItem) || 0
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
    useEffect(() => {
        setSpecificationDialogRef(dialogRef)
    }, [setSpecificationDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} menuButtons={
        <ImageButton icon="excel" title="Сохранить в Excel" onClick={() => saveToExcel(fasadIndex)} />
    }>
        <div className="d-flex flex-row flex-nowrap justify-content-center align-items-center gap-1">
            <ImageButton title="Предыдущая спецификация" icon="prevFasad" visible={fasadIndex > 0} disabled={fasadIndex === 0} onClick={() => { setFasadIndex((prev) => prev - 1) }} />
            <div>Фасад{` ${fasadIndex + 1}`}</div>
            <ImageButton title="Следующая спецификация" icon="nextFasad" visible={fasadIndex < specifications.length - 1} disabled={fasadIndex === specifications.length - 1} onClick={() => { setFasadIndex((prev) => prev + 1) }} />
        </div>
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
    </DialogWindow>
}
