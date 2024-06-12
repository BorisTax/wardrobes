import User from "./User"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../atoms/users"
import ImageButton from "./ImageButton"
import { editMaterialDialogAtom, editPriceDialogAtom, editSpecificationDialogAtom, settingsDialogAtom, showEditUsersDialogAtom, showSchemaDialogAtom, showSpecificationDialogAtom } from "../atoms/dialogs"
import MenuSeparator from "./MenuSeparator"
import { isAdminAtLeast, isClientAtLeast, isEditorAtLeast } from "../server/functions/user"
import { downloadDatabaseAtom } from "../atoms/database"
import { Link } from "react-router-dom"
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
          <ImageButton title="База материалов" icon="editMaterials" onClick={() => { editMaterialDialog?.current?.showModal() }} />
          <ImageButton title="Редактор цен" icon="editPrice" onClick={() => { editPriceDialog?.current?.showModal() }} />
          <ImageButton title="Редактор спецификации" icon="editSpecification" onClick={() => { editSpecificationDialog?.current?.showModal() }} />
        </>
        : <></>}
      {isAdminAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Список пользователей" icon="userlistButton" onClick={() => { showUserListDialog() }} />
          <ImageButton title="Скачать базу данных" icon="downloadButton" onClick={() => { downloadDatabase() }} />
        </>
        : <></>}
    </div>
    <User />
  </div>
}