import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { UserRolesCaptions, getInitialUser, logoutUserAtom, setUserAtom, userAtom } from "../atoms/users";
import { loginDialogAtom } from "../atoms/dialogs";
import useConfirm from "../custom-hooks/useConfirm";
import { UserRoles } from "../types/server";

export default function User() {
    const user = useAtomValue(userAtom)
    const logoutUser = useSetAtom(logoutUserAtom)
    const setUser = useSetAtom(setUserAtom)
    const role = UserRolesCaptions[user.role as UserRoles]
    const dialogRef = useAtomValue(loginDialogAtom)
    const showConfirm = useConfirm()
    const login = <button className="btn btn-primary" onClick={() => { dialogRef?.current?.showModal() }}>Вход</button>
    const logout = <button className="btn btn-secondary" onClick={() => {
        showConfirm("Завершить сеанс пользователя?", () => { logoutUser() })
    }
    }>Выход</button>

    useEffect(() => {
      const { token } = getInitialUser();
      setUser(token, true);
    }, []);
    return <div className="user">
        <span>{role}</span>
        {user.role === UserRoles.ANONYM ? login : logout}
    </div>
}