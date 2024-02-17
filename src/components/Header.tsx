import User from "./User"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../atoms/users"
import { UserRoles } from "../types/server"
import ImageButton from "./ImageButton"
import { editMaterialDialogAtom } from "../atoms/dialogs"
import useConfirm from "../custom-hooks/useConfirm"
import { historyAppAtom, openStateAtom, redoAtom, resetAppDataAtom, saveStateAtom, undoAtom } from "../atoms/app"
import MenuSeparator from "./MenuSeparator"
export default function Header() {
  const [user] = useAtom(userAtom)
  const [editMaterialDialog] = useAtom(editMaterialDialogAtom)
  const showConfirm = useConfirm()
  const resetAppData = useSetAtom(resetAppDataAtom)
  const saveState = useSetAtom(saveStateAtom)
  const openState = useSetAtom(openStateAtom)
  const { next, previous } = useAtomValue(historyAppAtom)
  const undo = useSetAtom(undoAtom)
  const redo = useSetAtom(redoAtom)
  return <nav className="header">
    <div className="file-buttons-bar">
      <ImageButton title="Новый" icon="new" onClick={() => { showConfirm("Сбросить в первоначальное состояние?", () => resetAppData()) }} />
      <ImageButton title="Открыть" icon="open" onClick={() => { openState() }} />
      <ImageButton title="Сохранить" icon="save" onClick={() => { saveState() }} />
      <MenuSeparator />
      <ImageButton title="Отменить" icon="undo" disabled={!previous} onClick={() => { undo() }} />
      <ImageButton title="Повторить" icon="redo" disabled={!next} onClick={() => { redo() }} />
      {user.role === UserRoles.ADMIN || user.role === UserRoles.SUPERADMIN ?
        <>
          <MenuSeparator />
          <ImageButton title="Редактор материалов" icon="editMaterials" onClick={() => { editMaterialDialog?.current?.showModal() }} />
        </>
        : <></>}
    </div>
    <User />
  </nav>
}