import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { loadActiveUsersAtom, standbyUserAtom, userAtom, verifyUserAtom } from "../atoms/users";
import { UserRoles } from "../types/user";
import { waitForMessageFromServer } from "../functions/user";
import useMessage from "../custom-hooks/useMessage";
import { SERVER_EVENTS } from "../types/enums";
import { fetchGetData } from "../functions/fetch";

export default function EventListener() {
  const [user, setUserDirectly] = useAtom(userAtom)
  const loadActiveUsers = useSetAtom(loadActiveUsersAtom)
  const verifyUser = useSetAtom(verifyUserAtom)
  const standbyUser = useSetAtom(standbyUserAtom)
  const showMessage = useMessage()
  useEffect(() => {
    const timer = setInterval(() => { 
      verifyUser()
      standbyUser()
     }, 60000)
    return () => { clearInterval(timer) }
  }, [user])
  useEffect(() => {
    if (user.role !== UserRoles.ANONYM) waitForMessageFromServer(user.token, (message, data) => {
      switch (message) {
        case SERVER_EVENTS.LOGOUT:
          if (user.role === UserRoles.ANONYM) return true
          if (data === user.token) {
            setUserDirectly({ name: UserRoles.ANONYM, role: UserRoles.ANONYM, token: "" })
            showMessage("Сеанс завершен администратором")
            return true
          } else if (user.role === UserRoles.ADMIN) loadActiveUsers()
          break;
        case SERVER_EVENTS.UPDATE_ACTIVE_USERS:
          if (user.role === UserRoles.ADMIN) loadActiveUsers()
          break;
      }
      return false
    })
  }, [user.name])
    return <></>
}