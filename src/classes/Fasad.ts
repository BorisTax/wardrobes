import { FasadOuterEdges } from "../types/edges"
import { Division, FasadMaterial, SandBase } from "../types/enums"
import { FasadBackup, FasadProps } from "../types/fasadProps"
import FasadState from "./FasadState"

export default class Fasad {
    private active: boolean = false
    private material: FasadMaterial = FasadMaterial.DSP
    private extMaterial: string = ''
    private sandBase: SandBase = SandBase.MIRROR
    private division: Division = Division.HEIGHT
    private outerRightEdge: boolean = false
    private outerLeftEdge: boolean = false
    private outerTopEdge: boolean = false
    private outerBottomEdge: boolean = false
    public Children: Fasad[]
    private width: number = 0
    private height: number = 0
    private fixedWidth: boolean = false
    private fixedHeight: boolean = false
    public Parent: Fasad | null = null
    private minSize: number
    private backup: FasadBackup = {}
    constructor(props: FasadProps = {}) {
        this.width = props?.width || 0
        this.height = props?.height || 0
        this.minSize = props?.minSize || 100
        this.material = props?.material || FasadMaterial.DSP
        this.extMaterial = props?.extMaterial || ""
        this.sandBase = props?.sandBase || SandBase.MIRROR
        this.backup.hasBackup = false
        this.Children = []
        this.OuterEdges = { left: true, right: true, top: true, bottom: true }
    }

    public getState(): FasadState {
        const state = new FasadState()
        state.division = this.division
        state.width = this.width
        state.height = this.height
        state.fixedWidth = this.fixedWidth
        state.fixedHeight = this.fixedHeight
        state.material = this.material
        state.extMaterial = this.extMaterial
        state.sandBase = this.sandBase
        state.children = []
        for (let c of this.Children) state.children.push(c.getState())
        return state
    }
    public setState(state: FasadState) {
        this.width = state.width
        this.height = state.height
        this.fixedWidth = state.fixedWidth
        this.fixedHeight = state.fixedHeight
        this.material = state.material
        this.extMaterial = state.extMaterial
        this.sandBase = state.sandBase
        this.division = state.division
        this.Children = []
        if (state.children.length !== 0) {
            if (this.division === Division.HEIGHT) this.divideOnHeight(state.children.length); else this.divideOnWidth(state.children.length)
            let i = 0
            for (let c of state.children) {
                this.Children[i].setState(c)
                i = i + 1
            }
            if (this.division === Division.HEIGHT) this.DistributePartsOnHeight(null, 0, true); else this.DistributePartsOnWidth(null, 0, true)
        }
    }
    public get Material() {
        return this.material
    }
    public setMaterial(value: FasadMaterial, toChildren: boolean = true) {
        this.material = value
        if (!toChildren) return
        for (let f of this.Children) {
            f.setMaterial(value, toChildren)
        }
    }
    public setExtMaterial(value: string, toChildren: boolean = true) {
        this.extMaterial = value
        if (!toChildren) return
        for (let f of this.Children) {
            f.setExtMaterial(value, toChildren)
        }
    }
    public get ExtMaterial() {
        return this.extMaterial
    }
    public setSandBase(value: SandBase, toChildren: boolean = true) {
        this.sandBase = value
        if (!toChildren) return
        for (let f of this.Children) {
            f.setSandBase(value, toChildren)
        }
    }
    public get Width() {
        return this.width
    }
    public set Width(value: number) {
        this.width = value
    }
    public get Height() {
        return this.height
    }
    public set Height(value: number) {
        this.height = value
    }
    public fixWidth(value: boolean) {
        this.fixedWidth = value
        if (this.Division === Division.HEIGHT) this.Children.forEach((c: Fasad) => { c.fixWidth(value) })
    }
    public FixedWidth() {
        return this.fixedWidth
    }
    public fixHeight(value: boolean) {
        this.fixedHeight = value
        if (this.Division === Division.WIDTH) this.Children.forEach((c: Fasad) => { c.fixHeight(value) })
    }
    public FixedHeight() {
        return this.fixedHeight
    }
    public get cutWidth() {
        return this.width - (this.material === FasadMaterial.DSP ? 0 : 3)
    }
    public get cutHeight() {
        return this.height - (this.material === FasadMaterial.DSP ? 0 : 3)
    }
    public get Division() {
        return this.division
    }
    public set Division(value: Division) {
        this.division = value
    }
    public get OuterEdges() {
        return { left: this.outerLeftEdge, right: this.outerRightEdge, top: this.outerTopEdge, bottom: this.outerBottomEdge }
    }
    public set OuterEdges(edges: FasadOuterEdges) {
        const { left, right, top, bottom } = edges
        if (right !== undefined) this.outerRightEdge = right
        if (left !== undefined) this.outerLeftEdge = left
        if (top !== undefined) this.outerTopEdge = top
        if (bottom !== undefined) this.outerBottomEdge = bottom
    }
    public get MinSize() {
        return this.minSize
    }
    public set MinSize(value: number) {
        this.minSize = value
    }
    public get Active() {
        return this.active
    }
    public set Active(value: boolean) {
        this.active = value
    }
    public getActiveFasad(): Fasad | null {
        if (this.active) return this
        let active: Fasad | null = null
        this.Children.forEach((c: Fasad) => { active = c.getActiveFasad() || active })
        return active
    }
    public setActiveFasad(fasad: Fasad | null) {
        this.Children.forEach((c: Fasad) => { c.setActiveFasad(fasad) })
        this.active = (this === fasad)
    }
    public makeBackup() {
        if (this.Children.length > 1) {
            for (let c of this.Children) c.makeBackup
        }
        this.backup = {
            width: this.width,
            height: this.height,
            material: this.material,
            hasBackup: true
        }
    }
    public restore() {
        if (this.Children.length > 1) {
            for (let c of this.Children) c.restore()
        }
        if (!this.backup.hasBackup) return
        if (this.backup.width) this.width = this.backup.width
        if (this.backup.height) this.height = this.backup.height
        if (this.backup.material) this.material = this.backup.material
        this.backup.hasBackup = false
    }

