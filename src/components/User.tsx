import { useContext } from "react";
import { DialogContext, UserContext } from "../App";
import { UserRolesCaptions } from "../assets/data";
import { UserRoles  } from "../reducers/userReducer";
import { logoutUser } from "../actions/UserActions";
import useFetch from "../custom-hooks/useFetch";

export default function User() {
    const { user, dispatchUser } = useContext(UserContext)
    const role = UserRolesCaptions[user.role]
    const dialogRef = useContext(DialogContext)
    const onResolve = (r: any) => { dispatchUser(logoutUser()); }
    const login = <button onClick={() => { dialogRef?.current?.showModal() }}>Вход</button>
    const logout = <button onClick={() => {
        if(!confirm("Вы действительно хотите выйти?")) return
        useFetch('api/logout', JSON.stringify({ token: user.token }), onResolve, () => { }, () => { })
    }}>Выход</button>
    return <div className="user">
        <span>{role}</span>
        {user.role === UserRoles.GUEST ? login : logout}
    </div>
}