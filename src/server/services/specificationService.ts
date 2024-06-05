import { filterEmptySpecification, getFasadSpecification } from '../../functions/specification.js'
import { SpecificationItem } from '../../types/enums.js'
import { materialsPath } from '../options.js'
import { Brush, Profile, ProfileType } from '../../types/materials.js'
import { PriceListItem, Result, Results } from '../../types/server.js'
import { IMaterialExtServiceProvider, IMaterialServiceProvider, IPriceService, IPriceServiceProvider, ISpecificationService } from '../../types/services.js'
import { SpecificationResult, WardrobeData } from '../../types/wardrobe.js'
import { getCorpusSpecification, getWardrobe } from '../wardrobes/specifications/corpus.js'
import { createFasades } from '../wardrobes/specifications/fasades.js'
import BrushServiceSQLite from './extServices/brushServiceSQLite.js'
import { MaterialExtService } from './materialExtService.js'


export class SpecificationService implements ISpecificationService {
  priceProvider: IPriceServiceProvider
  matProvider: IMaterialServiceProvider
  constructor(priceProvider: IPriceServiceProvider, matProvider: IMaterialServiceProvider) {
    this.priceProvider = priceProvider
    this.matProvider = matProvider
  }
  async getSpecList(data: WardrobeData): Promise<Result<SpecificationResult>> {
    const result: SpecificationResult = {
      corpus: {},
      fasades: [],
      extComplect: {
        telescope: {},
        console: {},
        blinder: {},
        shelf: {},
        shelfPlat: {},
        pillar: {},
        stand: {},
        truba: {},
        trempel: {},
        light: {},
    }
    }
    const wardrobe = getWardrobe(data)
    const priceList = (await this.priceProvider.getPriceList()).data || []
    const coefList: Map<SpecificationItem, number> = new Map(priceList.map((p: PriceListItem) => [p.name as SpecificationItem, p.coef as number]))
    const profiles = (await this.matProvider.getProfiles()).data
    const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
    const brushes = (await materialService.getExtData()).data
    const profile: Profile | undefined = profiles?.find(p => p.name === data.profileName)
    const brush: Brush | undefined = brushes?.find(b => b.name === profile?.brush)
    const fasades = createFasades(data, profile?.type as ProfileType)
    result.corpus = Object.fromEntries(filterEmptySpecification(getCorpusSpecification(wardrobe, profile?.type as ProfileType, coefList)))
    result.fasades = fasades.map(f => Object.fromEntries(filterEmptySpecification(getFasadSpecification(f, profile?.type as ProfileType, coefList))))

    return {success: true, status: 200, data: result}
  }

}

