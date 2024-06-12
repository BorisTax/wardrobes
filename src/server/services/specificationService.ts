import { filterEmptySpecification, getFasadSpecification } from '../../functions/specification.js'
import { CORPUS_SPECS } from "../../types/specification.js"
import { SpecificationItem } from "../../types/specification"
import { materialsPath } from '../options.js'
import { Brush, Profile, ProfileType } from '../../types/materials.js'
import { SpecificationData, Result } from '../../types/server.js'
import { IMaterialServiceProvider, IPriceServiceProvider, ISpecificationService, ISpecificationServiceProvider } from '../../types/services.js'
import { SpecificationResult, WardrobeData } from '../../types/wardrobe.js'
import { getCorpusSpecification, getWardrobe } from '../wardrobes/specifications/corpus.js'
import { createFasades } from '../wardrobes/specifications/fasades.js'
import BrushServiceSQLite from './extServices/brushServiceSQLite.js'
import { MaterialExtService } from './materialExtService.js'
import { getDVP, getDetails } from '../wardrobes/functions.js'


export class SpecificationService implements ISpecificationService {
  provider: ISpecificationServiceProvider
  matProvider?: IMaterialServiceProvider
  constructor(provider: ISpecificationServiceProvider, matProvider?: IMaterialServiceProvider) {
    this.provider = provider
    this.matProvider = matProvider
  }
  async getSpecList(): Promise<Result<SpecificationData[]>> {
    return this.provider.getSpecList()
}
  async updateSpecList(item: SpecificationData): Promise<Result<null>> {
    return await this.provider.updateSpecList(item)
  }
  async getSpecData(data: WardrobeData): Promise<Result<SpecificationResult>> {
    if(!this.matProvider) throw new Error('Material service provider not provided')
    const result: SpecificationResult = []
    const details = await getDetails(data.wardKind, data.width, data.height, data.depth)
    const dvpData = await getDVP(data.width, data.height, data.depth)
    const dvp = dvpData.dvpLength * dvpData.dvpWidth * dvpData.dvpCount / 1000000
    const wardrobe = getWardrobe(data, details)
    const priceList = (await this.provider.getSpecList()).data || []
    const coefList: Map<SpecificationItem, number> = new Map(priceList.map((p: SpecificationData) => [p.name as SpecificationItem, p.coef as number]))
    const profiles = (await this.matProvider.getProfiles()).data
    const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
    const brushes = (await materialService.getExtData()).data
    const profile: Profile | undefined = profiles?.find(p => p.name === data.profileName)
    const brush: Brush | undefined = brushes?.find(b => b.name === profile?.brush)
    const fasades = createFasades(data, profile?.type as ProfileType)
    result.push({ type: CORPUS_SPECS.CORPUS, spec: [...(filterEmptySpecification(getCorpusSpecification(wardrobe, dvp, profile?.type as ProfileType, coefList))).entries()] })
    fasades.forEach(f => { result.push({ type: f.Material, spec: [...(filterEmptySpecification(getFasadSpecification(f, profile?.type as ProfileType, coefList))).entries()] }) }) 
    return {success: true, status: 200, data: result}
  }

}

