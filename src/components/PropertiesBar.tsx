import Fasad from "../classes/Fasad"
import ComboBox from "./ComboBox"
import { DSP_PURPOSE, Division, FasadMaterial, SandBase } from "../types/enums"
import InputField from "./InputField"
import { PropertyType } from "../types/property"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
import ToggleButton from "./ToggleButton"
import { ExtMaterial } from "../server/types/materials"
import ImageButton from "./ImageButton"
import { useAtomValue, useSetAtom } from "jotai"
import { activeFasadAtom, activeRootFasadIndexAtom, divideFasadAtom, setActiveFasadAtom, setExtMaterialAtom, setFixedHeightAtom, setFixedWidthAtom, setHeightAtom, setMaterialAtom, setProfileDirectionAtom, setSandBaseAtom, setWidthAtom } from "../atoms/fasades"
import { materialListAtom } from "../atoms/materials"
import { Materials, SandBases } from "../functions/materials"
import { totalPriceAtom } from "../atoms/specification"
import { userAtom } from "../atoms/users"
import { isClientAtLeast, isEditorAtLeast } from "../server/functions/user"
import { getInitialBackImageProps } from "../classes/FasadState"
import { settingsAtom } from "../atoms/settings"
import { copyFasadDialogAtom, showTemplatesDialogAtom } from "../atoms/dialogs"
import { TEMPLATE_TABLES } from "../server/types/enums"
import { hasFasadImage } from "../functions/fasades"
const sectionsTemplate = ["1", "2", "3", "4", "5", "6", "7", "8"]
export default function PropertiesBar() {
    const { role } = useAtomValue(userAtom)
    const fasad = useAtomValue(activeFasadAtom)
    const rootFasadIndex = useAtomValue(activeRootFasadIndexAtom)
    const { minSize } = useAtomValue(settingsAtom)
    const { width, height, material, extmaterial, sandBase, materials, direction, directions, sectionCount, fixHeight, fixWidth, disabledWidth, disabledHeight, disabledFixHeight, disabledFixWidth } = getProperties(fasad)
    const sections = fasad ? sectionsTemplate : []
    const materialList = useAtomValue(materialListAtom).filter(m => m.purpose !== DSP_PURPOSE.CORPUS)
    const totalPrice = useAtomValue(totalPriceAtom)
    const setHeight = useSetAtom(setHeightAtom)
    const setWidth = useSetAtom(setWidthAtom)
    const setFixedWidth = useSetAtom(setFixedWidthAtom)
    const setFixedHeight = useSetAtom(setFixedHeightAtom)
    const setMaterial = useSetAtom(setMaterialAtom)
    const setExtMaterial = useSetAtom(setExtMaterialAtom)
    const setSandBase = useSetAtom(setSandBaseAtom)
    const setProfileDirection = useSetAtom(setProfileDirectionAtom)
    const divideFasad = useSetAtom(divideFasadAtom)
    const setActiveFasad = useSetAtom(setActiveFasadAtom)
    const copyFasadDialogRef =  useAtomValue(copyFasadDialogAtom)
    const showTemplateDialog = useSetAtom(showTemplatesDialogAtom)
    const extMaterials: ExtMaterial[] = materialList.filter(mat => mat.material === material) || [{ name: "", material: "" }]
    const fasadValue = fasad && totalPrice[rootFasadIndex].toFixed(2)
    const fasadPrice = isClientAtLeast(role) ? <div className="d-flex justify-content-end text-primary" style={{ visibility: fasad ? "visible" : "hidden" }}>Стоимость фасада:{` ${fasadValue}`}</div> : <></>
    const onlyFasad = !!fasad && fasad.Children.length === 0
    const stretchImage = fasad?.BackImageProps.size === "100% 100%"
    return <div className="properties-bar" onClick={(e) => { e.stopPropagation() }}> 
        <div className="property-bar-header">
            Параметры фасада
            <div className="d-flex gap-1">
                {isEditorAtLeast(role) && <ImageButton title="Сохранить как шаблон" icon="save" visible={fasad !== null} onClick={() => { showTemplateDialog(TEMPLATE_TABLES.FASAD, true) }} />}
                {isClientAtLeast(role) && <ImageButton title="Загрузить из шаблона" icon="open" visible={fasad !== null} onClick={() => { showTemplateDialog(TEMPLATE_TABLES.FASAD, false) }} />}
                {fasad && <ImageButton title="Скопировать фасад" icon="copy" onClick={() => { copyFasadDialogRef?.current?.showModal() }} />}
                {onlyFasad && hasFasadImage(fasad) && <ToggleButton
                    title={stretchImage ? "Сбросить масштабирование" : "Подогнать изображение под размер"}
                    iconPressed="resetImage" iconUnPressed="stretchImage" pressed={stretchImage}
                    onClick={() => {
                        if (!fasad) return
                        if (stretchImage) fasad.BackImageProps = getInitialBackImageProps(); else fasad.BackImageProps = { ...getInitialBackImageProps(), size: "100% 100%" }
                        setActiveFasad(fasad)
                    }} />}
                {((fasad !== null) && (fasad.Parent !== null)) && <ImageButton title="Выбрать секцию" icon="selectParent" onClick={() => { setActiveFasad(fasad ? fasad.Parent : null) }} />}
            </div>
        </div>
        <hr />
        <PropertyGrid>
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <InputField value={height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={minSize} setValue={(value) => { setHeight(+value) }} disabled={disabledHeight} />
                <ToggleButton pressed={fixHeight} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать высоту" visible={!disabledFixHeight} onClick={() => { setFixedHeight(!fixHeight) }} />
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <InputField value={width} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={minSize} setValue={(value) => { setWidth(+value) }} disabled={disabledWidth} />
                <ToggleButton pressed={fixWidth} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать ширину" visible={!disabledFixWidth} onClick={() => { setFixedWidth(!fixWidth) }} />
            </PropertyRow>
            <ComboBox title="Материал:" value={material} items={materials} disabled={!fasad} onChange={(_, value: string) => { setMaterial(value as FasadMaterial) }} />
            <ComboBox title="Цвет/Рисунок:" value={extmaterial} items={extMaterials.map((m: ExtMaterial) => m.name)} disabled={!fasad} onChange={(_, value) => { setExtMaterial(value) }} />
            <ComboBox title="Основа:" value={sandBase || ""} items={sandBase ? SandBases : []} disabled={fasad?.Material !== FasadMaterial.SAND} onChange={(_, value) => { setSandBase(value as SandBase) }} />
            <ComboBox title="Направление профиля:" value={direction} items={directions} disabled={!fasad} onChange={(_, value) => { setProfileDirection(value) }} />
            <ComboBox title="Кол-во секций:" value={sectionCount} items={sections} disabled={!fasad} onChange={(_, value) => { divideFasad(+value) }} />
        </PropertyGrid>
        {fasadPrice}
    </div>
}

function getProperties(fasad: Fasad | null) {
    const width = fasad?.cutWidth || ""
    const height = fasad?.cutHeight || ""
    const material = fasad?.Material || ""
    const extmaterial = fasad?.ExtMaterial || ""
    const sandBase = (fasad?.Material === FasadMaterial.SAND && fasad?.SandBase) || ""
    const materials = fasad ? Materials : []
    const directions: Map<string, string> = new Map()
    if (fasad) {
        directions.set("Вертикально", Division.WIDTH)
        directions.set("Горизонтально", Division.HEIGHT)
    }
    const direction = fasad ? (fasad.Division === Division.HEIGHT ? "Горизонтально" : "Вертикально") : ""
    const sectionCount = (fasad && (fasad.Children.length > 1)) ? `${fasad.Children.length}` : ""
    const fixWidth = fasad?.FixedWidth() || false
    const fixHeight = fasad?.FixedHeight() || false
    let disabledWidth = !fasad || !fasad.Parent || fasad.FixedWidth()
    let disabledHeight = !fasad || !fasad.Parent || fasad.FixedHeight()
    const disabledFixWidth = !fasad || !fasad.Parent || (fasad.Level === 1 && fasad.Parent.Division === Division.HEIGHT)
    const disabledFixHeight = !fasad || !fasad.Parent || (fasad.Level === 1 && fasad.Parent.Division === Division.WIDTH)
    disabledWidth = disabledWidth || !!(fasad?.Parent && fasad.Level <= 1 && fasad.Parent.Division === Division.HEIGHT)
    disabledHeight = disabledHeight || !!(fasad?.Parent && fasad.Level <= 1 && fasad.Parent.Division === Division.WIDTH)
    return { width, height, material, extmaterial, sandBase, materials, direction, directions, sectionCount, fixHeight, fixWidth, disabledWidth, disabledHeight, disabledFixHeight, disabledFixWidth }
}