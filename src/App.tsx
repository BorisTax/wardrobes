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
import './styles/navbar.scss'
import combi from './images/combi.png';
import wardrobe from './images/wardrobe.png';

import Header from './components/Header'
import { createToolTip } from './functions/functions'
import LoginDialog from './components/dialogs/LoginDialog'
const EditMaterialDialog = lazy(() => import('./components/dialogs/EditDataBaseDialog'))
import { userAtom } from './atoms/users'
import MessageDialog from './components/dialogs/MessageDialog'
import ConfirmDialog from './components/dialogs/ConfirmDialog'
import { combiStateAtom, loadInitialCombiStateAtom, loadVersionAtom, saveToStorageAtom } from './atoms/app'
import EditUsersDialog from './components/dialogs/editUserDialogs/EditUsersDialog'
import CopyFasadDialog from './components/dialogs/CopyFasadDialog'
import FasadTemplatesDialog from './components/dialogs/FasadTemplatesDialog'
const CombiFasades = lazy(() => import('./components/CombiFasades'))
const WardrobeCalculator = lazy(() => import('./components/WardrobeCalculator'))
import VerboseDataDialog from './components/dialogs/VerboseDataDialog'
import NavBar from './components/NavBar'
import LoadIndicator from './components/LoadIndicator'
import Decoration from './components/decoration/Decoration'
import Settings from './components/Settings'
import { RESOURCE } from './types/user'
import NotifyMessage from './components/dialogs/NotifyMessage'
const Sklad = lazy(() => import('./components/Sklad/Sklad'))
function App() {
  const user = useAtomValue(userAtom)
  const setAppData = useSetAtom(combiStateAtom)
  const loadVersion = useSetAtom(loadVersionAtom)
  const loadInitialAppState = useSetAtom(loadInitialCombiStateAtom)
  const saveToStorage = useSetAtom(saveToStorageAtom)
  useEffect(() => {

    loadInitialAppState()
    loadVersion()
  }, [user.name])
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
        <Decoration />
        <Header />
        <div className='d-flex flex-nowrap'>
          {user.name && <NavBar />}
          <Suspense fallback={<LoadIndicator />}>
            <Routes>
              <Route path="/" element={<></>} />
              <Route path="/login" element={<LoginDialog />} />
              {user.permissions.get(RESOURCE.COMBIFASADES)?.Read ? <Route path="/combi" element={<CombiFasades />} /> : <></>}
              {user.permissions.get(RESOURCE.WARDROBES)?.Read ? <Route path="/calculator" element={<WardrobeCalculator />} /> : <></>}
              {user.permissions.get(RESOURCE.SKLAD_STOL)?.Read ? <Route path="/sklad_stol" element={<Sklad />} /> : <></>}
              {user.permissions.get(RESOURCE.MATERIALS_DB)?.Read ? <Route path="/materials" element={<EditMaterialDialog />} /> : <></>}
              {user.permissions.get(RESOURCE.USERS)?.Read ? <Route path="/users" element={<EditUsersDialog />} /> : <></>}
              {user.permissions.get(RESOURCE.SETTINGS)?.Read ? <Route path="/settings" element={<Settings />} /> : <></>}
            </Routes>
          </Suspense>
        </div>
        <CopyFasadDialog />
        <FasadTemplatesDialog />
        <VerboseDataDialog />
        <MessageDialog />
        <ConfirmDialog />
        <NotifyMessage />
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


