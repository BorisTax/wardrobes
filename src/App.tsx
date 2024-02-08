import { useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/App.scss'
import './styles/buttons.scss'
import FasadContainer from './components/FasadContainer'
import Header from './components/Header'
import PropertiesBar from './components/PropertiesBar'
import { createToolTip } from './functions/functions'
import LoginDialog from './components/LoginDialog'
import WardrobePropertiesBar from './components/WardrobePropertiesBar'
import { useAtom, useSetAtom } from 'jotai'
import { setActiveFasadAtom } from './atoms/fasades'
import { loadMaterialListAtom } from './atoms/materials'
import EditMaterialDialog from './components/EditMaterialDialog'
import { UserRoles, userAtom } from './atoms/users'

function App() {
  const setActiveFasad = useSetAtom(setActiveFasadAtom)
  const loadMaterialList = useSetAtom(loadMaterialListAtom)
  const loginDialogRef = useRef<HTMLDialogElement>(null)
  const editMaterialDialogRef = useRef<HTMLDialogElement>(null)
  const [user] = useAtom(userAtom)
  useEffect(() => {
    loadMaterialList()
    const onClick = (e: Event) => { e.preventDefault(); setActiveFasad(null); }
    document.addEventListener("contextmenu", onClick)
    const toolTip = createToolTip()
    document.body.appendChild(toolTip)
    return () => {
      document.removeEventListener("contextmenu", onClick)
      document.body.removeChild(toolTip)
    }
  }, [])
  return (
    <>
      <Header />
      <div className="container-md">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1em" }}>
          <div>
            <WardrobePropertiesBar />
            <PropertiesBar />
          </div>
          <FasadContainer />
        </div>
      </div>
      <LoginDialog dialogRef={loginDialogRef} />
      {user.role === UserRoles.ADMIN || user.role === UserRoles.SUPERADMIN ? <EditMaterialDialog dialogRef={editMaterialDialogRef} /> : <></>}
    </>
  )
}

export default App