    public divideFasad(count: number) {
        if (this.Division === Division.HEIGHT) return this.divideOnHeight(count); else return this.divideOnWidth(count)
    }
    public divideOnHeight(count: number): boolean {
        const profileTotal = (count - 1)
        const division = Division.HEIGHT
        if (this.Children.length > 1) this.setMaterial(this.Children[0].Material)
        const partHeight = +((this.Height - profileTotal) / count).toFixed(1)
        if (partHeight < this.minSize) return false
        const partLast = +(this.height - partHeight * (count - 1) - profileTotal).toFixed(1)
        this.Children = []
        if (count === 1) return true
        for (let i = 1; i <= count; i++) {
            const part = i < count ? partHeight : partLast
            const fasad: Fasad = new Fasad({ width: this.width, height: part, minSize: this.minSize, material: this.material, extMaterial: this.extMaterial, sandBase: this.sandBase }) //fasadManager.CreateFasad(sContainer, FasadWidth, part)
            const topEdge = i === 1 ? this.outerTopEdge : false
            const bottomEdge = i === count ? this.outerBottomEdge : false
            fasad.OuterEdges = { left: this.outerLeftEdge, right: this.outerRightEdge, top: topEdge, bottom: bottomEdge }
            fasad.Parent = this
            fasad.Division = Division.WIDTH
            this.Children.push(fasad)
        }
        return true
    }
    public divideOnWidth(count: number): boolean {
        const profileTotal = (count - 1)
        const division = Division.WIDTH
        if (this.Children.length > 1) this.setMaterial(this.Children[0].Material)
        const partWidth = +((this.width - profileTotal) / count).toFixed(1)
        if (partWidth < this.minSize) return false
        const partLast = +(this.width - partWidth * (count - 1) - profileTotal).toFixed(1)
        this.Children = []
        if (count === 1) return true
        for (let i = 1; i <= count; i++) {
            const part = i < count ? partWidth : partLast
            const fasad: Fasad = new Fasad({ width: partWidth, height: this.height, minSize: this.minSize, material: this.material, extMaterial: this.extMaterial, sandBase: this.sandBase }) //fasadManager.CreateFasad(sContainer, FasadWidth, part)
            const leftEdge = i === 1 ? this.outerLeftEdge : false
            const rightEdge = i === count ? this.outerRightEdge : false
            fasad.OuterEdges = { left: leftEdge, right: rightEdge, top: this.outerTopEdge, bottom: this.outerBottomEdge }
            fasad.Parent = this
            fasad.Division = Division.HEIGHT
            this.Children.push(fasad)
        }
        return true
    }
    public DistributePartsOnWidth(initiator: Fasad | null, newWidth: number, useSameWidth: boolean): boolean {
        let totalFixedWidth = 0
        let totalFreeWidth = 0
        let totalFreeCount = 0
        let partFreeWidth = 0
        let partLastWidth = 0
        let lastFreeIndex = 0
        const profile = 1
        let i = 0
        if (!useSameWidth) {
            for (let c of this.Children) {
                i = i + 1
                if (c.fixedWidth && !(c === initiator)) totalFixedWidth = totalFixedWidth + c.width
                if (c === initiator) totalFixedWidth = totalFixedWidth + newWidth
                if ((!c.fixedWidth) && !(c === initiator)) {
                    totalFreeCount = totalFreeCount + 1
                    lastFreeIndex = i
                }
                if (i < this.Children.length) {
                    totalFixedWidth = totalFixedWidth + profile
                }
            }
            if (totalFreeCount === 0) return false
            totalFreeWidth = this.width - totalFixedWidth
            partFreeWidth = +((totalFreeWidth / totalFreeCount).toFixed(1))
            partLastWidth = +(totalFreeWidth - partFreeWidth * (totalFreeCount - 1)).toFixed(1)
            if (partFreeWidth < this.minSize || partLastWidth < this.minSize) return false
        }
        let part = 0
        i = 0
        for (let c of this.Children) {
            i = i + 1
            if (c.fixedWidth) part = c.width
            if (c === initiator) part = newWidth
            if (!c.fixedWidth && !(c === initiator)) part = lastFreeIndex = i ? partLastWidth : partFreeWidth
            if (useSameWidth) part = c.width
            if (!useSameWidth) c.backup
            c.width = part
            c.height = this.height
            if (c.Children.length > 1) {
                let res: boolean
                if (c.Division === Division.HEIGHT) res = c.DistributePartsOnHeight(null, 0, useSameWidth); else res = c.DistributePartsOnWidth(null, 0, useSameWidth)
                if (!res) return false
            }
        }
        return true
    }

