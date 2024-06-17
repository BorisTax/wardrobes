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
    const captionsMap = new Map()
    const captions = specifications.map((spec => {
        const cap = SpecGroups.get(spec.type)
        if (!Object.keys(FasadMaterial).find(k => k === spec.type)) return cap
        if (captionsMap.has(cap)) captionsMap.set(cap, captionsMap.get(cap) + 1); else captionsMap.set(cap, 1)
        return `${cap}(${captionsMap.get(cap)})`
    }))
    const heads = useMemo(() => specifications.map((spec, index) => <div key={index} role="button" className={index === specIndex ? "tab-button-active" : "tab-button-inactive"} onClick={() => { setSpecIndex(index) }}>{`${captions[index]}`}</div>), [specifications, specIndex])
    //const spec = useMemo(() => getSpecification(specification.spec), [specification])
    const purpose = Object.keys(FasadMaterial).find(k => k === specification.type) ? MAT_PURPOSE.FASAD : MAT_PURPOSE.CORPUS
    useEffect(() => {
        if (specIndex >= specifications.length) setSpecIndex(0)
    }, [specifications])
    return <div>
        <ImageButton icon="excel" title="Сохранить в Excel" onClick={() => saveToExcel(specification.spec, captions[specIndex] as string)} />
        <div className="d-flex flex-row flex-wrap justify-content-center align-items-center gap-1">
            {heads}
        </div>
        <hr/>
        <SpecificationTable purposes={[purpose, MAT_PURPOSE.BOTH]} specification={specification.spec} />
    </div>
}
