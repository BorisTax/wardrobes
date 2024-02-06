import { Dispatch, createContext, useEffect, useReducer, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/App.scss'
import './styles/buttons.scss'
import FasadContainer from './components/FasadContainer'
import Header from './components/Header'
import PropertiesBar from './components/PropertiesBar'
import { appReducer, AppState, getInitialState } from './reducers/appReducer'
import { setActiveFasad, setMaterialList } from './actions/AppActions'
import { UserState, getInitialUser, userReducer } from './reducers/userReducer'
import { createToolTip, getMaterialList } from './functions/functions'
import LoginDialog from './components/LoginDialog'
import useFetch from './custom-hooks/useFetch'
import WardrobePropertiesBar from './components/WardrobePropertiesBar'

type AppContextType = {
  state: AppState
  dispatch: Dispatch<{ type: string, payload?: any }>
}
type UserContextType = {
  user: UserState
  dispatchUser: Dispatch<{ type: string, payload?: any }>
}
type DialogContextType = React.RefObject<HTMLDialogElement> | null
const initialState = getInitialState()
const initialUser = getInitialUser()

export const AppContext = createContext<AppContextType>({ state: initialState, dispatch: () => "" })
export const UserContext = createContext<UserContextType>({ user: initialUser, dispatchUser: () => "" })
export const DialogContext = createContext<DialogContextType>(null)

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [user, dispatchUser] = useReducer(userReducer, initialUser)
  const rootFasad = state.rootFasades[state.activeRootFasadIndex]
  const activeFasad = rootFasad.getActiveFasad()
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const onClick = (e: Event) => { e.preventDefault(); dispatch(setActiveFasad(null)) }

    const onLoadMaterials = (r: any) => { dispatch(setMaterialList(getMaterialList(r.materials))) }
    useFetch('api/extmaterials', "", onLoadMaterials)
    
    document.addEventListener("contextmenu", onClick)
    const toolTip = createToolTip()
    document.body.appendChild(createToolTip())
    return () => {
      document.removeEventListener("contextmenu", onClick)
      document.body.removeChild(toolTip)
    }
  }, [])
  return (
    <>
      <AppContext.Provider value={{ state, dispatch }}>
        <UserContext.Provider value={{ user, dispatchUser }}>
          <DialogContext.Provider value={dialogRef}>
            <Header />
            <div className="container-md">
              <div style={{ display: "flex", flexWrap: "wrap", gap:"1em"}}>
                <div>
                  <WardrobePropertiesBar/>
                  <PropertiesBar fasad={activeFasad} />
                </div>
                <FasadContainer rootFasad={rootFasad} />
              </div>
            </div>
            <LoginDialog dialogRef={dialogRef} />
          </DialogContext.Provider>
        </UserContext.Provider>
      </AppContext.Provider>
    </>
  )
}

export default App




