import { useEffect, useMemo, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/App.scss'
import './styles/buttons.scss'
import FasadContainer from './components/FasadContainer'
import Header from './components/Header'
import PropertiesBar from './components/PropertiesBar'
import { createToolTip } from './functions/functions'
import LoginDialog from './components/LoginDialog'
import WardrobePropertiesBar from './components/WardrobePropertiesBar'
import { Provider, useAtom, useSetAtom } from 'jotai'
import { setActiveFasadAtom } from './atoms/fasades'

function App() {
  const setActiveFasad = useSetAtom(setActiveFasadAtom)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
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
      <Provider>
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
          <LoginDialog dialogRef={dialogRef} />
      </Provider>
    </>
  )
}

export default App




