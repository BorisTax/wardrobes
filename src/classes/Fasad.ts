// import { FasadOuterEdges } from "../types/edges"
// import { Division, FASAD_TYPE } from "../types/enums"
// import { FasadProps } from "../types/fasadProps"
// import FasadState, { FasadBackImageProps, getInitialBackImageProps } from "./FasadState"

// export default class Fasad {
//     private active = false
//     private materialId: number
//     private fasadType: FASAD_TYPE
//     private division = Division.HEIGHT
//     private outerRightEdge = true
//     private outerLeftEdge = true
//     private outerTopEdge = true
//     private outerBottomEdge = true
//     public Children: FasadState[]
//     private width = 0
//     private height = 0
//     private widthRatio: number
//     private heightRatio: number
//     private fWidth = false
//     private fHeight = false
//     public Parent: FasadState | null = null
//     private level = 0
//     private backImageProps: FasadBackImageProps
//     constructor(props: FasadProps = {}) {
//         this.width = props?.width || 0
//         this.height = props?.height || 0
//         this.widthRatio = 1
//         this.heightRatio = 1
//         this.materialId = props?.materialId || -1
//         this.fasadType = props.fasadType || FASAD_TYPE.DSP
//         this.Children = []
//         this.OuterEdges = { left: true, right: true, top: true, bottom: true }
//         this.backImageProps = getInitialBackImageProps()
//     }

//     public getState(): FasadState {
//         const state: FasadState = new FasadState()
//         state.active = this.active
//         state.level = this.level
//         state.division = this.division
//         state.width = this.width
//         state.height = this.height
//         state.widthRatio = this.widthRatio
//         state.heightRatio = this.heightRatio
//         state.fixedWidth = this.fWidth
//         state.fixedHeight = this.fHeight
//         state.materialId = this.materialId
//         state.fasadType = this.fasadType
//         state.backImageProps = { ...this.backImageProps }
//         state.outerEdges = { left: this.outerLeftEdge, right: this.outerRightEdge, top: this.outerTopEdge, bottom: this.outerBottomEdge }
//         state.children = []
//         for (const c of this.Children) state.children.push(c.getState())
//         return state
//     }
//     public setState(state: FasadState, keepOriginalMaterial = false) {
//         this.level = state.level
//         this.active = state.active
//         this.width = state.width
//         this.height = state.height
//         this.widthRatio = state.widthRatio
//         this.heightRatio = state.heightRatio
//         this.fWidth = state.fixedWidth
//         this.fHeight = state.fixedHeight
//         if (!keepOriginalMaterial) {
//             this.materialId = state.materialId
//             this.fasadType = state.fasadType
//         }
//         this.division = state.division
//         this.OuterEdges = { ...state.outerEdges }
//         this.backImageProps = { ...state.backImageProps }
//         this.Children = state.children.map((s: FasadState) => {
//             const f: FasadState = newFasadFromState(s, keepOriginalMaterial)
//             f.Parent = this
//             return f
//         })
//     }
//     public set BackImageProps(value: FasadBackImageProps){
//         this.backImageProps = { ...value }
//     }
//     public get BackImageProps(): FasadBackImageProps {
//         return this.backImageProps
//     }
//     public get MaterialId() {
//         return this.materialId
//     }
//     public get FasadType() {
//         return this.fasadType
//     }
//     public setMaterialId(value: number, toChildren = true) {
//         this.materialId = value
//         if (!toChildren) return
//         for (const f of this.Children) {
//             f.setMaterialId(value, toChildren)
//         }
//     }
//     public setFasadType(value: FASAD_TYPE, toChildren = true) {
//         this.fasadType = value
//         if (!toChildren) return
//         for (const f of this.Children) {
//             f.setFasadType(value, toChildren)
//         }
//     }
//     public get Width() {
//         return this.width
//     }
//     public set Width(value: number) {
//         this.width = value
//     }
//     public get Height() {
//         return this.height
//     }
//     public set Height(value: number) {
//         this.height = value
//     }
//     public get WidthRatio() {
//         return this.widthRatio
//     }
//     public set WidthRatio(value: number) {
//         this.widthRatio = value || 1
//     }
//     public get HeightRatio() {
//         return this.heightRatio
//     }
//     public set HeightRatio(value: number) {
//         this.heightRatio = value || 1
//     }
//     public fixWidth(value: boolean, toChildren = true) {
//         this.fWidth = value
//         if (!toChildren) return
//         if (this.Division === Division.HEIGHT) this.Children.forEach((c: FasadState) => { c.fixWidth(value, toChildren) })
//     }
//     public FixedWidth(): boolean {
//         return this.fWidth || (this.Division === Division.HEIGHT && this.Children.some((f: FasadState) => f.FixedWidth()))
//     }
//     public fixHeight(value: boolean, toChildren = true) {
//         this.fHeight = value
//         if (!toChildren) return
//         if (this.Division === Division.WIDTH) this.Children.forEach((c: FasadState) => { c.fixHeight(value, toChildren) })
//     }
//     public FixedHeight(): boolean {
//         return this.fHeight || (this.Division === Division.WIDTH && this.Children.some((f: FasadState) => f.FixedHeight()))
//     }
//     public get cutWidth() {
//         return this.width - (this.fasadType === FASAD_TYPE.DSP ? 0 : 3)
//     }
//     public get cutHeight() {
//         return this.height - (this.fasadType === FASAD_TYPE.DSP ? 0 : 3)
//     }
//     public get Division() {
//         return this.division
//     }
//     public set Division(value: Division) {
//         this.division = value
//     }
//     public get OuterEdges() {
//         return { left: this.outerLeftEdge, right: this.outerRightEdge, top: this.outerTopEdge, bottom: this.outerBottomEdge }
//     }
//     public set OuterEdges(edges: FasadOuterEdges) {
//         const { left, right, top, bottom } = edges
//         if (right !== undefined) this.outerRightEdge = right
//         if (left !== undefined) this.outerLeftEdge = left
//         if (top !== undefined) this.outerTopEdge = top
//         if (bottom !== undefined) this.outerBottomEdge = bottom
//     }
//     public get Active() {
//         return this.active
//     }
//     public set Active(value: boolean) {
//         this.active = value
//     }
//     public getActiveFasad(): FasadState | null {
//         if (this.active) return this
//         let active: FasadState | null = null
//         this.Children.forEach((c: FasadState) => { active = c.getActiveFasad() || active })
//         return active
//     }
//     public setActiveFasad(fasad: FasadState | null) {
//         this.Children.forEach((c: FasadState) => { c.setActiveFasad(fasad) })
//         this.active = (this === fasad)
//     }

