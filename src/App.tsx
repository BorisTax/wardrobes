import { Suspense, lazy, useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/App.scss'
import './styles/buttons.scss'
import './styles/containers.scss'
import './styles/messages.scss'
import './styles/inputs.scss'
import './styles/templates.scss'
import './styles/tables.scss'
import './styles/navbar.scss'
import combi from './images/combi.png';
import wardrobe from './images/wardrobe.png';

import Header from './components/Header'
import { createToolTip } from './functions/functions'
import LoginDialog from './components/dialogs/LoginDialog'
const EditMaterialDialog = lazy(() => import('./components/dialogs/EditMaterialDialog'))
import {  userAtom } from './atoms/users'
import MessageDialog from './components/dialogs/MessageDialog'
import ConfirmDialog from './components/dialogs/ConfirmDialog'
const EditPriceDialog = lazy(() => import('./components/dialogs/EditPriceDialog'))
import { AppState } from './types/app'
import { getAppDataFromState, getInitialAppState } from './functions/wardrobe'
import { appDataAtom, loadInitialStateAtom, loadVersionAtom, saveToStorageAtom } from './atoms/app'
import EditUsersDialog from './components/dialogs/editUserDialogs/EditUsersDialog'
import SettingsDialog from './components/dialogs/SettingsDialog'
import CopyFasadDialog from './components/dialogs/CopyFasadDialog'
import FasadTemplatesDialog from './components/dialogs/FasadTemplatesDialog'
const CombiFasades = lazy(() => import('./components/CombiFasades'))
const WardrobeCalculator = lazy(() => import('./components/WardrobeCalculator'))
const EditSpecificationDialog = lazy(()=>import('./components/dialogs/EditSpecificationDialog'))
import VerboseDataDialog from './components/dialogs/VerboseDataDialog'
import SchemaDialog from './components/dialogs/SchemaDialog'
import SpecificationDialog from './components/dialogs/SpecificationDialog'
import NavBar from './components/NavBar'
import LoadIndicator from './components/LoadIndicator'

function App() {
  const user = useAtomValue(userAtom)
  const setAppData = useSetAtom(appDataAtom)
  const loadVersion = useSetAtom(loadVersionAtom)
  const loadInitialAppState = useSetAtom(loadInitialStateAtom)
  const saveToStorage = useSetAtom(saveToStorageAtom)
  useEffect(() => {
    const storage = localStorage.getItem('appState')
    const appState: AppState = storage ? JSON.parse(storage) : getInitialAppState()
    setAppData(getAppDataFromState(appState), false)
    loadInitialAppState()
    loadVersion()
  }, [user.name, setAppData, loadInitialAppState, loadVersion])
  useEffect(() => {
    const onContextMenu = (e: Event) => { e.preventDefault() }
    const onBeforeUnload = () => { saveToStorage() }
    document.addEventListener("contextmenu", onContextMenu)
    window.addEventListener("beforeunload", onBeforeUnload)
    const toolTip = createToolTip()
    document.body.appendChild(toolTip)
    return () =>  {
      document.removeEventListener("contextmenu", onContextMenu)
      window.removeEventListener("beforeunload", onBeforeUnload)
      document.body.removeChild(toolTip)
    }
  }, [saveToStorage])
  return (
    <>
      <BrowserRouter>
      <Header />
      <div className='d-flex flex-nowrap'>
          {user.name && <NavBar />}
          <Suspense fallback={<LoadIndicator />}>
            <Routes>
              <Route path="/" element={<></>}/>
              <Route path="/login" element={<LoginDialog />}/>
              <Route path="/combi" element={<CombiFasades />} />
              <Route path="/calculator" element={<WardrobeCalculator />} />
              <Route path="/schema" element={<SchemaDialog />} />
              <Route path="/specification" element={<EditSpecificationDialog />} />
              <Route path="/materials" element={<EditMaterialDialog />} />
              <Route path="/pricelist" element={<EditPriceDialog />} />
              <Route path="/users" element={<EditUsersDialog />} />
            </Routes>
          </Suspense>
        </div>
      <SpecificationDialog />
      <CopyFasadDialog />
      <FasadTemplatesDialog />
      <SettingsDialog />
      <VerboseDataDialog />
      <MessageDialog />
      <ConfirmDialog />
      </BrowserRouter>
    </>
  )
}

export default App

function Select() {
  return <div className='main-screen-select-container'>
    <div className='main-screen-select-item'>
      <Link to="combi">
        <div className='d-flex flex-column align-items-center'>
          <img className='image' src={combi} />
          <div>Калькулятор комби фасадов</div>
        </div>
      </Link>
    </div>
    <div className='main-screen-select-item'>
      <Link to="calculator">
        <div className='d-flex flex-column align-items-center'>
          <img className='image' src={wardrobe} />
          <div>Калькулятор шкафов</div>
        </div>
      </Link>
    </div>
  </div>
}


