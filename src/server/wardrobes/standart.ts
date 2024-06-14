import { DETAIL_NAME, Detail } from "../../types/wardrobe";
import { IWardrobe, WardrobeData } from "../../types/wardrobe";
import { getKarton, getLegs, getNails, getSamorez16 } from "./functions";

export default class StandartWardrobe implements IWardrobe {
    private details: Detail[] = []
    private width: number
    private depth: number
    private height: number
    private section: number = 1
    private dvpWidth: number = 0
    private dvpLength: number = 0
    private dvpCount: number = 0
    private dvpPlanka: number = 0
    private dvpPlankaCount: number = 0
    private tube: number = 0
    private tubeCount: number = 0
    private trempel: number = 0
    private trempelCount: number = 0
    constructor(data: WardrobeData, details: Detail[]) {
        this.width = data.width
        this.depth = data.depth
        this.height = data.height
        this.details = [...details]
        this.calcTruba()
        this.calcTrempel()
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


    private calcTruba() {
        if (this.depth < 500) return
        const sizes = [
            { width: 2200, value: 1 },
            { width: 2500, value: 2 },
            { width: 2600, value: 1 },
            { width: 2700, value: 3 },
            { width: 3001, value: 2 },
        ]
        this.tubeCount = sizes.find((s => s.width > this.width))?.value || 0
        this.tube = this.details.find(d => d.name === DETAIL_NAME.SHELF_PLAT)?.length || 0
    };
    private calcTrempel() {
        if (this.depth >= 500) return
        const sizes = [
            { width: 1400, value: 1 },
            { width: 2600, value: 2 },
            { width: 2700, value: this.height < 2200 ? 3 : 4 },
            { width: 3001, value: 2 },
        ]
        this.trempelCount = sizes.find((s => s.width > this.width))?.value || 0
        this.trempel = this.depth <= 400 ? 250 : 300
    };
}