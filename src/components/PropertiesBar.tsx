import FasadState from "../classes/FasadState"
import ComboBox from "./inputs/ComboBox"
import { Division, FASAD_TYPE } from "../types/enums"
import { PropertyType } from "../types/property"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
import ToggleButton from "./inputs/ToggleButton"
import ImageButton from "./inputs/ImageButton"
import { useAtomValue, useSetAtom } from "jotai"
import { activeFasadAtom, divideFasadAtom, setActiveFasadAtom, setMaterialIdAtom, setFixedHeightAtom, setFixedWidthAtom, setHeightAtom, setFasadTypeAtom, setProfileDirectionAtom, setWidthAtom } from "../atoms/fasades"
import { userAtom } from "../atoms/users"
import { settingsAtom } from "../atoms/settings"
import { copyFasadDialogAtom, showSpecificationDialogAtom, showTemplatesDialogAtom } from "../atoms/dialogs"
import TextBox from "./inputs/TextBox"
import { useMemo } from "react"
import { RESOURCE } from "../types/user"
import { useNavigate } from "react-router-dom"
import { getFasadCutHeight, getFasadCutWidth, getTotalFasadHeightRatio, getTotalFasadWidthRatio } from "../functions/fasades"
import { fasadTypesAtom, fasadTypesToCharAtom } from "../atoms/storage"
import { charAtom } from "../atoms/materials/chars"
import { combiStateAtom } from "../atoms/app"
const sectionsTemplate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const directions: Map<Division, string> = new Map()
export default function PropertiesBar() {
    const { permissions } = useAtomValue(userAtom)
    const permSpec = permissions.get(RESOURCE.SPECIFICATION)
    const permTemp = permissions.get(RESOURCE.TEMPLATE)
    const fasad = useAtomValue(activeFasadAtom)
    const { rootFasades } = useAtomValue(combiStateAtom)
    const fasadParent = fasad?.parent
    const { minSize } = useAtomValue(settingsAtom)
    const fasadTypes = useAtomValue(fasadTypesAtom)
    const fasadTypeToChar = useAtomValue(fasadTypesToCharAtom)
    const chars = useAtomValue(charAtom)
    const { width, height, materialId, fasadType, direction, directions, sectionCount, fixHeight, fixWidth, disabledWidth, disabledHeight, disabledFixHeight, disabledFixWidth } = getProperties(fasad, rootFasades)
    const materials = useMemo(() => {
        const filtered=fasadTypeToChar.filter(ft => ft.id === fasadType)
        const sorted = (fasadType === FASAD_TYPE.DSP || fasadType === FASAD_TYPE.LACOBEL) ? filtered.toSorted((f1, f2) => (chars.get(f1.charId)?.name || "") > (chars.get(f2.charId)?.name || "") ? 1 : -1) : filtered;
        return sorted.map(ft => ft.charId)
    }, [fasadTypeToChar, fasadType])
    const sections = fasad ? sectionsTemplate : []
    const setHeight = useSetAtom(setHeightAtom)
    const setWidth = useSetAtom(setWidthAtom)
    const setFixedWidth = useSetAtom(setFixedWidthAtom)
    const setFixedHeight = useSetAtom(setFixedHeightAtom)
    const setFasadType = useSetAtom(setFasadTypeAtom)
    const setMaterialId = useSetAtom(setMaterialIdAtom)
    const setProfileDirection = useSetAtom(setProfileDirectionAtom)
    const divideFasad = useSetAtom(divideFasadAtom)
    const setActiveFasad = useSetAtom(setActiveFasadAtom)
    const copyFasadDialogRef =  useAtomValue(copyFasadDialogAtom)
    const showTemplateDialog = useSetAtom(showTemplatesDialogAtom)
    const showSpecificationDialog = useSetAtom(showSpecificationDialogAtom)
    const totalWidthRatio = getTotalFasadWidthRatio(fasadParent)
    const totalHeightRatio = getTotalFasadHeightRatio(fasadParent)
    return <div className="properties-bar" onClick={(e) => { e.stopPropagation() }}> 
        <div className="property-bar-header">
            Параметры фасада
            <div className="d-flex gap-1">
                {permSpec?.Read &&
                    <>
                        <ImageButton title="Cпецификация" icon="specButton" onClick={() => { showSpecificationDialog() }} />
                        {/* <ImageButton title="Cхема" icon="schemaButton" onClick={() => { navigate("/schema") }} /> */}
                    </>}
                {permTemp?.Create && <ImageButton title="Сохранить как шаблон" icon="save" visible={fasad !== null} onClick={() => { showTemplateDialog(true) }} />}
                {permTemp?.Read && <ImageButton title="Загрузить из шаблона" icon="open" visible={fasad !== null} onClick={() => { showTemplateDialog(false) }} />}
                {fasad && <ImageButton title="Скопировать фасад" icon="copy" onClick={() => { copyFasadDialogRef?.current?.showModal() }} />}
                <ImageButton title="Перейти на уровень вверх" icon="selectParent" onClick={() => { setActiveFasad(fasadParent) }} disabled={((fasad === null) || (fasad?.level === 0))} />
            </div>
        </div>
        <hr />
        <PropertyGrid>
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <TextBox value={height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={1} setValue={(value) => { setHeight(+value) }} disabled={disabledHeight} />
                {totalHeightRatio > 0 && !fixHeight &&
                    <span>{`${fasad?.heightRatio}/${totalHeightRatio}`}</span>
                }
                <ToggleButton pressed={fixHeight} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать высоту" visible={!disabledFixHeight} onClick={() => { setFixedHeight(!fixHeight) }} />
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <TextBox value={width} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={1} setValue={(value) => { setWidth(+value) }} disabled={disabledWidth} />
                {totalWidthRatio > 0 && !fixWidth &&
                    <span>{`${fasad?.widthRatio}/${totalWidthRatio}`}</span>
                }
                <ToggleButton pressed={fixWidth} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать ширину" visible={!disabledFixWidth} onClick={() => { setFixedWidth(!fixWidth) }} />
            </PropertyRow>
            <ComboBox<FASAD_TYPE> title="Тип:" value={fasadType} items={[...fasadTypes.keys()]} displayValue={value => fasadTypes.get(value)} disabled={!fasad} onChange={value => { setFasadType(value) }} />
            <ComboBox<number> title="Цвет/Рисунок:" value={materialId} items={materials} displayValue={value => chars.get(value)?.name} disabled={!fasad} onChange={value => { setMaterialId(value) }} />
            <ComboBox<Division> title="Направление профиля:" value={direction} items={[...directions.keys()]} displayValue={value => directions.get(value)} disabled={!fasad} onChange={value => { setProfileDirection(value) }} />
            <ComboBox<number> title="Кол-во секций:" value={sectionCount} items={sections} displayValue={value => `${value}`} disabled={!fasad} onChange={value => { divideFasad(value) }} />
        </PropertyGrid>
    </div>
}

function getProperties(fasad: FasadState | undefined, rootFasades: FasadState[]) {
    const width = getFasadCutWidth(fasad)
    const height = getFasadCutHeight(fasad)
    const materialId = fasad?.materialId || 0
    const fasadType = fasad?.fasadType || 0
    directions.clear()
    if (fasad) {
        directions.set(Division.WIDTH, "Вертикально")
        directions.set(Division.HEIGHT, "Горизонтально")
    }
    const direction = fasad?.division 
    const sectionCount = (fasad && (fasad.children.length > 1)) ? fasad.children.length : 1
    const fixWidth = fasad?.fixedWidth || false
    const fixHeight = fasad?.fixedHeight || false
    const parent = fasad?.parent
    let disabledWidth = !fasad || fasad.level === 0 || (fasad.level === 1 && parent?.division === Division.HEIGHT) || fasad.fixedWidth
    let disabledHeight = !fasad || fasad.level === 0|| (fasad.level === 1 && parent?.division === Division.WIDTH) || fasad.fixedHeight
    const disabledFixWidth = !fasad || fasad.level === 0 || (fasad.level === 1 && parent?.division === Division.HEIGHT)
    const disabledFixHeight = !fasad || fasad.level === 0 || (fasad.level === 1 && parent?.division === Division.WIDTH)
    disabledWidth = disabledWidth || !!(fasad && fasad.level <= 1 && parent?.division === Division.HEIGHT)
    disabledHeight = disabledHeight || !!(fasad && fasad.level <= 1 && parent?.division === Division.WIDTH)
    return { width, height, materialId, fasadType, direction, directions, sectionCount, fixHeight, fixWidth, disabledWidth, disabledHeight, disabledFixHeight, disabledFixWidth }
}