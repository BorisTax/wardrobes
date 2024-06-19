import User from "./User"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../atoms/users"
import ImageButton from "./ImageButton"
import MenuSeparator from "./MenuSeparator"
import { isAdminAtLeast, isEditorAtLeast } from "../server/functions/user"
import { downloadDatabaseAtom } from "../atoms/database"
import ImageLink from "./ImageLink"
export default function NavBar() {
  const user = useAtomValue(userAtom)
  const downloadDatabase = useSetAtom(downloadDatabaseAtom)
  return <div className="data-navbar">
          <ImageLink link={"combi"} caption="Комби-фасады" icon="combiButton" />
          <ImageLink link={"calculator"} caption="Калькулятор шкафов" icon="wardrobeButton" />
      {isEditorAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageLink link={"materials"} caption="База материалов" icon="editMaterials" />
          <ImageLink link={"pricelist"} caption="Редактор цен" icon="editPrice" />
          <ImageLink link={"specification"} caption="Редактор спецификации" icon="editSpecification" />
        </>
        : <></>}
      {isAdminAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageLink link={"users"} caption="Список пользователей" icon="userlistButton" />
          <ImageButton title="Скачать базу данных" icon="downloadButton" onClick={() => { downloadDatabase() }} />
        </>
        : <></>}
  </div>
}