//     public divideFasad(count: number, minSize: number) {
//         if (this.Division === Division.HEIGHT) return this.divideOnHeight(count, minSize); else return this.divideOnWidth(count, minSize)
//     }
//     public divideOnHeight(count: number, minSize: number): boolean {
//         const profileTotal = (count - 1)
//         if (this.Children.length > 1) this.setMaterialId(this.Children[0].MaterialId)
//         const partHeight = +((this.Height - profileTotal) / count).toFixed(1)
//         if (partHeight < minSize) return false
//         const partLast = +(this.height - partHeight * (count - 1) - profileTotal).toFixed(1)
//         this.Children = []
//         if (count === 1) return true
//         for (let i = 1; i <= count; i++) {
//             const part = i < count ? partHeight : partLast
//             const fasad: FasadState = new FasadState({ width: this.width, height: part, minSize, fasadType: this.FasadType, materialId: this.materialId}) 
//             const topEdge = i === 1 ? this.outerTopEdge : false
//             const bottomEdge = i === count ? this.outerBottomEdge : false
//             fasad.OuterEdges = { left: this.outerLeftEdge, right: this.outerRightEdge, top: topEdge, bottom: bottomEdge }
//             fasad.Parent = this
//             fasad.Level = this.level + 1
//             fasad.Division = Division.WIDTH
//             this.Children.push(fasad)
//         }
//         return true
//     }
//     public divideOnWidth(count: number, minSize: number): boolean {
//         const profileTotal = (count - 1)
//         if (this.Children.length > 1) this.setMaterialId(this.Children[0].MaterialId)
//         const partWidth = +((this.width - profileTotal) / count).toFixed(1)
//         if (partWidth < minSize) return false
//         this.Children = []
//         if (count === 1) return true
//         for (let i = 1; i <= count; i++) {
//             const fasad: FasadState = new FasadState({ width: partWidth, height: this.height, minSize, fasadType: this.FasadType, materialId: this.materialId }) 
//             const leftEdge = i === 1 ? this.outerLeftEdge : false
//             const rightEdge = i === count ? this.outerRightEdge : false
//             fasad.OuterEdges = { left: leftEdge, right: rightEdge, top: this.outerTopEdge, bottom: this.outerBottomEdge }
//             fasad.Parent = this
//             fasad.Level = this.level + 1
//             fasad.Division = Division.HEIGHT
//             this.Children.push(fasad)
//         }
//         return true
//     }
//     public DistributePartsOnWidth(initiator: FasadState | null, newWidth: number, useSameWidth: boolean, minSize: number): boolean {
//         if (this.Children.length === 0) return true
//         let totalFixedWidth = 0
//         let totalFreeWidth = 0
//         let totalFreeCount = 0
//         let partFreeWidth = 0
//         let lastFreeIndex = 0
//         let totalRatio = 0
//         const profile = 1
//         let i = 0
//         if (!useSameWidth) {
//             for (const c of this.Children) {
//                 i = i + 1
//                 if (c.FixedWidth() && !(c === initiator)) totalFixedWidth = totalFixedWidth + c.width
//                 if (c === initiator) totalFixedWidth = totalFixedWidth + newWidth
//                 if ((!c.FixedWidth()) && !(c === initiator)) {
//                     totalFreeCount = totalFreeCount + 1
//                     lastFreeIndex = i
//                     totalRatio += c.WidthRatio
//                 }
//                 if (i < this.Children.length) {
//                     totalFixedWidth = totalFixedWidth + profile
//                 }
//             }
//             if (totalFreeCount === 0) return false
//             totalFreeWidth = this.width - totalFixedWidth