    public DistributePartsOnHeight(initiator: Fasad | null, newHeight: number, useSameHeight: boolean): boolean {
        let totalFixedHeight = 0
        let totalFreeHeight = 0
        let totalFreeCount = 0
        let partFreeHeight = 0
        let partLastHeight = 0
        let lastFreeIndex = 0
        const profile = 1
        let i = 0
        if (!useSameHeight) {
            for (let c of this.Children) {
                i = i + 1
                if (c.fixedHeight && !(c === initiator)) totalFixedHeight = totalFixedHeight + c.height
                if (c === initiator) totalFixedHeight = totalFixedHeight + newHeight
                if ((!c.fixedHeight) && !(c === initiator)) {
                    totalFreeCount = totalFreeCount + 1
                    lastFreeIndex = i
                }
                if (i < this.Children.length) {
                    totalFixedHeight = totalFixedHeight + profile
                }
            }
            if (totalFreeCount === 0) return false
            totalFreeHeight = this.height - totalFixedHeight
            partFreeHeight = +((totalFreeHeight / totalFreeCount).toFixed(1))
            partLastHeight = +(totalFreeHeight - partFreeHeight * (totalFreeCount - 1)).toFixed(1)
            if (partFreeHeight < this.minSize || partLastHeight < this.minSize) return false
        }
        let part = 0
        i = 0
        for (let c of this.Children) {
            i = i + 1
            if (c.fixedHeight) part = c.height
            if (c === initiator) part = newHeight
            if (!c.fixedHeight && !(c === initiator)) part = lastFreeIndex = i ? partLastHeight : partFreeHeight
            if (useSameHeight) part = c.height
            if (!useSameHeight) c.backup
            c.height = part
            c.width = this.width
            if (c.Children.length > 1) {
                let res: boolean
                if (c.Division === Division.WIDTH) res = c.DistributePartsOnWidth(null, 0, useSameHeight); else res = c.DistributePartsOnHeight(null, 0, useSameHeight)
                if (!res) return false
            }
        }
        return true
    }


    public clone(parent: Fasad | null = null): Fasad {
        let fasad = new Fasad()
        fasad.Children = this.Children.map((c: Fasad) => c.clone(fasad))
        fasad.Active = this.Active
        fasad.Division = this.division
        fasad.setExtMaterial(this.extMaterial, false)
        fasad.setMaterial(this.material, false)
        fasad.Height = this.height
        fasad.Width = this.width
        fasad.fixHeight(this.fixedHeight)
        fasad.fixWidth(this.fixedWidth)
        fasad.OuterEdges = { ...this.OuterEdges }
        fasad.Parent = parent
        fasad.setSandBase(this.sandBase, false)
        fasad.MinSize = this.minSize
        return fasad
    }
}