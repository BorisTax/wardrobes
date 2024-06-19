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
          <ImageLink link={"combi"} title="Комби-фасады" icon="combiButton" />
          <ImageLink link={"calculator"} title="Калькулятор шкафов" icon="wardrobeButton" />
      {isEditorAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageLink link={"materials"} title="База материалов" icon="editMaterials" />
          <ImageLink link={"pricelist"} title="Редактор цен" icon="editPrice" />
          <ImageLink link={"specification"} title="Редактор спецификации" icon="editSpecification" />
        </>
        : <></>}
      {isAdminAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageLink link={"users"} title="Список пользователей" icon="userlistButton" />
          <ImageButton title="Скачать базу данных" icon="downloadButton" onClick={() => { downloadDatabase() }} />
        </>
        : <></>}
  </div>
}