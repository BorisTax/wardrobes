import User from "./User"
import { useAtom } from "jotai"
import { userAtom } from "../atoms/users"
import { UserRoles } from "../types/server"
import ImageButton from "./ImageButton"
import { editMaterialDialogAtom } from "../atoms/dialogs"
export default function Header() {
  const [user] = useAtom(userAtom)
  const [editMaterialDialog] = useAtom(editMaterialDialogAtom)
  return <nav className="header">
    <div className="file-buttons-bar">
      <ImageButton title="Новый" icon="new" onClick={() => { }} />
      <ImageButton title="Открыть" icon="open" onClick={() => { }} />
      <ImageButton title="Сохранить" icon="save" onClick={() => { }} />
    </div>
    <div className="instruments-buttons-bar">
      {user.role === UserRoles.ADMIN || user.role === UserRoles.SUPERADMIN ?
        <ImageButton title="Редактор материалов" icon="editMaterials" onClick={() => { editMaterialDialog?.current?.showModal() }} /> : <></>}
    </div>
    <User />
  </nav>
}