import { useEffect, useMemo } from "react"
import ComboBox from "./ComboBox"
import PropertyGrid from "./PropertyGrid"
import { CONSOLE_TYPE, WARDROBE_TYPE } from "../types/wardrobe"
import { PropertyType } from "../types/property"
import { materialListAtom } from "../atoms/materials/materials"
import { useAtomValue, useSetAtom } from "jotai"
import { FasadMaterial, MAT_PURPOSE } from "../types/enums"
import { profileListAtom } from "../atoms/materials/profiles"
import TextBox from "./TextBox"
import { ConsoleTypes, WardKinds, WardTypes } from "../functions/wardrobe"
import { WARDROBE_KIND } from "../types/wardrobe"
import { calculateSpecificationsAtom } from "../atoms/specification"
import WardrobeSpecification from "./WardrobeSpecification"
import { initFasades, loadedInitialWardrobeDataAtom, setWardrobeDataAtom, wardrobeDataAtom } from "../atoms/wardrobe"

const numbers = [0, 1, 2, 3, 4, 5, 6]
const styles = { fontStyle: "italic", color: "gray" }

export default function WardrobeCalculator() {
    const data = useAtomValue(wardrobeDataAtom)
    const setData = useSetAtom(setWardrobeDataAtom)
    const calculate = useSetAtom(calculateSpecificationsAtom)
    const materialList = useAtomValue(materialListAtom)
    const loadedInitialWardrobeData = useAtomValue(loadedInitialWardrobeDataAtom)
    const dspList = useMemo(() => materialList.filter(m => m.purpose !== MAT_PURPOSE.FASAD).map(m => m.name), [materialList])
    const dsp10List = useMemo(() => materialList.filter(m => m.material === FasadMaterial.DSP && m.purpose !== MAT_PURPOSE.CORPUS).map(m => m.name), [materialList])
    const mirrorList = useMemo(() => materialList.filter(m => m.material === FasadMaterial.MIRROR).map(m => m.name), [materialList])
    const fmpList = useMemo(() => materialList.filter(m => m.material === FasadMaterial.FMP).map(m => m.name), [materialList])
    const sandList = useMemo(() => materialList.filter(m => m.material === FasadMaterial.SAND).map(m => m.name), [materialList])
    const lacobelList = useMemo(() => materialList.filter(m => m.material === FasadMaterial.LACOBEL).map(m => m.name), [materialList])
    const lacobelGlassList = useMemo(() => materialList.filter(m => m.material === FasadMaterial.LACOBELGLASS).map(m => m.name), [materialList])
    const profileList = useAtomValue(profileListAtom)
    const profileNames = useMemo(() => profileList.map(p => p.name), [profileList])
    const { wardKind, wardType, width, depth, height, dspName, fasades, profileName, extComplect } = data
    const totalFasades = Object.values(fasades).reduce((a, f) => f.count + a, 0)
    const maxFasades = 6
    useEffect(() => {
        if (loadedInitialWardrobeData) calculate(data)
    }, [data, loadedInitialWardrobeData])
    return <div className="container">
        <div className="row">
            <div className="container col-xs-12 col-sm-12 col-md-6 col-lg-4">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 wardrobe-param-container">
                        <div className="text-center">Основные параметры</div>
                        <PropertyGrid style={{ padding: "0.5em", border: "1px solid" }}>
                            <ComboBox title="Серия шкафа:" value={wardKind as string} items={WardKinds} onChange={(_, value) => { setData(prev => ({ ...prev, wardKind: value as WARDROBE_KIND })) }} />
                            <ComboBox title="Тип шкафа:" value={wardType as string} items={WardTypes} onChange={(_, value) => { setData(prev => ({ ...prev, wardType: value as WARDROBE_TYPE })) }} />
                            <div className="text-end">Ширина: </div>
                            <TextBox value={width} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={900} max={3000} setValue={(value) => { setData(prev => ({ ...prev, width: +value })) }} />
                            <div className="text-end">Глубина: </div>
                            <TextBox value={depth} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={400} max={700} setValue={(value) => { setData(prev => ({ ...prev, depth: +value })) }} />
                            <div className="text-end">Высота: </div>
                            <TextBox value={height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={1900} max={2750} setValue={(value) => { setData(prev => ({ ...prev, height: +value })) }} />
                            <ComboBox title="Цвет ДСП:" value={dspName} items={dspList} onChange={(_, value: string) => { setData(prev => ({ ...prev, dspName: value })) }} />
                            <ComboBox title="Цвет профиля:" value={profileName} items={profileNames} onChange={(_, value: string) => { setData(prev => ({ ...prev, profileName: value })) }} />
                        </PropertyGrid>
                        {wardType !== WARDROBE_TYPE.CORPUS && <PropertyGrid style={{ padding: "0.5em", border: "1px solid" }}>
                            <div className="text-end">Фасадов всего: </div>
                            <div className="d-flex align-items-center justify-content-between"><div>{totalFasades}</div><div className="small-button" role="button" onClick={() => { setData(prev => ({ ...prev, fasades: initFasades })) }}>Сбросить</div></div>
                            <ComboBox title="ДСП:" value={`${fasades.dsp.count}`} items={numbers} onChange={(_, value: string) => { if (+value + totalFasades - fasades.dsp.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, dsp: { count: +value, names: new Array(+value).fill("") } } })) }} />
                            {fasades.dsp.count > 0 && fasades.dsp.names.map((m, i) => <ComboBox styles={styles} key={"dsp" + i} title={`${i + 1}`} items={dsp10List} value={fasades.dsp.names[i]} onChange={(_, value) => { fasades.dsp.names[i] = value; setData(prev => ({ ...prev })) }} />)}
                            <ComboBox title="Зеркало:" value={`${fasades.mirror.count}`} items={numbers} onChange={(_, value: string) => { if (+value + totalFasades - fasades.mirror.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, mirror: { count: +value, names: new Array(+value).fill("") } } })) }} />
                            {fasades.mirror.count > 0 && fasades.mirror.names.map((m, i) => <ComboBox styles={styles} key={"mirror" + i} title={`${i + 1}`} items={mirrorList} value={fasades.mirror.names[i]} onChange={(_, value) => { fasades.mirror.names[i] = value; setData(prev => ({ ...prev })) }} />)}
                            <ComboBox title="ФМП:" value={`${fasades.fmp.count}`} items={numbers} onChange={(_, value: string) => { if (+value + totalFasades - fasades.fmp.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, fmp: { count: +value, names: new Array(+value).fill("") } } })) }} />
                            {fasades.fmp.count > 0 && fasades.fmp.names.map((m, i) => <ComboBox styles={styles} key={"fmp" + i} title={`${i + 1}`} items={fmpList} value={fasades.fmp.names[i]} onChange={(_, value) => { fasades.fmp.names[i] = value; setData(prev => ({ ...prev, })) }} />)}
                            <ComboBox title="Пескоструй:" value={`${fasades.sand.count}`} items={numbers} onChange={(_, value: string) => { if (+value + totalFasades - fasades.sand.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, sand: { count: +value, names: new Array(+value).fill("") } } })) }} />
                            {fasades.sand.count > 0 && fasades.sand.names.map((m, i) => <ComboBox styles={styles} key={"sand" + i} title={`${i + 1}`} items={sandList} value={fasades.sand.names[i]} onChange={(_, value) => { fasades.sand.names[i] = value; setData(prev => ({ ...prev, })) }} />)}
                            <ComboBox title="Лакобель:" value={`${fasades.lacobel.count}`} items={numbers} onChange={(_, value: string) => { if (+value + totalFasades - fasades.lacobel.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, lacobel: { count: +value, names: new Array(+value).fill("") } } })) }} />
                            {fasades.lacobel.count > 0 && fasades.lacobel.names.map((m, i) => <ComboBox styles={styles} key={"lacobel" + i} title={`${i + 1}`} items={lacobelList} value={fasades.lacobel.names[i]} onChange={(_, value) => { fasades.lacobel.names[i] = value; setData(prev => ({ ...prev, })) }} />)}
                            <ComboBox title="Лакобель (стекло):" value={`${fasades.lacobelGlass.count}`} items={numbers} onChange={(_, value: string) => { if (+value + totalFasades - fasades.lacobelGlass.count <= maxFasades) setData(prev => ({ ...prev, fasades: { ...fasades, lacobelGlass: { count: +value, names: new Array(+value).fill("") } } })) }} />
                            {fasades.lacobelGlass.count > 0 && fasades.lacobelGlass.names.map((m, i) => <ComboBox styles={styles} key={"lacobelGlass" + i} title={`${i + 1}`} items={lacobelGlassList} value={fasades.lacobelGlass.names[i]} onChange={(_, value) => { fasades.lacobelGlass.names[i] = value; setData(prev => ({ ...prev, })) }} />)}
                        </PropertyGrid>}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 wardrobe-param-container">
                        <div className="text-center">Доп. комплектация</div>
                        <PropertyGrid style={{ padding: "0.5em", border: "1px solid" }}>
                            <div className="text-end">Телескоп: </div>
                            <TextBox value={extComplect.telescope} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, telescope: +value } })) }} />
                            <hr /><hr />
                            <div className="text-end">Консоли кол-во: </div>
                            <TextBox value={extComplect.console.count} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={2} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, count: +value } } })) }} />
                            <div className="text-end">Высота консоли: </div>
                            <TextBox value={extComplect.console.height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={3000} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, height: +value } } })) }} />
                            <div className="text-end">Глубина консоли: </div>
                            <TextBox value={extComplect.console.depth} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={800} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, depth: +value } } })) }} />
                            <div className="text-end">Ширина консоли: </div>
                            <TextBox value={extComplect.console.width} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={300} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, width: +value } } })) }} />
                            <ComboBox title="Тип консоли:" value={extComplect.console.type || ""} items={ConsoleTypes} onChange={(_, value: string) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, console: { ...prev.extComplect.console, type: value as CONSOLE_TYPE } } })) }} />
                            <hr /><hr />
                            <div className="text-end">Козырек: </div>
                            <TextBox value={extComplect.blinder} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={1} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, blinder: +value } })) }} />
                            <div className="text-end">Полка доп (полочн): </div>
                            <TextBox value={extComplect.shelf} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, shelf: +value } })) }} />
                            <div className="text-end">Полка доп (плат): </div>
                            <TextBox value={extComplect.shelfPlat} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, shelfPlat: +value } })) }} />
                            <div className="text-end">Перемычка (доп): </div>
                            <TextBox value={extComplect.pillar} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, pillar: +value } })) }} />
                            <div className="text-end">Стойка (доп) кол-во: </div>
                            <TextBox value={extComplect.stand.count} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, stand: { ...prev.extComplect.stand, count: +value } } })) }} />
                            <div className="text-end">Стойка (доп) размер: </div>
                            <TextBox value={extComplect.stand.height} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={2750} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, stand: { ...prev.extComplect.stand, height: +value } } })) }} />
                            <div className="text-end">Труба (доп): </div>
                            <TextBox value={extComplect.truba} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, truba: +value } })) }} />
                            <div className="text-end">Тремпель (доп): </div>
                            <TextBox value={extComplect.trempel} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, trempel: +value } })) }} />
                            <div className="text-end">Точки света: </div>
                            <TextBox value={extComplect.light} type={PropertyType.INTEGER_POSITIVE_NUMBER} min={0} max={10} setValue={(value) => { setData(prev => ({ ...prev, extComplect: { ...prev.extComplect, light: +value } })) }} />
                        </PropertyGrid>
                    </div>
                </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8">
                <WardrobeSpecification />
            </div>
        </div>
    </div>
}