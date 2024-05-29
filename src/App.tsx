import { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/App.scss'
import './styles/buttons.scss'
import './styles/containers.scss'
import './styles/messages.scss'
import './styles/inputs.scss'
import './styles/templates.scss'
import Header from './components/Header'
import PropertiesBar from './components/PropertiesBar'
import { createToolTip, isMobile } from './functions/functions'
import LoginDialog from './components/dialogs/LoginDialog'
import WardrobePropertiesBar from './components/WardrobePropertiesBar'
import { useAtomValue, useSetAtom } from 'jotai'
import { setActiveFasadAtom } from './atoms/fasades'
import { loadMaterialListAtom } from './atoms/materials'
import EditMaterialDialog from './components/dialogs/EditMaterialDialog'
import {  userAtom } from './atoms/users'
import MessageDialog from './components/dialogs/MessageDialog'
import ConfirmDialog from './components/dialogs/ConfirmDialog'
import { loadProfileListAtom } from './atoms/profiles'
import RootFasadesContainer from './components/fasad/RootFasadesContainer'
import EditPriceDialog from './components/dialogs/EditPriceDialog'
import SpecificationDialog from './components/dialogs/SpecificationDialog'
import { isAdminAtLeast, isClientAtLeast, isEditorAtLeast} from './server/functions/user'
import { AppState } from './types/app'
import { getAppDataFromState, getInitialAppState } from './functions/wardrobe'
import { appDataAtom, loadVersionAtom, saveToStorageAtom } from './atoms/app'
import SchemaDialog from './components/dialogs/SchemaDialog'
import EditUsersDialog from './components/dialogs/EditUsersDialog'
import EventListener from './components/EventListener'
import SettingsDialog from './components/dialogs/SettingsDialog'
import StatusBar from './components/StatusBar'
import CopyFasadDialog from './components/dialogs/CopyFasadDialog'
import FasadTemplatesDialog from './components/dialogs/FasadTemplatesDialog'
import { loadEdgeListAtom } from './atoms/edges'
import { loadZaglushkaListAtom } from './atoms/zaglushka'

function App() {
  const user = useAtomValue(userAtom)
  const setActiveFasad = useSetAtom(setActiveFasadAtom)
  const loadMaterialList = useSetAtom(loadMaterialListAtom)
  const loadProfileList = useSetAtom(loadProfileListAtom)
  const loadEdgeList = useSetAtom(loadEdgeListAtom)
  const loadZaglushkaList = useSetAtom(loadZaglushkaListAtom)
  const setAppData = useSetAtom(appDataAtom)
  const loadVersion = useSetAtom(loadVersionAtom)
  const saveToStorage = useSetAtom(saveToStorageAtom)
  useEffect(() => {
    const storage = localStorage.getItem('appState')
    const appState: AppState = storage ? JSON.parse(storage) : getInitialAppState()
    setAppData(getAppDataFromState(appState), false)
    loadMaterialList(!storage)
    loadProfileList()
    loadEdgeList()
    loadZaglushkaList()
    loadVersion()
  }, [])
  useEffect(() => {
    const onContextMenu = (e: Event) => { e.preventDefault() }
    const onBeforeUnload = (e: Event) => { saveToStorage() }
    document.addEventListener("contextmenu", onContextMenu)
    window.addEventListener("beforeunload", onBeforeUnload)
    const toolTip = createToolTip()
    document.body.appendChild(toolTip)
    return () =>  {
      document.removeEventListener("contextmenu", onContextMenu)
      window.removeEventListener("beforeunload", onBeforeUnload)
      document.body.removeChild(toolTip)
    }
  }, [])
  return (
    <>
      <Header />
      {!isMobile() ? <StatusBar /> : <></>}
      <div className="main-container" onClick={() => { setActiveFasad(null); }}>
        <div className='properties-container'>
          <WardrobePropertiesBar />
          <PropertiesBar />
        </div>
        <RootFasadesContainer />
      </div>
      <CopyFasadDialog />
      <FasadTemplatesDialog />
      <SettingsDialog />
      <LoginDialog />
      {isEditorAtLeast(user.role) ? <EditMaterialDialog /> : <></>}
      {isEditorAtLeast(user.role) ? <EditPriceDialog /> : <></>}
      {isClientAtLeast(user.role) ? <SpecificationDialog /> : <></>}
      {isClientAtLeast(user.role) ? <SchemaDialog /> : <></>}
      {isAdminAtLeast(user.role) ? <EditUsersDialog /> : <></>}
      <MessageDialog />
      <ConfirmDialog />
      <EventListener />
    </>
  )
}

export default App




