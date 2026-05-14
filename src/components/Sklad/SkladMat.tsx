import { useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import ImageButtonBar from "../inputs/Image'ButtonBar"
import ImageButton from "../inputs/ImageButton"
import { saveMatToExcelAtom } from "../../atoms/export"
import SkladMatList from "./SkladMatList"
import SkladMatIncome from "./SkladMatIncome"
import EditMat from "./EditMat"
import { userAtom } from "../../atoms/users"
import { RESOURCE, UserPermissions } from "../../types/user"
import { access } from "fs"
enum SkladGroup{
    SKLAD = 1,
    INCOME = 2,
    OUTCOME = 3,
    EDITOR = 4,
}
const matGroup = new Map<SkladGroup, { caption: string, admin?: boolean }>()
matGroup.set(SkladGroup.SKLAD, {caption: "Склад"})
matGroup.set(SkladGroup.INCOME, {caption: "Приход"})
matGroup.set(SkladGroup.OUTCOME, {caption: "Расход"})
matGroup.set(SkladGroup.EDITOR, {caption: "Редактор материалов", admin: true })


export default function SkladMat() {
    const saveToExcel = useSetAtom(saveMatToExcelAtom)
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SKLAD_DB_EDIT) as UserPermissions
    const [group, setGroup] = useState<SkladGroup>(SkladGroup.SKLAD)
    const header = [...matGroup].filter(([_, { admin }]) => !admin || (admin && (perm?.Create || perm?.Update || perm?.Delete))).map(([grp, { caption }], index) => <div key={index} className={(group === grp ? "tab-button-active" : "tab-button-inactive")} onClick={() => { setGroup(grp) }} role="button">{caption}</div>)
    const content = getGroup(group, perm?.Create || perm?.Update || perm?.Delete)
    return <div className="database-edit-container">
        <h4>Учет остатков плит</h4>
            <ImageButtonBar justifyContent="flex-start">
                <ImageButton icon="excel" title="Сохранить в Excel" caption="Сохранить в Excel" onClick={() => saveToExcel()} />
            </ImageButtonBar>
        <div className="tab-header-container">{header}</div>
        {content}
    </div>
}


function getGroup(group: SkladGroup, skladDb: boolean) {
    const groups =new Map()
    groups.set(SkladGroup.SKLAD, <SkladMatList />)
    groups.set(SkladGroup.INCOME, <SkladMatIncome income={true} />)
    groups.set(SkladGroup.OUTCOME, <SkladMatIncome income={false} />)
    if(skladDb) groups.set(SkladGroup.EDITOR,  <EditMat />)
    return groups.get(group) || <></>
}