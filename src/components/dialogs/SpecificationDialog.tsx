import { useEffect, useMemo, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { specificationDialogAtom } from "../../atoms/dialogs"
import { specificationCombiAtom } from "../../atoms/specification"
import { MAT_PURPOSE } from "../../types/enums"
import ImageButton from "../inputs/ImageButton"
import { saveToExcelAtom } from "../../atoms/export"
import DialogWindow from "./DialogWindow"
import SpecificationTable from "../SpecificationTable"

export default function SpecificationDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const saveToExcel = useSetAtom(saveToExcelAtom)
    const specifications = useAtomValue(specificationCombiAtom)
    const [fasadIndex, setFasadIndex] = useState(0)
    const [, setSpecificationDialogRef] = useAtom(specificationDialogAtom)
    const specification = specifications[fasadIndex]
    const active = "fw-bold"
    const fasades = useMemo(() => specifications.map((_, index) => <div key={index} role="button" className={index === fasadIndex ? active : ""} onClick={() => { setFasadIndex(index) }}>{`Фасад ${index + 1}`}</div>), [specifications, fasadIndex])
    useEffect(() => {
        setSpecificationDialogRef(dialogRef)
    }, [setSpecificationDialogRef, dialogRef])
    return <DialogWindow dialogRef={dialogRef} menuButtons={
        <ImageButton icon="excel" title="Сохранить в Excel" caption="Сохранить в Excel" onClick={() => saveToExcel(specification, `Фасад (${fasadIndex + 1} из ${specifications.length})`)} />
    }>
        <div className="d-flex flex-row flex-nowrap justify-content-center align-items-center gap-1">
            {fasades}
        </div>
        <SpecificationTable purposes={[MAT_PURPOSE.FASAD, MAT_PURPOSE.BOTH]} specification={specification} />
    </DialogWindow>
}
