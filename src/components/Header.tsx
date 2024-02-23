import User from "./User"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../atoms/users"
import { UserRoles } from "../types/server"
import ImageButton from "./ImageButton"
import { editMaterialDialogAtom, editPriceDialogAtom, editProfileDialogAtom, schemaDialogAtom, showEditUsersDialogAtom, showSchemaDialogAtom, showSpecificationDialogAtom, specificationDialogAtom } from "../atoms/dialogs"
import useConfirm from "../custom-hooks/useConfirm"
import { historyAppAtom, openStateAtom, redoAtom, resetAppDataAtom, saveStateAtom, undoAtom } from "../atoms/app"
import MenuSeparator from "./MenuSeparator"
import { isAdminAtLeast, isClientAtLeast, isManagerAtLeast, isSuperAdminAtLeast } from "../functions/user"
import { useRef } from "react"
export default function Header() {
  const user = useAtomValue(userAtom)
  const editMaterialDialog = useAtomValue(editMaterialDialogAtom)
  const editProfileDialog = useAtomValue(editProfileDialogAtom)
  const editPriceDialog = useAtomValue(editPriceDialogAtom)
  const specificationDialog = useAtomValue(specificationDialogAtom)
  const showSpecificationDialog = useSetAtom(showSpecificationDialogAtom)
  const showSchemaDialog = useSetAtom(showSchemaDialogAtom)
  const showUserListDialog = useSetAtom(showEditUsersDialogAtom)
  const showConfirm = useConfirm()
  const resetAppData = useSetAtom(resetAppDataAtom)
  const saveState = useSetAtom(saveStateAtom)
  const openState = useSetAtom(openStateAtom)
  const { next, previous } = useAtomValue(historyAppAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)
  const headerButtons = useRef<HTMLDivElement>(null)
  const disabledFiles = !isClientAtLeast(user.role)
  return <div className="header">
    <div className="file-buttons-bar">
      <div className="d-flex flex-nowrap gap-2 h-100">
        <ImageButton title="Новый" icon="new" onClick={() => { showConfirm("Сбросить в первоначальное состояние?", () => resetAppData()) }} />
        <ImageButton title="Открыть" icon="open" disabled={disabledFiles} onClick={() => { openState() }} />
        <ImageButton title="Сохранить" icon="save" disabled={disabledFiles} onClick={() => { saveState() }} />
        <ImageButton title="Отменить" icon="undo" disabled={!previous} onClick={() => { undo() }} />
        <ImageButton title="Повторить" icon="redo" disabled={!next} onClick={() => { redo() }} />
      </div>
      {isAdminAtLeast(user.role) ?
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
      {isSuperAdminAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Список пользователей" icon="userlistButton" onClick={() => { showUserListDialog() }} />
        </>
        : <></>}
    </div>
    <User />
  </div>
}