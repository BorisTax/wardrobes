import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { UserRolesCaptions, getInitialUser, logoutUserAtom, setUserAtom, userAtom } from "../atoms/users";
import { loginDialogAtom } from "../atoms/dialogs";
import useConfirm from "../custom-hooks/useConfirm";
import { UserRoles } from "../types/server";
import { isClientAtLeast, waitForMessageFromServer } from "../functions/user";
import { loadPriceListAtom } from "../atoms/prices";

export default function User() {
    const [user, setUserDirectly] = useAtom(userAtom)
    const logoutUser = useSetAtom(logoutUserAtom)
    const setUser = useSetAtom(setUserAtom)
    const role = UserRolesCaptions[user.role as UserRoles]
    const dialogRef = useAtomValue(loginDialogAtom)
    const loadPriceList = useSetAtom(loadPriceListAtom)
    const showConfirm = useConfirm()
    const login = <button className="btn btn-primary" onClick={() => { dialogRef?.current?.showModal() }}>Вход</button>
    const logout = <button className="btn btn-secondary" onClick={() => {
        showConfirm("Завершить сеанс пользователя?", () => { logoutUser() })
    }
    }>Выход</button>
    useEffect(() => {
        if (isClientAtLeast(user.role)) loadPriceList()
        if (user.role !== UserRoles.ANONYM) waitForMessageFromServer((token) => {
          if (token === user.token) setUserDirectly({ name: UserRoles.ANONYM, role: UserRoles.ANONYM, token: "" })
        })
      }, [user.role])
    useEffect(() => {
      const { token } = getInitialUser();
      setUser(token, true);
    }, []);
    return <div className="user">
        <span>{role}</span>
        {user.role === UserRoles.ANONYM ? login : logout}
    </div>
}