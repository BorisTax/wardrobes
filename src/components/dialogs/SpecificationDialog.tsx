import { useEffect, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { specificationDialogAtom } from "../../atoms/dialogs"
import { priceListAtom } from "../../atoms/prices"
import { PriceListItem } from "../../types/server"
import { UnitCaptions } from "../../functions/materials"
import { specificationCombiAtom } from "../../atoms/specification"
import { MAT_PURPOSE, SpecificationItem } from "../../types/enums"
import ImageButton from "../ImageButton"
import { saveToExcelAtom } from "../../atoms/export"
import { userAtom } from "../../atoms/users"
import { isManagerAtLeast } from "../../server/functions/user"
import DialogWindow from "./DialogWindow"
import SpecificationTable from "../SpecificationTable"

export default function SpecificationDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const { role } = useAtomValue(userAtom)
    const saveToExcel = useSetAtom(saveToExcelAtom)
    const [priceList] = useAtom(priceListAtom)
    const [specifications] = useAtom(specificationCombiAtom)
    const [fasadIndex, setFasadIndex] = useState(0)
    const [showAll, setShowAll] = useState(false)
    const [, setSpecificationDialogRef] = useAtom(specificationDialogAtom)
    const specification = specifications[fasadIndex]
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
        <SpecificationTable purposes={[MAT_PURPOSE.FASAD, MAT_PURPOSE.BOTH]} specification={specification}/>
    </DialogWindow>
}
