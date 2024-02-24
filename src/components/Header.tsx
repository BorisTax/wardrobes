import User from "./User"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../atoms/users"
import ImageButton from "./ImageButton"
import { editMaterialDialogAtom, editPriceDialogAtom, editProfileDialogAtom, showEditUsersDialogAtom, showSchemaDialogAtom, showSpecificationDialogAtom } from "../atoms/dialogs"
import useConfirm from "../custom-hooks/useConfirm"
import MenuSeparator from "./MenuSeparator"
import { isAdminAtLeast, isClientAtLeast, isEditorAtLeast } from "../functions/user"
export default function Header() {
  const user = useAtomValue(userAtom)
  const editMaterialDialog = useAtomValue(editMaterialDialogAtom)
  const editProfileDialog = useAtomValue(editProfileDialogAtom)
  const editPriceDialog = useAtomValue(editPriceDialogAtom)
  const showSpecificationDialog = useSetAtom(showSpecificationDialogAtom)
  const showSchemaDialog = useSetAtom(showSchemaDialogAtom)
  const showUserListDialog = useSetAtom(showEditUsersDialogAtom)
  const showConfirm = useConfirm()

  return <div className="header">
    <div className="file-buttons-bar">
      {isEditorAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Редактор материалов" icon="editMaterials" onClick={() => { editMaterialDialog?.current?.showModal() }} />
          <ImageButton title="Редактор профилей" icon="editProfiles" onClick={() => { editProfileDialog?.current?.showModal() }} />
          <ImageButton title="Редактор спецификации" icon="editPrice" onClick={() => { editPriceDialog?.current?.showModal() }} />
        </>
        : <></>}
      {isClientAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Cпецификация" icon="specButton" onClick={() => { showSpecificationDialog() }} />
          <ImageButton title="Cхема" icon="schemaButton" onClick={() => { showSchemaDialog() }} />
        </>
        : <></>}
      {isAdminAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Список пользователей" icon="userlistButton" onClick={() => { showUserListDialog() }} />
        </>
        : <></>}
    </div>
    <User />
  </div>
}