import { useEffect } from 'react'
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
import { useAtomValue, useSetAtom } from 'jotai'
import { loadMaterialListAtom } from './atoms/materials/materials'
import EditMaterialDialog from './components/dialogs/EditMaterialDialog'
import {  userAtom } from './atoms/users'
import MessageDialog from './components/dialogs/MessageDialog'
import ConfirmDialog from './components/dialogs/ConfirmDialog'
import { loadProfileListAtom } from './atoms/materials/profiles'
import EditPriceDialog from './components/dialogs/EditPriceDialog'
import { AppState } from './types/app'
import { getAppDataFromState, getInitialAppState } from './functions/wardrobe'
import { appDataAtom, loadInitialStateAtom, loadVersionAtom, saveToStorageAtom } from './atoms/app'
import EditUsersDialog from './components/dialogs/EditUsersDialog'
import EventListener from './components/EventListener'
import SettingsDialog from './components/dialogs/SettingsDialog'
import CopyFasadDialog from './components/dialogs/CopyFasadDialog'
import FasadTemplatesDialog from './components/dialogs/FasadTemplatesDialog'
import { loadEdgeListAtom } from './atoms/materials/edges'
import { loadZaglushkaListAtom } from './atoms/materials/zaglushka'
import { loadBrushListAtom } from './atoms/materials/brush'
import { loadTrempelListAtom } from './atoms/materials/trempel'
import CombiFasades from './components/CombiFasades'
import { BrowserRouter, Link, Route, Routes, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import WardrobeCalculator from './components/WardrobeCalculator'
import EditSpecificationDialog from './components/dialogs/EditSpecificationDialog'
import VerboseDataDialog from './components/dialogs/VerboseDataDialog'
import SchemaDialog from './components/dialogs/SchemaDialog'
import { loadSpecificationListAtom } from './atoms/specification'
import SpecificationDialog from './components/dialogs/SpecificationDialog'
import { loadUplotnitelListAtom } from './atoms/materials/uplotnitel'
import { loadInitialWardrobeDataAtom } from './atoms/wardrobe'
import NavBar from './components/NavBar'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route path="/" element={<Select />}></Route>
      <Route path="/combi" element={<CombiFasades />} />
      <Route path="/calculator" element={<WardrobeCalculator /> } />
    </Route>
  )
);

function App() {
  const user = useAtomValue(userAtom)
  const loadMaterialList = useSetAtom(loadMaterialListAtom)
  const loadSpecification = useSetAtom(loadSpecificationListAtom)
  const loadProfileList = useSetAtom(loadProfileListAtom)
  const loadEdgeList = useSetAtom(loadEdgeListAtom)
  const loadBrushList = useSetAtom(loadBrushListAtom)
  const loadTrempelList = useSetAtom(loadTrempelListAtom)
  const loadZaglushkaList = useSetAtom(loadZaglushkaListAtom)
  const loadUplotnitelList = useSetAtom(loadUplotnitelListAtom)
  const setAppData = useSetAtom(appDataAtom)
  const loadVersion = useSetAtom(loadVersionAtom)
  const loadInitialAppState = useSetAtom(loadInitialStateAtom)
  const loadInitialWardrobeData = useSetAtom(loadInitialWardrobeDataAtom)
  const saveToStorage = useSetAtom(saveToStorageAtom)
  useEffect(() => {
    const storage = localStorage.getItem('appState')
    const appState: AppState = storage ? JSON.parse(storage) : getInitialAppState()
    setAppData(getAppDataFromState(appState), false)
    loadMaterialList(!storage)
    loadSpecification()
    loadProfileList()
    loadEdgeList()
    loadBrushList()
    loadTrempelList()
    loadZaglushkaList()
    loadUplotnitelList()
    loadInitialAppState()
    loadInitialWardrobeData()
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
      <BrowserRouter>
      <Header />
      <div className='d-flex flex-nowrap'>
        <NavBar />
              <Routes>
                <Route path="/" element={<Select />}></Route>
                <Route path="/combi" element={<CombiFasades />} />
                <Route path="/calculator" element={<WardrobeCalculator /> } />
                <Route path="/combi/schema" element={<SchemaDialog /> } />
                <Route path="/specification" element={<EditSpecificationDialog /> } />
                <Route path="/materials" element={<EditMaterialDialog /> } />
                <Route path="/pricelist" element={<EditPriceDialog /> } />
                <Route path="/users" element={<EditUsersDialog /> } />
               </Routes>
      </div>
      </BrowserRouter>
      <SpecificationDialog />
      <CopyFasadDialog />
      <FasadTemplatesDialog />
      <SettingsDialog />
      <LoginDialog />
      <VerboseDataDialog />
      <MessageDialog />
      <ConfirmDialog />
      <EventListener />
    </>
  )
}

export default App

function Select(){
  return <div style={{fontSize: "1.5em", height: "100%", display: "flex", flexDirection: "column"}}>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "stretch" }}>
      <Link to="combi">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end",alignItems:"center", border: "1px solid", borderRadius: "5px", padding: "2em", height: "100%" }}>
          <img className='image' src={combi}/>
          <div>Калькулятор комби фасадов</div>
        </div>
      </Link>
      <br />
      <Link to="calculator">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems:"center", border: "1px solid", borderRadius: "5px", padding: "2em", height: "100%" }}>
          <img className='image' src={wardrobe} />
          <div>Калькулятор шкафов</div>
        </div>
      </Link>
    </div>
  </div>
}


