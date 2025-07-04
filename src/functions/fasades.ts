import FasadState from "../classes/FasadState"
import { Division, FASAD_TYPE } from "../types/enums"

export function trySetWidth(fasad: FasadState | null, rootFasades: FasadState[], width: number, minSize: number): boolean {
    if (!fasad) return false
    if (getFasadFixedWidth(fasad)) return false
    if (width < minSize) return false
    const parent = fasad.parent
    if (!parent) {
        fasad.width = width;
        return fasad.division === Division.HEIGHT
            ? DistributePartsOnHeight(fasad, null, 0, false, minSize)
            : DistributePartsOnWidth(fasad, null, 0, false, minSize);
    }

    if (parent.division === Division.HEIGHT)
        return trySetWidth(parent, rootFasades, width, minSize);
    else
        return DistributePartsOnWidth(parent, fasad, width, false, minSize)
}

export function trySetHeight(fasad: FasadState | null, rootFasades: FasadState[], height: number, minSize: number): boolean {
    if (!fasad) return false
    if (getFasadFixedHeight(fasad)) return false
    if (height < minSize) return false
    const parent = fasad.parent
    if (!parent) {
        fasad.height = height;
        return fasad.division === Division.HEIGHT
            ? DistributePartsOnHeight(fasad, null, 0, false, minSize)
            : DistributePartsOnWidth(fasad, null, 0, false, minSize);
    }
    if (parent.division === Division.WIDTH) {
        return trySetHeight(parent, rootFasades, height, minSize)
    }
    else
        return DistributePartsOnHeight(parent, fasad, height, false, minSize) || false
}

export function getFasadState(width: number, height: number, division: Division, fasadType: FASAD_TYPE, materialId: number) {
    const state = new FasadState()
    state.height = height
    state.width = width
    state.division = division
    state.fasadType = fasadType
    state.materialId = materialId
    return state
}

export function getRootFasad(fasad: FasadState, rootFasades: FasadState[]): FasadState {
    const parent = fasad.parent
    if (parent) return getRootFasad(parent, rootFasades)
    return fasad
}
export function hasFasadImage(fasad: FasadState){
    return fasad.fasadType === FASAD_TYPE.FMP || fasad.fasadType === FASAD_TYPE.SAND
}

export function isFasadExist(root: FasadState, fasad?: FasadState): boolean{
    if(root === fasad) return true
    return root.children.some(c => isFasadExist(c, fasad))
}

export function getTotalFasadWidthRatio(fasadParent: FasadState | undefined): number {
    let total = 0
    if (!fasadParent || fasadParent.division === Division.HEIGHT) return total
    for (let c of fasadParent.children) {
        if (!getFasadFixedWidth(c)) total += c.widthRatio
    }
    return total
}

export function getTotalFasadHeightRatio(fasadParent: FasadState | undefined): number {
    let total = 0
    if (!fasadParent || fasadParent.division === Division.WIDTH) return total
    for (let c of fasadParent.children) {
        if (!getFasadFixedHeight(c)) total += c.heightRatio
    }
    return total
}


export function fixFasadWidth(fasad: FasadState, value: boolean, toChildren = true) {
    fasad.fixedWidth = value
    if (!toChildren) return
    if (fasad.division === Division.HEIGHT) fasad.children.forEach((f: FasadState) => { fixFasadWidth(f, value, toChildren) })
}
export function getFasadFixedWidth(fasad: FasadState): boolean {
    return fasad.fixedWidth || (fasad.division === Division.HEIGHT && fasad.children.some((f: FasadState) => getFasadFixedWidth(f)))
}
export function fixFasadHeight(fasad: FasadState, value: boolean, toChildren = true) {
    fasad.fixedHeight = value
    if (!toChildren) return
    if (fasad.division === Division.WIDTH) fasad.children.forEach((c: FasadState) => { fixFasadHeight(c, value, toChildren) })
}
export function getFasadFixedHeight(fasad: FasadState): boolean {
    return fasad.fixedHeight || (fasad.division === Division.WIDTH && fasad.children.some((f: FasadState) => getFasadFixedHeight(f)))
}

export function getFasadCutWidth(fasad: FasadState | undefined) {
    if(!fasad) return 0
    return fasad.width - (fasad.fasadType === FASAD_TYPE.DSP ? 0 : 3)
}
export function getFasadCutHeight(fasad: FasadState | undefined) {
    if(!fasad) return 0
    return fasad.height - (fasad.fasadType === FASAD_TYPE.DSP ? 0 : 3)
}

export function setFasadMaterialId(fasad: FasadState, value: number, toChildren = true) {
    fasad.materialId = value
    if (!toChildren) return
    for (const f of fasad.children) {
        setFasadMaterialId(f, value, toChildren)
    }
}

