import { useEffect, useMemo, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { specificationAtom } from "../atoms/specification"
import { FASAD_TYPE, CHAR_PURPOSE } from "../types/enums"
import ImageButton from "./inputs/ImageButton"
import { saveToExcelAtom } from "../atoms/export"
import SpecificationTable from "./SpecificationTable"
import { SpecGroups } from "../functions/specification"
import { wardrobeDataAtom } from "../atoms/wardrobe"
import { WARDROBE_TYPE } from "../types/wardrobe"
import { getFasadCount } from "../functions/wardrobe"
import { CORPUS_SPECS } from "../types/specification"
import ImageButtonBar from "./inputs/Image'ButtonBar"

export default function WardrobeSpecification() {
    const saveToExcel = useSetAtom(saveToExcelAtom)
    const specifications = useAtomValue(specificationAtom)
    const wardData = useAtomValue(wardrobeDataAtom)
    const [specIndex, setSpecIndex] = useState(0)
    const specification = specifications[specIndex] || specifications[0]
    const captionsMap = new Map()
    const captions = specifications.map((spec => {
        const cap = SpecGroups.get(spec.type)
        if (!Object.keys(FASAD_TYPE).find(k => k === spec.type)) return cap
        if (captionsMap.has(cap)) captionsMap.set(cap, captionsMap.get(cap) + 1); else captionsMap.set(cap, 1)
        return `${cap}(${captionsMap.get(cap)})`
    }))
    const heads = useMemo(() => specifications.map((spec, index) => <div key={index} role="button" className={index === specIndex ? "tab-button-active" : "tab-button-inactive"} onClick={() => { setSpecIndex(index) }}>{`${captions[index]}`}</div>), [specifications, specIndex, captions])
    const purpose = Object.keys(FASAD_TYPE).find(k => k === specification.type) ? CHAR_PURPOSE.FASAD : CHAR_PURPOSE.CORPUS
    const hint = ((wardData.wardrobeTypeId !== WARDROBE_TYPE.GARDEROB) && (getFasadCount(wardData) < 2) && (specification.type === CORPUS_SPECS.CORPUS)) ? "Выберите необходимое кол-во фасадов" : ""
    useEffect(() => {
        if (specIndex >= specifications.length) setSpecIndex(0)
    }, [specifications, specIndex])
    return <div>
        <ImageButtonBar>
            <ImageButton icon="excel" caption="Сохранить в Excel" title="Сохранить в Excel" onClick={() => saveToExcel(specification.spec, captions[specIndex] as string)} />
        </ImageButtonBar>
        <div className="d-flex flex-row flex-wrap align-items-center gap-1">
            {heads}
        </div>
        <hr/>
        <SpecificationTable purposes={[purpose, CHAR_PURPOSE.BOTH]} specification={specification.spec} hint={hint} legendToRight={true} />
    </div>
}
