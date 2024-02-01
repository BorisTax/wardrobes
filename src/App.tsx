import { Dispatch, createContext, useEffect, useReducer, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'
import FasadContainer from './components/FasadContainer'
import Fasad from './classes/Fasad'
import FasadState from './classes/FasadState'
import { Division, FasadMaterial } from './types/enums'
import Header from './components/Header'
import PropertiesBar from './components/PropertiesBar'
import { DIVIDE_FASAD, SET_ACTIVE_FASAD, SET_HEIGHT, SET_MATERIAL, SET_WIDTH, setActiveFasad } from './actions/AppActions'

type AppState = {
  rootFasad: Fasad
  activeFasad: Fasad | null
}

type AppContextType = {
  state: AppState
  dispatch: Dispatch<{ type: string, payload?: any }>
}

const initialState = getInitialState()
export const AppContext = createContext<AppContextType>({ state: initialState, dispatch: () => "" })
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const rootFasad = state.rootFasad
  const activeFasad = state.activeFasad
  // useEffect(() => {
  //   const onClick = () => { dispatch(setActiveFasad(null)) }
  //   document.addEventListener("click", onClick)
  //   return () => { document.removeEventListener("click", onClick) }
  // }, [])
  return (
    <>
      <AppContext.Provider value={{ state, dispatch }}>
        <Header />
        <div className="container-md">
          <div style={{display: "flex", flexWrap: "wrap"}}>
            <PropertiesBar fasad={activeFasad} />
            <FasadContainer rootFasad={rootFasad} />
          </div>
        </div>
      </AppContext.Provider>
    </>
  )
}

export default App

function reducer(state: AppState, action: { type: string, payload?: any }) {
  switch (action.type) {
    case DIVIDE_FASAD:
      state.activeFasad?.divideFasad(action.payload)
      return { ...state }
    case SET_ACTIVE_FASAD:
      state.activeFasad = action.payload
      return { ...state }
    case SET_MATERIAL:
      if (state.activeFasad) state.activeFasad.Material = action.payload
      return { ...state }
    case SET_HEIGHT:
      if (state.activeFasad) state.activeFasad.trySetHeight(action.payload)
      return { ...state }
    case SET_WIDTH:
      if (state.activeFasad) state.activeFasad.trySetWidth(action.payload)
      return { ...state }
  }
  return state
}

function getFasadState(width: number, height: number, division: Division, material: FasadMaterial) {
  const state = new FasadState()
  state.height = height
  state.width = width
  state.division = division
  state.material = material

  return state
}
function getInitialState(): AppState {
  const root = getFasadState(1179, 2243, Division.HEIGHT, FasadMaterial.DSP)
  let children = [getFasadState(1179, 747, Division.HEIGHT, FasadMaterial.DSP), getFasadState(1179, 747, Division.WIDTH, FasadMaterial.MIRROR), getFasadState(1179, 747, Division.HEIGHT, FasadMaterial.DSP)]
  root.children = children
  children = [getFasadState(392.3, 747, Division.WIDTH, FasadMaterial.FMP), getFasadState(392.3, 747, Division.WIDTH, FasadMaterial.MIRROR), getFasadState(392.3, 747, Division.WIDTH, FasadMaterial.SAND)]
  root.children[1].children = children
  const fasad = new Fasad()
  fasad.setState(root)
  return { rootFasad: fasad, activeFasad: null }
}
