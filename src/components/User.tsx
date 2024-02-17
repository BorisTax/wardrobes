import { useAtom, useSetAtom } from "jotai";
import { UserRolesCaptions, logoutUserAtom, userAtom } from "../atoms/users";
import { loginDialogAtom } from "../atoms/dialogs";
import useConfirm from "../custom-hooks/useConfirm";
import { UserRoles } from "../types/server";

export default function User() {
    const [user] = useAtom(userAtom)
    const logoutUser = useSetAtom(logoutUserAtom)
    const role = UserRolesCaptions[user.role as UserRoles]
    const [dialogRef] = useAtom(loginDialogAtom)
    const showConfirm = useConfirm()
    const login = <button className="btn btn-primary" onClick={() => { dialogRef?.current?.showModal() }}>Вход</button>
    const logout = <button className="btn btn-secondary" onClick={() => {
        showConfirm("Выйти из аккаунта?", () => { logoutUser() })
    }
    }>Выход</button>
    return <div className="user">
        <span>{role}</span>
        {user.role === UserRoles.ANONYM ? login : logout}
    </div>
}