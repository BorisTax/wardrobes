import { useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/App.scss'
import './styles/buttons.scss'
import './styles/containers.scss'
import './styles/messages.scss'
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
import MessageDialog from './components/MessageDialog'
import ConfirmDialog from './components/ConfirmDialog'
import { loadProfileListAtom } from './atoms/profiles'
import RootFasadesContainer from './components/RootFasadesContainer'

function App() {
  const setActiveFasad = useSetAtom(setActiveFasadAtom)
  const loadMaterialList = useSetAtom(loadMaterialListAtom)
  const loadProfileList = useSetAtom(loadProfileListAtom)
  const loginDialogRef = useRef<HTMLDialogElement>(null)
  const editMaterialDialogRef = useRef<HTMLDialogElement>(null)
  const messageDialogRef = useRef<HTMLDialogElement>(null)
  const confirmDialogRef = useRef<HTMLDialogElement>(null)
  const [user] = useAtom(userAtom)
  useEffect(() => {
    loadMaterialList(true)
    loadProfileList()
    //const onClick = (e: Event) => { setActiveFasad(null); }
    const onContextMenu = (e: Event) => { e.preventDefault() }
    document.addEventListener("contextmenu", onContextMenu)
    //document.addEventListener("click", onClick)
    const toolTip = createToolTip()
    document.body.appendChild(toolTip)
    return () => {
      document.removeEventListener("contextmenu", onContextMenu)
      //document.removeEventListener("click", onClick)
      document.body.removeChild(toolTip)
    }
  }, [loadMaterialList, loadProfileList])
  return (
    <>
      <Header />
      <div className="main-container" onClick={() => { setActiveFasad(null); }}>
        <div className='properties-container'>
          <WardrobePropertiesBar />
          <PropertiesBar />
        </div>
        <RootFasadesContainer/>
      </div>
      <LoginDialog dialogRef={loginDialogRef} />
      {user.role === UserRoles.ADMIN || user.role === UserRoles.SUPERADMIN ? <EditMaterialDialog dialogRef={editMaterialDialogRef} /> : <></>}
      <MessageDialog dialogRef={messageDialogRef} />
      <ConfirmDialog dialogRef={confirmDialogRef} />
    </>
  )
}

export default App




