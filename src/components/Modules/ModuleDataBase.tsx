import { useState } from "react"
import EditModuleSeries from "./EditModuleSeries"
import EditModules from "./EditModules"
import EditModulesCorrespond from "./EditModulesCorrespond"
import EditModuleEdges from "./EditModuleEdges"
import EditModuleIdName, { IdNameRoutes } from "./EditModuleIdName"
import { MODULE_COMMENTS_ROUTE, MODULE_GROOVES_ROUTE, MODULE_GROUPS_ROUTE } from "../../types/routes"

enum ModulesTabs{
    GROUPS = 1,
    SERIES = 2,
    MODULES = 3,
    MODULES_CORRESPOND = 4,
    EDGES = 11,
    GROOVES = 12,
    COMMENTS = 13

}
const moduleTab = new Map()
moduleTab.set(ModulesTabs.GROUPS, "Группы")
moduleTab.set(ModulesTabs.SERIES, "Серии")
moduleTab.set(ModulesTabs.MODULES, "Модули")
moduleTab.set(ModulesTabs.MODULES_CORRESPOND, "Соответствие модулей в 1С")
moduleTab.set(ModulesTabs.EDGES, "Кромка")
moduleTab.set(ModulesTabs.GROOVES, "Паз")
moduleTab.set(ModulesTabs.COMMENTS, "Примечания")

export default function ModuleDataBase() {
    const [tab, setTab] = useState<ModulesTabs>(ModulesTabs.GROUPS)
    const header = [...moduleTab.entries()].map((item, index) => <div key={index} className={(tab === item[0] ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setTab(item[0] as ModulesTabs) }} role="button">{item[1]}</div>)
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
    tabs.set(ModulesTabs.MODULES_CORRESPOND, <EditModulesCorrespond />)
    tabs.set(ModulesTabs.EDGES, <EditModuleEdges />)
    tabs.set(ModulesTabs.GROOVES, <EditModuleIdName route={MODULE_GROOVES_ROUTE}/>)
    tabs.set(ModulesTabs.COMMENTS, <EditModuleIdName route={MODULE_COMMENTS_ROUTE} />)
    return tabs.get(tab) || <></>
}