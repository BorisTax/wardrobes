import Fasad from "../classes/Fasad"
import ComboBox from "./inputs/ComboBox"
import { MAT_PURPOSE, Division, FASAD_TYPE } from "../types/enums"
import { PropertyType } from "../types/property"
import PropertyGrid from "./PropertyGrid"
import PropertyRow from "./PropertyRow"
import ToggleButton from "./inputs/ToggleButton"
import { FasadMaterial } from "../types/materials"
import ImageButton from "./inputs/ImageButton"
import { useAtomValue, useSetAtom } from "jotai"
import { activeFasadAtom, divideFasadAtom, setActiveFasadAtom, setMaterialIdAtom, setFixedHeightAtom, setFixedWidthAtom, setHeightAtom, setFasadTypeAtom, setProfileDirectionAtom, setWidthAtom } from "../atoms/fasades"
import { materialTypesAtom } from "../atoms/storage"
import { materialListAtom } from "../atoms/materials/chars"
import { userAtom } from "../atoms/users"
import { settingsAtom } from "../atoms/settings"
import { copyFasadDialogAtom, showSpecificationDialogAtom, showTemplatesDialogAtom } from "../atoms/dialogs"
import TextBox from "./inputs/TextBox"
import { useMemo } from "react"
import { RESOURCE } from "../types/user"
import { useNavigate } from "react-router-dom"
import { getTotalFasadHeightRatio, getTotalFasadWidthRatio } from "../functions/fasades"
import { useMaterialMap } from "../custom-hooks/useMaterialMap"
const sectionsTemplate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const directions: Map<Division, string> = new Map()
export default function PropertiesBar() {
    const navigate = useNavigate()
    const { permissions } = useAtomValue(userAtom)
    const permSpec = permissions.get(RESOURCE.SPECIFICATION)
    const permTemp = permissions.get(RESOURCE.TEMPLATE)
    const fasad = useAtomValue(activeFasadAtom)
    const { minSize } = useAtomValue(settingsAtom)
    const matTypes = useAtomValue(materialTypesAtom)
    const { width, height, materialId, fasadType, direction, directions, sectionCount, fixHeight, fixWidth, disabledWidth, disabledHeight, disabledFixHeight, disabledFixWidth } = getProperties(fasad)
    const sections = fasad ? sectionsTemplate : []
    const matList = useAtomValue(materialListAtom)
    const materialList = useMemo(() => {
        const mList = matList.filter(m => m.type === fasadType && m.purpose !== MAT_PURPOSE.CORPUS)
        return (fasadType !== FASAD_TYPE.DSP) ? mList : mList.toSorted((m1, m2) => m1.name > m2.name ? 1 : -1)
    }, [matList, fasadType])
    const matMap = useMaterialMap(materialList)
    const material = matMap.get(materialId)
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
    const totalWidthRatio = getTotalFasadWidthRatio(fasad)
    const totalHeightRatio = getTotalFasadHeightRatio(fasad)
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
                <ImageButton title="Перейти на уровень вверх" icon="selectParent" onClick={() => { setActiveFasad(fasad ? fasad.Parent : null) }} disabled={((fasad === null) || (fasad.Parent === null))} />
            </div>
        </div>
        <hr />
        <PropertyGrid>
            <div className="text-end">Высота: </div>
            <PropertyRow>
                <TextBox value={height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={1} setValue={(value) => { setHeight(+value) }} disabled={disabledHeight} />
                {totalHeightRatio > 0 && !fixHeight &&
                    <span>{`${fasad?.HeightRatio}/${totalHeightRatio}`}</span>
                }
                <ToggleButton pressed={fixHeight} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать высоту" visible={!disabledFixHeight} onClick={() => { setFixedHeight(!fixHeight) }} />
            </PropertyRow>
            <div className="text-end">Ширина: </div>
            <PropertyRow>
                <TextBox value={width} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={1} setValue={(value) => { setWidth(+value) }} disabled={disabledWidth} />
                {totalWidthRatio > 0 && !fixWidth &&
                    <span>{`${fasad?.WidthRatio}/${totalWidthRatio}`}</span>
                }
                <ToggleButton pressed={fixWidth} iconPressed="fix" iconUnPressed="unfix" title="Зафиксировать ширину" visible={!disabledFixWidth} onClick={() => { setFixedWidth(!fixWidth) }} />
            </PropertyRow>
            <ComboBox<FASAD_TYPE> title="Тип:" value={fasadType} items={[...matTypes.keys()]} displayValue={value => matTypes.get(value)} disabled={!fasad} onChange={(_, value) => { setFasadType(value) }} />
            <ComboBox<FasadMaterial> title="Цвет/Рисунок:" value={material} items={materialList} displayValue={value=>value?.name} disabled={!fasad} onChange={(_, value) => { setMaterialId(value.id) }} />
            <ComboBox<Division> title="Направление профиля:" value={direction} items={[...directions.keys()]} displayValue={value => directions.get(value)} disabled={!fasad} onChange={(_, value) => { setProfileDirection(value) }} />
            <ComboBox<number> title="Кол-во секций:" value={sectionCount} items={sections} displayValue={value => `${value}`} disabled={!fasad} onChange={(_, value) => { divideFasad(value) }} />
        </PropertyGrid>
    </div>
}

function getProperties(fasad: Fasad | null) {
    const width = fasad?.cutWidth || 0
    const height = fasad?.cutHeight || 0
    const materialId = fasad?.MaterialId || -1
    const fasadType = fasad?.FasadType
    directions.clear()
    if (fasad) {
        directions.set(Division.WIDTH, "Вертикально")
        directions.set(Division.HEIGHT, "Горизонтально")
    }
    const direction = fasad?.Division 
    const sectionCount = (fasad && (fasad.Children.length > 1)) ? fasad.Children.length : 1
    const fixWidth = fasad?.FixedWidth() || false
    const fixHeight = fasad?.FixedHeight() || false
    let disabledWidth = !fasad || !fasad.Parent || fasad.FixedWidth()
    let disabledHeight = !fasad || !fasad.Parent || fasad.FixedHeight()
    const disabledFixWidth = !fasad || !fasad.Parent || (fasad.Level === 1 && fasad.Parent.Division === Division.HEIGHT)
    const disabledFixHeight = !fasad || !fasad.Parent || (fasad.Level === 1 && fasad.Parent.Division === Division.WIDTH)
    disabledWidth = disabledWidth || !!(fasad?.Parent && fasad.Level <= 1 && fasad.Parent.Division === Division.HEIGHT)
    disabledHeight = disabledHeight || !!(fasad?.Parent && fasad.Level <= 1 && fasad.Parent.Division === Division.WIDTH)
    return { width, height, materialId, fasadType, direction, directions, sectionCount, fixHeight, fixWidth, disabledWidth, disabledHeight, disabledFixHeight, disabledFixWidth }
}