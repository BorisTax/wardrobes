import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { specificationCombiAtom } from "../atoms/specification"
import { CHAR_PURPOSE } from "../types/enums"
import ImageButton from "./inputs/ImageButton"
import { saveToExcelAtom } from "../atoms/export"
import SpecificationTable from "./SpecificationTable"
import { activeRootFasadIndexAtom, setActiveRootFasadAtom } from "../atoms/fasades"

export default function CombiSpecification() {
    const saveToExcel = useSetAtom(saveToExcelAtom)
    const specifications = useAtomValue(specificationCombiAtom)
    const activeRootFasadIndex = useAtomValue(activeRootFasadIndexAtom)
    const setActiveRootFasad = useSetAtom(setActiveRootFasadAtom)
    const [fasadIndex, setFasadIndex] = useState(0)
    const specification = specifications[fasadIndex] || []
    const active = "fw-bold"
    const fasades = useMemo(() => specifications.map((_, index) => <div key={index} role="button" className={index === fasadIndex ? active : ""} onClick={() => { setActiveRootFasad(index) }}>{`Фасад ${index + 1}`}</div>), [specifications, fasadIndex])
    useEffect(() => {
        setFasadIndex(activeRootFasadIndex)
    }, [activeRootFasadIndex])
    return <div className="">
        <ImageButton icon="excel" title="Сохранить в Excel" caption="Сохранить в Excel" onClick={() => saveToExcel(specification, `Фасад (${fasadIndex + 1} из ${specifications.length})`)} />
        <div className="d-flex flex-row flex-nowrap justify-content-center align-items-center gap-1">
            {fasades}
        </div>
        <SpecificationTable purposes={[CHAR_PURPOSE.FASAD, CHAR_PURPOSE.BOTH]} specification={specification} />
    </div>
}
