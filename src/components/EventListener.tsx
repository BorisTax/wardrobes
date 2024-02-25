import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { loadActiveUsersAtom, userAtom } from "../atoms/users";
import { UserRoles } from "../server/types/server";
import { waitForMessageFromServer } from "../functions/user";
import useMessage from "../custom-hooks/useMessage";
import { SERVER_EVENTS } from "../server/types/enums";

export default function EventListener() {
    const [user, setUserDirectly] = useAtom(userAtom)
    const loadActiveUsers = useSetAtom(loadActiveUsersAtom)
    const showMessage = useMessage()
    useEffect(() => {
      if (user.role !== UserRoles.ANONYM) waitForMessageFromServer(user.token, (message, data) => {
        switch(message){
          case SERVER_EVENTS.LOGOUT:
            if(user.role===UserRoles.ANONYM) return true
            if (data === user.token) {
              setUserDirectly({ name: UserRoles.ANONYM, role: UserRoles.ANONYM, token: "" })
              showMessage("Сеанс завершен администратором")
              return true
            } else loadActiveUsers()
            break;
          case SERVER_EVENTS.UPDATE_ACTIVE_USERS:
            loadActiveUsers()
            break;
          }
        return false
      })
      }, [user.name])
    return <></>
}