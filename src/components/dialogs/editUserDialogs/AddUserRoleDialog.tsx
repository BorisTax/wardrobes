import { useState } from "react"
import { useSetAtom } from "jotai"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import ImageButton from "../../inputs/ImageButton"
import { createRoleAtom } from "../../../atoms/users"
import { rusMessages } from "../../../functions/messages"
type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
    setLoading: (state: boolean) => void
}

export default function AddUserRoleDialog({ dialogRef, setLoading }: DialogProps ) {
    const closeDialog = () => { dialogRef.current?.close() }
    const [{ name }, setState] = useState({ name: "" })
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const createRole = useSetAtom(createRoleAtom)
    const create = () => {
        showConfirm(`Создать роль ${name} ?`, async () => {
            setLoading(true)
            const result = await createRole({ name })
            setLoading(false)
            showMessage(rusMessages[result.message as string])
        })
    }

    return <dialog ref={dialogRef} onClose={() => { setState(prev => ({ ...prev, password: "" })) }}>
        <div className="dialog-header-bar">
            <div className="d-flex gap-2">
            </div>
            <ImageButton title="Закрыть" icon='close' onClick={() => closeDialog()} />
        </div>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); create() }}>
            <div className="table-grid">
                <div>{`Роль:`}</div>
                <input required value={name} onChange={(e) => { setState((prev) => ({ ...prev, name: e.target.value })); }} />
            </div>
            <hr />
            <input type="submit" value="Создать" />
        </form>
    </dialog>
}
