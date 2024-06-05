import { DetailNames } from "../../types/enums";
import { IWardrobe, WardrobeData } from "../../types/wardrobe";
import { getKarton, getLegs, getNails, getSamorez16 } from "./functions";
import { DetailNamesCaptions } from "./names";
import { WardrobeDetail } from "./types";

export default class StandartWardrobe implements IWardrobe {
    private details: WardrobeDetail[] = []
    private width: number
    private depth: number
    private height: number
    private offset: number
    private section: number = 1
    private roof: number = 0
    private stand: number = 0
    private innerStand: number = 0
    private pillar: number = 0
    private shelf: number = 0
    private shelfPlat: number = 0
    private standCount: number = 0
    private innerStandCount: number = 0
    private pillarCount: number = 0
    private shelfCount: number = 0
    private shelfPlatCount: number = 0
    private dvpWidth: number = 0
    private dvpLength: number = 0
    private dvpCount: number = 0
    private dvpRealWidth: number = 0
    private dvpRealLength: number = 0
    private dvpPlanka: number = 0
    private dvpPlankaCount: number = 0
    private tube: number = 0
    private tubeCount: number = 0
    private trempel: number = 0
    private trempelCount: number = 0
    constructor(data: WardrobeData) {
        this.width = data.width
        this.depth = data.depth
        this.height = data.height
        this.offset = 100
        this.calcDSP()
        this.calcDVP()
        this.calcTruba()
        this.calcTrempel()
    }
    public getDetails(){
        return this.details
    };
    public getDSP(offset: number = 100){
        return ((this.roof * this.section * 2 + this.stand * 2) * this.depth + 
            (this.innerStand * this.innerStandCount + this.shelf * this.shelfCount + this.shelfPlat * this.shelfPlatCount + this.pillar * this.pillarCount) * (this.depth - offset)) / 1000000
    };
    public getDVP() {
        return (this.dvpLength * this.dvpWidth * this.dvpCount) / 1000000
    }
    public getDVPPlanka() {
        return (this.dvpPlanka * this.dvpPlankaCount) / 1000
    }
    public getEdge2(){
        return (this.roof * 2 * this.section + this.stand * 2) / 1000
    };
    public getEdge05(){
        return (this.innerStand * this.innerStandCount + this.shelf * this.shelfCount + this.shelfPlat * this.shelfPlatCount + this.pillar * this.pillarCount) / 1000
    };
    public getConfirmat(){
        return (this.shelfCount + this.shelfPlatCount) * 4 + this.pillarCount * 2
    };
    public getMinifix(){
        return (this.standCount + this.innerStandCount) * 4 + this.pillarCount * 2
    };
    public getLegs() {
        return getLegs(this.width)
    };
    public getKarton(){
        return getKarton(this.width, this.height)
    }
    public getNails(){
        return getNails(this.width)
    }
    public getSamorez16(){
        return getSamorez16(this.width)
    };
    public getStyagka(){
        return this.section === 2 ? 3 : 0
    };
    public getTruba(){
        return { length: this.tube / 1000, count: this.tubeCount }
    };
    public getTrempel(){
        return { length: this.trempel, count: this.trempelCount }
    };
    public getNaprav(){
        return (this.width - 32) / 1000
    };
    public getGlue(){
        return (this.getEdge2() + this.getEdge05()) * 0.008
    };
    private calcDSP() {
        this.section = this.width > 2750 ? 2 : 1
        this.roof = this.width / this.section
        this.details.push({ name: DetailNamesCaptions[DetailNames.WARDROBE_ROOF], length: this.roof, width: this.depth, count: this.section * 2 })
        this.standCount = 2
        this.details.push({ name: DetailNamesCaptions[DetailNames.WARDROBE_STAND], length: this.roof, width: this.depth, count: this.standCount })
        this.calcInnerStand()
        this.calcShelves()
    };
    private calcInnerStand() {
        const sizes = [
            { width: 3001, value: 4 },
            { width: 2800, value: 3 },
            { width: 2700, value: 2 },
            { width: 1900, value: 1 },
        ]
        this.innerStandCount = sizes.findLast((s => s.width > this.width))?.value || 0
        this.innerStand = this.height - 62
        this.details.push({ name: DetailNamesCaptions[DetailNames.WARDROBE_INNER_STAND], length: this.innerStand, width: this.depth - this.offset, count: this.innerStandCount })
    };
    private calcShelves() {
        const sizes = [
            { width: 3001, countLess: 8, countGreater: 10, length: 600, blocks: 2 },
            { width: 2700, countLess: 5, countGreater: 7, length: 600, blocks: 1 },
            { width: 2600, countLess: 8, countGreater: 10, length: 600, blocks: 2 },
            { width: 2500, countLess: 4, countGreater: 5, length: 600, blocks: 1 },
            { width: 2200, countLess: 8, countGreater: 10, length: 390, blocks: 2 },
            { width: 1900, countLess: 4, countGreater: 5, length: 600, blocks: 1 },
            { width: 1700, countLess: 4, countGreater: 5, length: 390, blocks: 1 },
        ]
        const sizesPlat = [
            { width: 3001, countLess: 2, countGreater: 3, blocks: 2 },
            { width: 2700, countLess: 1, countGreater: 2, blocks: 1 },
            { width: 2500, countLess: 2, countGreater: 4, blocks: 2 },
            { width: 2200, countLess: 1, countGreater: 2, blocks: 1 },
            { width: 1900, countLess: 1, countGreater: 2, blocks: 1 },
        ]
        const sizesPillar = [
            { width: 3001, countLess: 0, countGreater: 0 },
            { width: 2700, countLess: 1, countGreater: 2 },
            { width: 2500, countLess: 0, countGreater: 0 },
            { width: 2200, countLess: 1, countGreater: 2 },
            { width: 1350, countLess: 0, countGreater: 0 },
        ]
        const found = sizes.findLast((s => s.width > this.width)) || { width: 0, countLess: 0, countGreater: 0, length: 0, blocks: 1 }
        const foundPlat = sizesPlat.findLast((s => s.width > this.width)) || { width: 0, countLess: 0, countGreater: 0, blocks: 1 }
        this.shelfCount = (this.height < 2300 ? found?.countLess : found?.countGreater) || 0
        this.shelf = found?.length || 0
        if (this.shelfCount > 0) this.details.push({ name: DetailNamesCaptions[DetailNames.WARDROBE_SHELF], length: this.shelf, width: this.depth - this.offset, count: this.shelfCount })
        this.shelfPlatCount = (this.height < 2200 ? foundPlat?.countLess : foundPlat?.countGreater) || 0
        this.shelfPlat = (this.width - this.innerStandCount * 16 - 32 - this.shelf * found?.blocks) / foundPlat?.blocks
        if (this.shelfPlatCount > 0) this.details.push({ name: DetailNamesCaptions[DetailNames.WARDROBE_SHELFPLAT], length: this.shelfPlat, width: this.depth - this.offset, count: this.shelfPlatCount })
        const foundPillar = sizesPillar.findLast((s => s.width > this.width)) || { width: 0, countLess: 0, countGreater: 0 }
        this.pillarCount = (this.height < 2200 ? foundPillar.countLess : foundPillar.countGreater)
        this.pillar = this.pillarCount ? 282 : 0
        if (this.pillarCount > 0) this.details.push({ name: DetailNamesCaptions[DetailNames.WARDROBE_PILLAR], length: this.pillar, width: this.depth - this.offset, count: this.pillarCount })
    }
    private calcDVP(){
        const dvpLayers = [
            {count: 3, width: 789},
            {count: 4, width: 591},
            {count: 5, width: 472},
            {count: 6, width: 393},
            {count: 7, width: 337},
            {count: 8, width: 295},
        ]
        const dvpTemplates592 = [1100, 1200, 1300, 1400, 1500, 1600, 1800, 2000, 2400, 2800]
        const dvpTemplates393 = [1800, 2000]
        const found = dvpLayers.find(d => d.width <= this.depth) || {count: 1, width: this.stand }
        this.dvpRealWidth = found.width
        this.dvpRealLength = this.roof - 3 
        const length592 = dvpTemplates592.find(t => t >= this.dvpRealLength)
        const length393 = dvpTemplates393.find(t => t >= this.dvpRealLength)
        if (found.width <= 393 && length393) {
            this.dvpWidth = 393
            this.dvpLength = length393
        } else {
            this.dvpWidth = 592
            this.dvpLength = length592 || 0 
        }   
        this.dvpCount = found.count
        this.dvpPlanka = this.roof - 32
        this.dvpPlankaCount = this.section === 1 ? (this.dvpCount - 1) : (this.dvpCount / 2 - 1) * 2 
    }
    private calcTruba() {
        if (this.depth < 500) return
        const sizes = [
            { width: 3001, value: 2 },
            { width: 2700, value: 3 },
            { width: 2600, value: 1 },
            { width: 2500, value: 2 },
            { width: 2200, value: 1 },
        ]
        this.tubeCount = sizes.findLast((s => s.width > this.width))?.value || 0
        this.tube = this.shelfPlat
    };
    private calcTrempel() {
        if (this.depth >= 500) return
        const sizes = [
            { width: 3001, value: 2 },
            { width: 2700, value: this.height < 2200 ? 3 : 4 },
            { width: 2600, value: 2 },
            { width: 1400, value: 1 },
        ]
        this.trempelCount = sizes.findLast((s => s.width > this.width))?.value || 0
        this.trempel = this.depth <= 400 ? 250 : 300
    };
}