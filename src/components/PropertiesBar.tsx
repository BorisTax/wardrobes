import FasadState from "../classes/FasadState"
import ComboBox from "./inputs/ComboBox"
import { Division, FASAD_TYPE } from "../types/enums"
import { PropertyType } from "../types/property"
import PropertyGrid from "./inputs/PropertyGrid"
import PropertyRow from "./inputs/PropertyRow"
import ToggleButton from "./inputs/ToggleButton"
import ImageButton from "./inputs/ImageButton"
import { useAtomValue, useSetAtom } from "jotai"
import { activeFasadAtom, divideFasadAtom, setActiveFasadAtom, setMaterialIdAtom, setFixedHeightAtom, setFixedWidthAtom, setHeightAtom, setFasadTypeAtom, setProfileDirectionAtom, setWidthAtom, resetRootFasadAtom } from "../atoms/fasades"
import { userAtom } from "../atoms/users"
import { showTemplatesDialogAtom } from "../atoms/dialogs"
import TextBox from "./inputs/TextBox"
import { useMemo } from "react"
import { RESOURCE } from "../types/user"
import { getFasadMaterialId, getFasadType, getTotalFasadHeightRatio, getTotalFasadWidthRatio } from "../functions/fasades"
import { fasadTypesAtom } from "../atoms/storage"
import { fasadTypesToCharAtom } from "../atoms/materials/chars"
import { charAtom } from "../atoms/materials/chars"
import useConfirm from "../custom-hooks/useConfirm"
import ImageButtonBar from "./inputs/Image'ButtonBar"
import Selector from "./inputs/Selector"
const sectionsTemplate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const directions: Map<Division, string> = new Map()
export default function PropertiesBar() {
    const { permissions } = useAtomValue(userAtom)
    const permTemp = permissions.get(RESOURCE.TEMPLATE)
    const fasad = useAtomValue(activeFasadAtom).at(-1)
    const fasadParent = fasad?.parent
    const fasadTypes = useAtomValue(fasadTypesAtom)
    const fasadTypeToChar = useAtomValue(fasadTypesToCharAtom)
    const chars = useAtomValue(charAtom)
    const { width, height, materialId, fasadType, direction, directions, sectionCount, fixHeight, fixWidth, disabledWidth, disabledHeight, disabledFixHeight, disabledFixWidth } = getProperties(fasad)
    const materials = useMemo(() => {
        const filtered=fasadTypeToChar.filter(ft => ft.id === fasadType)
        const sorted = (fasadType === FASAD_TYPE.DSP || fasadType === FASAD_TYPE.LACOBEL) ? filtered.toSorted((f1, f2) => (chars.get(f1.charId)?.name || "") > (chars.get(f2.charId)?.name || "") ? 1 : -1) : filtered;
        return sorted.map(ft => ft.charId)
    }, [fasadTypeToChar, fasadType, chars])
    const sections = fasad ? sectionsTemplate : []
    const resetRootFasad = useSetAtom(resetRootFasadAtom)
    const setHeight = useSetAtom(setHeightAtom)
    const setWidth = useSetAtom(setWidthAtom)
    const setFixedWidth = useSetAtom(setFixedWidthAtom)
    const setFixedHeight = useSetAtom(setFixedHeightAtom)
    const setFasadType = useSetAtom(setFasadTypeAtom)
    const setMaterialId = useSetAtom(setMaterialIdAtom)
    const setProfileDirection = useSetAtom(setProfileDirectionAtom)
    const divideFasad = useSetAtom(divideFasadAtom)
    const setActiveFasad = useSetAtom(setActiveFasadAtom)
    const showTemplateDialog = useSetAtom(showTemplatesDialogAtom)
    const totalWidthRatio = getTotalFasadWidthRatio(fasadParent)
    const totalHeightRatio = getTotalFasadHeightRatio(fasadParent)
    const confirm = useConfirm()
    return <div className="properties-bar" onClick={(e) => { e.stopPropagation() }}> 
        <div className="property-bar-header">
            Параметры фасада
            <ImageButtonBar justifyContent="flex-end">
                <ImageButton title="Сбросить деление фасада" icon="new" disabled={(fasad?.level === 0) && !fasad.children.length} onClick={async () => { if (await confirm("Сбросить деление фасада?")) resetRootFasad() }} />
                {permTemp?.Read && <ImageButton title="Загрузить из шаблона" icon="open" visible={fasad !== null} onClick={() => { showTemplateDialog(false) }} />}
                {permTemp?.Create && <ImageButton title="Сохранить как шаблон" icon="save" visible={fasad !== null} onClick={() => { showTemplateDialog(true) }} />}
                {/* {fasad && <ImageButton title="Скопировать фасад" icon="copy" onClick={() => { copyFasadDialogRef?.current?.showModal() }} />} */}
                <ImageButton title="Перейти на уровень вверх" icon="selectParent" onClick={() => { setActiveFasad(fasadParent) }} disabled={((fasad === null) || (fasad?.level === 0))} />
            </ImageButtonBar>
        </div>
        <hr />
        <PropertyGrid>
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <TextBox value={height} type={PropertyType.POSITIVE_NUMBER} min={1} setValue={(value) => { setHeight(+value) }} disabled={disabledHeight} width="100px"/>
                <ToggleButton pressed={fixHeight} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать высоту" visible={!disabledFixHeight} onClick={() => { setFixedHeight(!fixHeight) }} />
                {totalHeightRatio > 0 && !fixHeight &&
                    <span>{`${fasad?.heightRatio}/${totalHeightRatio}`}</span>
                }
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <TextBox value={width} type={PropertyType.POSITIVE_NUMBER} min={1} setValue={(value) => { setWidth(+value) }} disabled={disabledWidth}  width="100px"/>
                <ToggleButton pressed={fixWidth} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать ширину" visible={!disabledFixWidth} onClick={() => { setFixedWidth(!fixWidth) }} />
                {totalWidthRatio > 0 && !fixWidth &&
                    <span>{`${fasad?.widthRatio}/${totalWidthRatio}`}</span>
                }
            </PropertyRow>
            <ComboBox<FASAD_TYPE> title="Тип:" value={fasadType} altValue={fasadType === FASAD_TYPE.COMBI ? "КОМБИ" : undefined} items={[...fasadTypes.keys()]} displayValue={value => fasadTypes.get(value)} disabled={!fasad} onChange={value => { setFasadType(value) }} disableTyping={true} />
            <ComboBox<number> title="Цвет/Рисунок:" value={materialId} altValue={materialId === 0 ? "комби" : undefined} items={materials} displayValue={value => chars.get(value)?.name} disabled={!fasad} onChange={value => { setMaterialId(value) }}  disableTyping={true} styles={{minWidth: "250px"}}/>
            <Selector<Division> title="Направление профиля:" value={direction} items={[...directions.keys()]} displayValue={value => directions.get(value)} disabled={!fasad} onChange={value => { setProfileDirection(value) }} />
            <Selector<number> title="Кол-во секций:" value={sectionCount} items={sections} displayValue={value => `${value}`} disabled={!fasad} onChange={value => { divideFasad(value) }} columns={5}/>
        </PropertyGrid>
    </div>
}

function getProperties(fasad: FasadState | undefined) {
    const width = fasad?.width || 0//getFasadCutWidth(fasad)
    const height = fasad?.height || 0//getFasadCutHeight(fasad)
    const materialId = fasad? getFasadMaterialId(fasad) : 0
    const fasadType = fasad ? getFasadType(fasad) : 0//fasad?.fasadType || 0
    directions.clear()
    if (fasad) {
        directions.set(Division.WIDTH, "Верт.")
        directions.set(Division.HEIGHT, "Гориз.")
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