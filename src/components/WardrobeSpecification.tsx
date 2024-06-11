import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { specificationAtom } from "../atoms/specification"
import { FasadMaterial, MAT_PURPOSE } from "../types/enums"
import ImageButton from "./ImageButton"
import { saveToExcelAtom } from "../atoms/export"
import SpecificationTable from "./SpecificationTable"
import { SpecGroups, getSpecification } from "../functions/specification"

export default function WardrobeSpecification() {
    const saveToExcel = useSetAtom(saveToExcelAtom)
    const specifications = useAtomValue(specificationAtom)
    const [specIndex, setSpecIndex] = useState(0)
    const specification = specifications[specIndex] || specifications[0]
    const active = "fw-bold"
    const heads = useMemo(() => specifications.map((spec, index) => <div key={index} role="button" className={index === specIndex ? active : ""} onClick={() => { setSpecIndex(index) }}>{`${SpecGroups.get(spec.type)}`}</div>), [specifications, specIndex])
    const spec = useMemo(() => getSpecification(specification.spec), [specification])
    const purpose = Object.keys(FasadMaterial).find(k => k === specification.type) ? MAT_PURPOSE.FASAD : MAT_PURPOSE.CORPUS
    useEffect(()=>{
        setSpecIndex(0)
    }, [specifications])
    return <div>
        <ImageButton icon="excel" title="Сохранить в Excel" onClick={() => saveToExcel(specIndex)} />
        <div className="d-flex flex-row flex-nowrap justify-content-center align-items-center gap-1">
            {heads}
        </div>
        <SpecificationTable purposes={[purpose, MAT_PURPOSE.BOTH]} specification={spec} />
    </div>
}
