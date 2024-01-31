import { useState } from 'react'
import './App.scss'
import FasadContainer from './components/FasadContainer'
import Fasad from './classes/Fasad'
import FasadState from './classes/FasadState'
import { Division, FasadMaterial } from './types/enums'

function App() {
  const [rootFasadState, setCount] = useState(getInitialState())
  const fasad = new Fasad()
  fasad.setState(rootFasadState)

  return (
    <div className="App">
      <FasadContainer rootFasad={fasad} />
    </div>
  )
}

export default App

function getFasadState(width: number, height: number, division: Division, material: FasadMaterial) {
  const state = new FasadState()
  state.height = height
  state.width = width
  state.division = division
  state.material = material

  return state
}
function getInitialState() {
  const root = getFasadState(1179, 2243, Division.HEIGHT, FasadMaterial.DSP)
  let children = [getFasadState(1179, 747, Division.HEIGHT, FasadMaterial.DSP), getFasadState(1179, 747, Division.WIDTH, FasadMaterial.MIRROR), getFasadState(1179, 747, Division.HEIGHT, FasadMaterial.DSP)]
  root.children = children
  children = [getFasadState(392.3, 747, Division.WIDTH, FasadMaterial.FMP), getFasadState(392.3, 747, Division.WIDTH, FasadMaterial.MIRROR), getFasadState(392.3, 747, Division.WIDTH, FasadMaterial.SAND)]
  root.children[1].children = children
  return root
}
