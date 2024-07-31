import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { getInitialUser, logoutAtom, userAtom, userRolesAtom } from "../atoms/users";
import useConfirm from "../custom-hooks/useConfirm";
import { versionAtom } from "../atoms/app";
import { useNavigate } from "react-router-dom";

export default function User() {
    const navigate = useNavigate()
    const [user, setUser] = useAtom(userAtom)
    const roles = useAtomValue(userRolesAtom)
    const role = roles.find(r => r.id === user.roleId)?.name || ""
    const logout = useSetAtom(logoutAtom)
    const showConfirm = useConfirm()
    const version = useAtomValue(versionAtom)
    const loginButton = <button className="btn btn-primary" onClick={() => { navigate('/login') }}>Вход</button>
    const logoutButton = <button className="btn btn-secondary" onClick={() => {
        showConfirm("Завершить сеанс пользователя?", () => { logout(); navigate('/login') })
    }
    }>Выход</button>
    useEffect(() => {
      const { token } = getInitialUser();
        setUser({ token, permissions: [] }, true);
    }, [setUser]);
    useEffect(() => {
        if (!user.name) navigate('/login')
      }, [user.name]);
    return <div className="user">
        {user.name === "" ? loginButton :<>
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