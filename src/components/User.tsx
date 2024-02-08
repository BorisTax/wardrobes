import { UserRolesCaptions } from "../assets/data";
import { useAtom, useSetAtom } from "jotai";
import { UserRoles, logoutUserAtom, userAtom } from "../atoms/users";
import { loginDialogAtom } from "../atoms/dialogs";

export default function User() {
    const [user] = useAtom(userAtom)
    const logoutUser = useSetAtom(logoutUserAtom)
    const role = UserRolesCaptions[user.role]
    const [dialogRef] = useAtom(loginDialogAtom)
    const login = <button className="btn btn-primary" onClick={() => { dialogRef?.current?.showModal() }}>Вход</button>
    const logout = <button className="btn btn-secondary" onClick={() => {
        if (!confirm("Вы действительно хотите выйти?")) return
        logoutUser()
    }}>Выход</button>
    return <div className="user">
        <span>{role}</span>
        {user.role === UserRoles.GUEST ? login : logout}
    </div>
}