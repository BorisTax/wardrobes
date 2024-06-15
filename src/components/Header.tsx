import User from "./User"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../atoms/users"
import ImageButton from "./ImageButton"
import { editMaterialDialogAtom, editPriceDialogAtom, editSpecificationDialogAtom, settingsDialogAtom, showEditUsersDialogAtom, showSchemaDialogAtom, showSpecificationDialogAtom } from "../atoms/dialogs"
import MenuSeparator from "./MenuSeparator"
import { isAdminAtLeast, isClientAtLeast, isEditorAtLeast } from "../server/functions/user"
import { downloadDatabaseAtom } from "../atoms/database"
import { Link } from "react-router-dom"
import ImageLink from "./ImageLink"
export default function Header() {
  const user = useAtomValue(userAtom)
  const editMaterialDialog = useAtomValue(editMaterialDialogAtom)
  const editPriceDialog = useAtomValue(editPriceDialogAtom)
  const editSpecificationDialog = useAtomValue(editSpecificationDialogAtom)
  const showUserListDialog = useSetAtom(showEditUsersDialogAtom)
  const downloadDatabase = useSetAtom(downloadDatabaseAtom)
  const settingsDialog = useAtomValue(settingsDialogAtom)
  return <div className="header">
      <Link to="">Главная</Link>
    <div className="file-buttons-bar">
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
    <User />
  </div>
}