import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { getInitialUser, logoutAtom, userAtom } from "../atoms/users";
import { loginDialogAtom } from "../atoms/dialogs";
import useConfirm from "../custom-hooks/useConfirm";
import { versionAtom } from "../atoms/app";
import { useNavigate } from "react-router-dom";

export default function User() {
    const navigate = useNavigate()
    const [user, setUser] = useAtom(userAtom)
    const logout = useSetAtom(logoutAtom)
    const dialogRef = useAtomValue(loginDialogAtom)
    const showConfirm = useConfirm()
    const version = useAtomValue(versionAtom)
    const loginButton = <button className="btn btn-primary" onClick={() => { navigate('/login') }}>Вход</button>
    const logoutButton = <button className="btn btn-secondary" onClick={() => {
        showConfirm("Завершить сеанс пользователя?", () => { logout(); navigate('/login') })
    }
    }>Выход</button>
    useEffect(() => {
      const { token } = getInitialUser();
      setUser(token, true);
    }, [setUser]);
    useEffect(() => {
        if (!user.name) navigate('/login')
      }, [user]);
    return <div className="user">
        {user.role.name === "" ? loginButton :<>
            <div className="d-flex flex-column align-items-center p-0">
                <div>{user.name}</div>
                <div>{user.role.name}</div>
            </div>
             {logoutButton}
        </>}
        <div className="version">
            {`v${version}`}
        </div>
    </div>
}