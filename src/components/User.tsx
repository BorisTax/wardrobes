import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { UserRolesCaptions, getInitialUser, logoutAtom, setUserAtom, userAtom } from "../atoms/users";
import { loginDialogAtom } from "../atoms/dialogs";
import useConfirm from "../custom-hooks/useConfirm";
import { UserRoles } from "../server/types/server";
import { versionAtom } from "../atoms/app";

export default function User() {
    const [user] = useAtom(userAtom)
    const logout = useSetAtom(logoutAtom)
    const setUser = useSetAtom(setUserAtom)
    const role = UserRolesCaptions[user.role as UserRoles]
    const dialogRef = useAtomValue(loginDialogAtom)
    const showConfirm = useConfirm()
    const version = useAtomValue(versionAtom)
    const loginButton = <button className="btn btn-primary" onClick={() => { dialogRef?.current?.showModal() }}>Вход</button>
    const logoutButton = <button className="btn btn-secondary" onClick={() => {
        showConfirm("Завершить сеанс пользователя?", () => { logout() })
    }
    }>Выход</button>
    useEffect(() => {
      const { token } = getInitialUser();
      setUser(token, true);
    }, []);
    return <div className="user">
        {user.role === UserRoles.ANONYM ? loginButton :<>
            <div className="d-flex flex-column align-items-center p-0">
                <div>{user.name}</div>
                <div>{role}</div>
            </div>
             {logoutButton}
        </>}
        <div className="version">
            {`v${version}`}
        </div>
    </div>
}