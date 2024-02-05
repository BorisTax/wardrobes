import { useContext, useState } from "react"
import { UserContext } from "../App"
import { setUser } from "../actions/UserActions"
import useFetch from "../custom-hooks/useFetch"

type DialogProps = {
    dialogRef: React.RefObject<HTMLDialogElement>
}

export default function LoginDialog(props: DialogProps) {
    const { dispatchUser } = useContext(UserContext)
    const [state, setState] = useState({ loading: false, message: "" })
    const closeDialog = () => { props.dialogRef.current?.close() }
    const login = (name: string, password: string) => {
        setState({ loading: true, message: "" })
        const onResolve = (r: any) => { dispatchUser(setUser({name: r.name, role: r.role, token: r.token})); closeDialog() }
        const onReject = () => { setState({ loading: false, message: "Неправильные имя пользователя и/или пароль" }) }
        const onCatch = () => { setState({ loading: false, message: "Ошибка сервера" }) }
        useFetch('api/login', JSON.stringify({ name, password }), onResolve, onReject, onCatch)
    }
    return <dialog ref={props.dialogRef}>
        <form id="loginForm" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(document.getElementById("loginForm") as HTMLFormElement)
            login(formData.get("name") as string, formData.get("password") as string)
        }}>
            <div className="property-grid">
                <label htmlFor="name">Логин</label>
                <input name="name" />
                <label htmlFor="password">Пароль</label>
                <input name="password" type="password" />
            </div>
            <button type="submit">OK</button>
            <button onClick={() => closeDialog()}>Отмена</button>
            <div>{state.message}</div>
        </form>
    </dialog>
}