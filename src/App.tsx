import { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/App.scss'
import './styles/buttons.scss'
import './styles/containers.scss'
import './styles/messages.scss'
import './styles/inputs.scss'
import Header from './components/Header'
import PropertiesBar from './components/PropertiesBar'
import { createToolTip } from './functions/functions'
import LoginDialog from './components/LoginDialog'
import WardrobePropertiesBar from './components/WardrobePropertiesBar'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { setActiveFasadAtom } from './atoms/fasades'
import { loadMaterialListAtom } from './atoms/materials'
import EditMaterialDialog from './components/EditMaterialDialog'
import { userAtom } from './atoms/users'
import MessageDialog from './components/MessageDialog'
import ConfirmDialog from './components/ConfirmDialog'
import { loadProfileListAtom } from './atoms/profiles'
import RootFasadesContainer from './components/RootFasadesContainer'
import EditProfileDialog from './components/EditProfileDialog'
import EditPriceDialog from './components/EditPriceDialog'
import SpecificationDialog from './components/SpecificationDialog'
import { isAdminAtLeast, isClientAtLeast } from './functions/user'
import { AppState } from './types/app'
import { getAppDataFromState, getInitialAppState } from './functions/wardrobe'
import { appDataAtom } from './atoms/app'
import { loadPriceListAtom } from './atoms/prices'
import SchemaDialog from './components/SchemaDialog'

function App() {
  const { role } = useAtomValue(userAtom)
  const setActiveFasad = useSetAtom(setActiveFasadAtom)
  const loadMaterialList = useSetAtom(loadMaterialListAtom)
  const loadProfileList = useSetAtom(loadProfileListAtom)
  const setAppData = useSetAtom(appDataAtom)
  const [user] = useAtom(userAtom)
  const loadPriceList = useSetAtom(loadPriceListAtom)
  useEffect(() => {
    if (isClientAtLeast(role)) loadPriceList()
  }, [role])
  useEffect(() => {
    const storage = localStorage.getItem('appState')
    const appState: AppState = storage ? JSON.parse(storage) : getInitialAppState()
    loadMaterialList(!storage)
    setAppData(getAppDataFromState(appState), false)
    loadProfileList()
  }, [])
  useEffect(() => {
    const onContextMenu = (e: Event) => { e.preventDefault() }
    document.addEventListener("contextmenu", onContextMenu)
    const toolTip = createToolTip()
    document.body.appendChild(toolTip)
    return () => {
      document.removeEventListener("contextmenu", onContextMenu)
      document.body.removeChild(toolTip)
    }
  }, [])
  return (
    <>
      <Header />
      <div className="main-container" onClick={() => { setActiveFasad(null); }}>
        <div className='properties-container'>
          <WardrobePropertiesBar />
          <PropertiesBar />
        </div>
        <RootFasadesContainer />
      </div>
      <LoginDialog />
      {isAdminAtLeast(user.role) ? <EditMaterialDialog /> : <></>}
      {isAdminAtLeast(user.role) ? <EditProfileDialog /> : <></>}
      {isAdminAtLeast(user.role) ? <EditPriceDialog /> : <></>}
      {isClientAtLeast(user.role) ? <SpecificationDialog /> : <></>}
      {isClientAtLeast(user.role) ? <SchemaDialog /> : <></>}
      <MessageDialog />
      <ConfirmDialog />
    </>
  )
}

export default App