export function setFasadType(fasad: FasadState, value: FASAD_TYPE, toChildren = true) {
    fasad.fasadType = value
    if (!toChildren) return
    for (const f of fasad.children) {
        setFasadType(f, value, toChildren)
    }
}

export function updateFasadParents(fasad: FasadState) {
    fasad.children.forEach(c => {
        c.parent = fasad
        updateFasadParents(c)
    })
}   

export function cloneFasad(fasad: FasadState): FasadState {
    function clone(fasad: FasadState): FasadState {
        const f = new FasadState()
        f.children = fasad.children.map((c: FasadState) => cloneFasad(c))
        f.active = fasad.active
        f.level = fasad.level
        f.division = fasad.division
        setFasadMaterialId(f, fasad.materialId, false)
        setFasadType(f, fasad.fasadType, false)
        f.height = fasad.height
        f.width = fasad.width
        f.widthRatio = fasad.widthRatio
        f.heightRatio = fasad.heightRatio
        fixFasadHeight(f, fasad.fixedHeight, false)
        fixFasadWidth(f, fasad.fixedWidth, false)
        f.outerEdges = { ...fasad.outerEdges }
        return f
    }
    const newFasad = clone(fasad)
    updateFasadParents(newFasad)
    return newFasad
}


export function excludeFasadParent(fasad: FasadState): Omit<FasadState, 'parent'> {
    const { parent, children, ...other } = fasad
    const newFasad = {
        ...other,
        children: children.map(c => excludeFasadParent(c))
    }
    return newFasad
}
export function stringifyFasad(fasad: FasadState) {
    return JSON.stringify(excludeFasadParent(fasad))
}

export function DistributePartsOnWidth(fasad: FasadState, initiator: FasadState | null, newWidth: number, useSameWidth: boolean, minSize: number): boolean {
    if (fasad.children.length === 0) return true
    let totalFixedWidth = 0
    let totalFreeWidth = 0
    let totalFreeCount = 0
    let partFreeWidth = 0
    let lastFreeIndex = 0
    let totalRatio = 0
    const profile = 1
    let i = 0
    if (!useSameWidth) {
        for (const c of fasad.children) {
            i = i + 1
            if (getFasadFixedWidth(c) && !(c === initiator)) totalFixedWidth = totalFixedWidth + c.width
            if (c === initiator) totalFixedWidth = totalFixedWidth + newWidth
            if ((!getFasadFixedWidth(c)) && !(c === initiator)) {
                totalFreeCount = totalFreeCount + 1
                lastFreeIndex = i
                totalRatio += c.widthRatio
            }
            if (i < fasad.children.length) {
                totalFixedWidth = totalFixedWidth + profile
            }
        }
        if (totalFreeCount === 0) return false
        totalFreeWidth = fasad.width - totalFixedWidth

    }
    let part = 0
    i = 0
    let sumFreeWidth = 0
    for (const c of fasad.children) {
        i = i + 1
        if (getFasadFixedWidth(c)) part = c.width
        if (c === initiator) part = newWidth
        if (!getFasadFixedWidth(c) && !(c === initiator)) {
            partFreeWidth = +((totalFreeWidth * (c.widthRatio / totalRatio)).toFixed(1))
            let partLastWidth = +(totalFreeWidth - sumFreeWidth).toFixed(1)
            if (partFreeWidth < minSize) return false               
            part = lastFreeIndex === i ? partLastWidth : partFreeWidth
            sumFreeWidth += partFreeWidth 
        }
        if (useSameWidth) part = c.width
        c.width = part
        c.height = fasad.height
        if (c.children.length > 1) {
            let res: boolean
            if (c.division === Division.HEIGHT) res = DistributePartsOnHeight(c, null, 0, useSameWidth, minSize); else res = DistributePartsOnWidth(c, null, 0, useSameWidth, minSize)
            if (!res) return false
        }
    }
    return true
}

