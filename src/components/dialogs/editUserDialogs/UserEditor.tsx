import { useState } from "react"
import EditUsers from "./EditUsers"
import EditRoles from "./EditRoles"
import EditUserRoles from "./EditUserRoles"
import EditResources from "./EditResources"
import EditPermissions from "./EditPermissions"
import ActiveUsers from "./ActiveUsers"
import UserLog from "./UserLog"


enum UserTabs{
    USERS = 1,
    ROLES = 2,
    USER_ROLES = 3,
    RESOURCES = 4,
    PERMISSIONS = 5,
    ACTIVE_USERS = 6,
    USER_LOG = 7,
}
const moduleTab = new Map<UserTabs, string>()
moduleTab.set(UserTabs.USERS, "Пользователи")
moduleTab.set(UserTabs.ROLES, "Роли")
moduleTab.set(UserTabs.USER_ROLES, "Роли пользователей")
moduleTab.set(UserTabs.RESOURCES, "Ресурсы")
moduleTab.set(UserTabs.PERMISSIONS, "Права")
moduleTab.set(UserTabs.ACTIVE_USERS, "Онлайн")
moduleTab.set(UserTabs.USER_LOG, "Журнал действий")

export default function UserDataBase() {
    const [tab, setTab] = useState<UserTabs>(UserTabs.USERS)
    const header = [...moduleTab.entries()].map(([tabItem, caption], index) => <div key={index} className={(tab === tabItem ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setTab(tabItem) }} role="button">{caption}</div>)
    const content = getTab(tab)
    return <div className="database-edit-container">
        <div className="tab-header-container">{header}</div>
        {content}
    </div>
}

function getTab(tab: UserTabs) {
    const tabs = new Map()
    tabs.set(UserTabs.USERS, <EditUsers />)
    tabs.set(UserTabs.ROLES, <EditRoles />)
    tabs.set(UserTabs.USER_ROLES, <EditUserRoles />)
    tabs.set(UserTabs.RESOURCES, <EditResources />)
    tabs.set(UserTabs.PERMISSIONS, <EditPermissions />)
    tabs.set(UserTabs.ACTIVE_USERS, <ActiveUsers />)
    tabs.set(UserTabs.USER_LOG, <UserLog />)
    return tabs.get(tab) || <></>
}