//         }
//         let part = 0
//         i = 0
//         let sumFreeWidth = 0
//         for (const c of this.Children) {
//             i = i + 1
//             if (c.FixedWidth()) part = c.width
//             if (c === initiator) part = newWidth
//             if (!c.FixedWidth() && !(c === initiator)) {
//                 partFreeWidth = +((totalFreeWidth * (c.WidthRatio / totalRatio)).toFixed(1))
//                 let partLastWidth = +(totalFreeWidth - sumFreeWidth).toFixed(1)
//                 if (partFreeWidth < minSize) return false               
//                 part = lastFreeIndex === i ? partLastWidth : partFreeWidth
//                 sumFreeWidth += partFreeWidth 
//             }
//             if (useSameWidth) part = c.width
//             c.width = part
//             c.height = this.height
//             if (c.Children.length > 1) {
//                 let res: boolean
//                 if (c.Division === Division.HEIGHT) res = c.DistributePartsOnHeight(null, 0, useSameWidth, minSize); else res = c.DistributePartsOnWidth(null, 0, useSameWidth, minSize)
//                 if (!res) return false
//             }
//         }
//         return true
//     }

//     public DistributePartsOnHeight(initiator: FasadState | null, newHeight: number, useSameHeight: boolean, minSize: number): boolean {
//         if (this.Children.length === 0) return true
//         let totalFixedHeight = 0
//         let totalFreeHeight = 0
//         let totalFreeCount = 0
//         let partFreeHeight = 0
//         let lastFreeIndex = 0
//         let totalRatio = 0
//         const profile = 1
//         let i = 0
//         if (!useSameHeight) {
//             for (const c of this.Children) {
//                 i = i + 1
//                 if (c.FixedHeight() && !(c === initiator)) totalFixedHeight = totalFixedHeight + c.height
//                 if (c === initiator) totalFixedHeight = totalFixedHeight + newHeight
//                 if ((!c.FixedHeight()) && !(c === initiator)) {
//                     totalFreeCount = totalFreeCount + 1
//                     lastFreeIndex = i
//                     totalRatio += c.HeightRatio
//                 }
//                 if (i < this.Children.length) {
//                     totalFixedHeight = totalFixedHeight + profile
//                 }
//             }
//             if (totalFreeCount === 0) return false
//             totalFreeHeight = this.height - totalFixedHeight

//         }
//         let part = 0
//         i = 0
//         let sumFreeHeight = 0
//         for (const c of this.Children) {
//             i = i + 1
//             if (c.FixedHeight()) part = c.height
//             if (c === initiator) part = newHeight
//             if (!c.FixedHeight() && !(c === initiator)) {
//                 partFreeHeight = +((totalFreeHeight * (c.HeightRatio / totalRatio)).toFixed(1))
//                 if (partFreeHeight < minSize) return false
//                 let partLastHeight = +(totalFreeHeight - sumFreeHeight).toFixed(1)
//                 part = lastFreeIndex === i ? partLastHeight : partFreeHeight
//                 sumFreeHeight += partFreeHeight
//             }
//             if (useSameHeight) part = c.height
//             c.height = part
//             c.width = this.width
//             if (c.Children.length > 1) {
//                 let res: boolean
//                 if (c.Division === Division.WIDTH) res = c.DistributePartsOnWidth(null, 0, useSameHeight, minSize); else res = c.DistributePartsOnHeight(null, 0, useSameHeight, minSize)
//                 if (!res) return false
//             }
//         }
//         return true
//     }
//     public set Level(value: number) {
//         this.level = value
//     }
//     public get Level(): number {
//         return this.level
//     }

// }