export function DistributePartsOnHeight(fasad: FasadState, initiator: FasadState | null, newHeight: number, useSameHeight: boolean, minSize: number): boolean {
    if (fasad.children.length === 0) return true
    let totalFixedHeight = 0
    let totalFreeHeight = 0
    let totalFreeCount = 0
    let partFreeHeight = 0
    let lastFreeIndex = 0
    let totalRatio = 0
    const profile = 1
    let i = 0
    if (!useSameHeight) {
        for (const c of fasad.children) {
            i = i + 1
            if (getFasadFixedHeight(c) && !(c === initiator)) totalFixedHeight = totalFixedHeight + c.height
            if (c === initiator) totalFixedHeight = totalFixedHeight + newHeight
            if ((!getFasadFixedHeight(c)) && !(c === initiator)) {
                totalFreeCount = totalFreeCount + 1
                lastFreeIndex = i
                totalRatio += c.heightRatio
            }
            if (i < fasad.children.length) {
                totalFixedHeight = totalFixedHeight + profile
            }
        }
        if (totalFreeCount === 0) return false
        totalFreeHeight = fasad.height - totalFixedHeight

    }
    let part = 0
    i = 0
    let sumFreeHeight = 0
    for (const c of fasad.children) {
        i = i + 1
        if (getFasadFixedHeight(c)) part = c.height
        if (c === initiator) part = newHeight
        if (!getFasadFixedHeight(c) && !(c === initiator)) {
            partFreeHeight = +((totalFreeHeight * (c.heightRatio / totalRatio)).toFixed(1))
            if (partFreeHeight < minSize) return false
            let partLastHeight = +(totalFreeHeight - sumFreeHeight).toFixed(1)
            part = lastFreeIndex === i ? partLastHeight : partFreeHeight
            sumFreeHeight += partFreeHeight
        }
        if (useSameHeight) part = c.height
        c.height = part
        c.width = fasad.width
        if (c.children.length > 1) {
            let res: boolean
            if (c.division === Division.WIDTH) res = DistributePartsOnWidth(c, null, 0, useSameHeight, minSize); else res = DistributePartsOnHeight(c, null, 0, useSameHeight, minSize)
            if (!res) return false
        }
    }
    return true
}


export function getActiveFasad(fasades: FasadState[]): FasadState[] {
    const active = []
    for(let f of fasades){
        if(f.active) active.push(f)
        getActiveFasad(f.children).forEach(a => active.push(a))
    }
    return active
}

export function setActiveFasad(fasades: FasadState[], activeFasad: FasadState | undefined, multiple: boolean) {
    fasades.forEach(f => {
        if (f.children.length > 0) setActiveFasad(f.children, activeFasad, multiple)
        const ok = (activeFasad === f)
        f.active = multiple ? (f.active || ok) && f.children.length === 0 : ok
    })
}

export function divideFasad(fasad: FasadState, count: number, minSize: number) {
    if (fasad.division === Division.HEIGHT) return divideOnHeight(fasad, count, minSize); else return divideOnWidth(fasad, count, minSize)
}

function divideOnHeight(fasad: FasadState, count: number, minSize: number): boolean {
    const profileTotal = (count - 1)
    if (fasad.children.length > 1) {
        setFasadType(fasad, fasad.children[0].fasadType)
        setFasadMaterialId(fasad, fasad.children[0].materialId)
    }

    const partHeight = +((fasad.height - profileTotal) / count).toFixed(1)
    if (partHeight < minSize) return false
    const partLast = +(fasad.height - partHeight * (count - 1) - profileTotal).toFixed(1)
    fasad.children = []
    if (count === 1) return true
    for (let i = 1; i <= count; i++) {
        const part = i < count ? partHeight : partLast
        const newFasad: FasadState = getFasadState(fasad.width, part, fasad.division === Division.HEIGHT ? Division.WIDTH : Division.HEIGHT, fasad.fasadType, fasad.materialId) 
        const topEdge = i === 1 ? fasad.outerEdges.top : false
        const bottomEdge = i === count ? fasad.outerEdges.bottom : false
        newFasad.outerEdges = { left: fasad.outerEdges.left, right: fasad.outerEdges.right, top: topEdge, bottom: bottomEdge }
        newFasad.parent = fasad
        newFasad.level = fasad.level + 1
        newFasad.division = Division.WIDTH
        fasad.children.push(newFasad)
    }
    return true
}
function divideOnWidth(fasad: FasadState, count: number, minSize: number): boolean {
    const profileTotal = (count - 1)
    if (fasad.children.length > 1) {
        setFasadType(fasad, fasad.children[0].fasadType)
        setFasadMaterialId(fasad, fasad.children[0].materialId)
    }
    const partWidth = +((fasad.width - profileTotal) / count).toFixed(1)
    if (partWidth < minSize) return false
    const partLast = +(fasad.width - partWidth * (count - 1) - profileTotal).toFixed(1)
    fasad.children = []
    if (count === 1) return true
    for (let i = 1; i <= count; i++) {
        const part = i < count ? partWidth : partLast
        const newFasad: FasadState = getFasadState(part, fasad.height, fasad.division === Division.HEIGHT ? Division.WIDTH : Division.HEIGHT, fasad.fasadType, fasad.materialId) 
        const leftEdge = i === 1 ? fasad.outerEdges.left : false
        const rightEdge = i === count ? fasad.outerEdges.right : false
        newFasad.outerEdges = { left: leftEdge, right: rightEdge, top: fasad.outerEdges.top, bottom: fasad.outerEdges.bottom }
        newFasad.parent = fasad
        newFasad.level = fasad.level + 1
        newFasad.division = Division.HEIGHT
        fasad.children.push(newFasad)
    }
    return true
}

export function hasSameParent(fasades: FasadState[]):boolean{
    if (fasades.length === 0) return false
    return fasades.every(f => f.parent === fasades[0].parent)
}