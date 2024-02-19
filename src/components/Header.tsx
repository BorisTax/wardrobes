import User from "./User"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../atoms/users"
import { UserRoles } from "../types/server"
import ImageButton from "./ImageButton"
import { editMaterialDialogAtom, editPriceDialogAtom, editProfileDialogAtom, showSpecificationDialogAtom, specificationDialogAtom } from "../atoms/dialogs"
import useConfirm from "../custom-hooks/useConfirm"
import { historyAppAtom, openStateAtom, redoAtom, resetAppDataAtom, saveStateAtom, undoAtom } from "../atoms/app"
import MenuSeparator from "./MenuSeparator"
import { isAdminAtLeast, isClientAtLeast, isManagerAtLeast } from "../functions/user"
export default function Header() {
  const [user] = useAtom(userAtom)
  const [editMaterialDialog] = useAtom(editMaterialDialogAtom)
  const [editProfileDialog] = useAtom(editProfileDialogAtom)
  const [editPriceDialog] = useAtom(editPriceDialogAtom)
  const [specificationDialog] = useAtom(specificationDialogAtom)
  const showSpecificationDialog = useSetAtom(showSpecificationDialogAtom)
  const showConfirm = useConfirm()
  const resetAppData = useSetAtom(resetAppDataAtom)
  const saveState = useSetAtom(saveStateAtom)
  const openState = useSetAtom(openStateAtom)
  const { next, previous } = useAtomValue(historyAppAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)
  const disabledFiles = !isClientAtLeast(user.role)
  return <nav className="header">
    <div className="file-buttons-bar">
      <ImageButton title="Новый" icon="new" onClick={() => { showConfirm("Сбросить в первоначальное состояние?", () => resetAppData()) }} />
      <ImageButton title="Открыть" icon="open" disabled={disabledFiles} onClick={() => { openState() }} />
      <ImageButton title="Сохранить" icon="save" disabled={disabledFiles} onClick={() => { saveState() }} />
      <MenuSeparator />
      <ImageButton title="Отменить" icon="undo" disabled={!previous} onClick={() => { undo() }} />
      <ImageButton title="Повторить" icon="redo" disabled={!next} onClick={() => { redo() }} />
      {isAdminAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Редактор материалов" icon="editMaterials" onClick={() => { editMaterialDialog?.current?.showModal() }} />
          <ImageButton title="Редактор профилей" icon="editProfiles" onClick={() => { editProfileDialog?.current?.showModal() }} />
          <ImageButton title="Редактор спецификации" icon="editPrice" onClick={() => { editPriceDialog?.current?.showModal()}} />
        </>
        : <></>}
      {isManagerAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Cпецификация" icon="editPrice" onClick={() => { showSpecificationDialog()  }} />
        </>
        : <></>}
    </div>
    <User />
  </nav>
}