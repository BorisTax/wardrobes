import { useState } from "react"
import EditModuleSeries from "./EditModuleSeries"
import EditModules from "./EditModules"
import EditModulesCorrespond from "./EditModulesCorrespond"
import EditModuleEdges from "./EditModuleEdges"
import EditModuleIdName from "./EditModuleIdName"
import { MODULE_COMMENTS_ROUTE, MODULE_GROOVES_ROUTE, MODULE_GROUPS_ROUTE } from "../../types/routes"
import EditModuleDetails from "./EditModuleDetails"
import EditModuleMatBases from "./EditModuleMatBases"
import EditModuleMatColors from "./EditModuleMatColors"
import EditModuleMaterials from "./EditModuleMaterials"
import EditModulesSerieMaterials from "./EditModulesSerieMaterials"
import EditModuleFilms from "./EditModuleFilms"
import EditModuleMaterialCorrespond from "./EditModuleMaterialCorrespond"

enum ModulesTabs{
    GROUPS = 1,
    SERIES = 2,
    MODULES = 3,
    DETAILS = 4,
    MODULES_CORRESPOND = 5,
    MAT_BASES = 6,
    MAT_COLORS = 7,
    MATERIALS = 8,
    FILMS = 9,
    SERIE_MATERIALS = 10,
    MATERIALS_CORRESPOND = 11,
    EDGES = 12,
    GROOVES = 13,
    COMMENTS = 14
}
const moduleTab = new Map<ModulesTabs, string>()
moduleTab.set(ModulesTabs.GROUPS, "Группы")
moduleTab.set(ModulesTabs.SERIES, "Серии")
moduleTab.set(ModulesTabs.MODULES, "Модули")
moduleTab.set(ModulesTabs.DETAILS, "Детали")
moduleTab.set(ModulesTabs.MODULES_CORRESPOND, "Соответствие модулей в 1С")
moduleTab.set(ModulesTabs.MAT_BASES, "Материал - Основа")
moduleTab.set(ModulesTabs.MAT_COLORS, "Материал - Цвета")
moduleTab.set(ModulesTabs.MATERIALS, "Материалы")
moduleTab.set(ModulesTabs.FILMS, "Пленки")
moduleTab.set(ModulesTabs.SERIE_MATERIALS, "Материалы серий и модулей")
moduleTab.set(ModulesTabs.MATERIALS_CORRESPOND, "Материалы в 1С")
moduleTab.set(ModulesTabs.EDGES, "Кромки")
moduleTab.set(ModulesTabs.GROOVES, "Пазы")
moduleTab.set(ModulesTabs.COMMENTS, "Примечания")

export default function ModuleDataBase() {
    const [tab, setTab] = useState<ModulesTabs>(ModulesTabs.GROUPS)
    const header = [...moduleTab.entries()].map(([tabItem, caption], index) => <div key={index} className={(tab === tabItem ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setTab(tabItem) }} role="button">{caption}</div>)
    const content = getTab(tab)
    return <div className="database-edit-container">
        <div className="tab-header-container">{header}</div>
        {content}
    </div>
}

function getTab(tab: ModulesTabs) {
    const tabs =new Map()
    tabs.set(ModulesTabs.GROUPS, <EditModuleIdName route={MODULE_GROUPS_ROUTE}/>)
    tabs.set(ModulesTabs.SERIES, <EditModuleSeries />)
    tabs.set(ModulesTabs.MODULES, <EditModules />)
    tabs.set(ModulesTabs.DETAILS, <EditModuleDetails />)
    tabs.set(ModulesTabs.MODULES_CORRESPOND, <EditModulesCorrespond />)
    tabs.set(ModulesTabs.MAT_BASES, <EditModuleMatBases />)
    tabs.set(ModulesTabs.MAT_COLORS, <EditModuleMatColors />)
    tabs.set(ModulesTabs.MATERIALS, <EditModuleMaterials />)
    tabs.set(ModulesTabs.FILMS, <EditModuleFilms />)
    tabs.set(ModulesTabs.SERIE_MATERIALS, <EditModulesSerieMaterials />)
    tabs.set(ModulesTabs.MATERIALS_CORRESPOND, <EditModuleMaterialCorrespond />)
    tabs.set(ModulesTabs.EDGES, <EditModuleEdges />)
    tabs.set(ModulesTabs.GROOVES, <EditModuleIdName route={MODULE_GROOVES_ROUTE}/>)
    tabs.set(ModulesTabs.COMMENTS, <EditModuleIdName route={MODULE_COMMENTS_ROUTE} />)
    return tabs.get(tab) || <></>
}