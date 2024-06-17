import { filterEmptySpecification, flattenSpecification, getFasadSpecification } from "../wardrobes/specifications/fasades.js"
import { CORPUS_SPECS, SPEC_GROUP } from "../../types/specification.js"
import { SpecificationItem } from "../../types/specification"
import { materialsPath } from '../options.js'
import { Brush, Profile, ProfileType } from '../../types/materials.js'
import { SpecificationData, Result } from '../../types/server.js'
import { IMaterialServiceProvider, ISpecificationService, ISpecificationServiceProvider } from '../../types/services.js'
import { DETAIL_NAME, SpecificationMultiResult, SpecificationResult, WARDROBE_KIND, WardrobeData, WardrobeDetailTable } from '../../types/wardrobe.js'
import { getCorpusSpecification, getWardrobe } from '../wardrobes/specifications/corpus.js'
import { createFasades } from '../wardrobes/specifications/fasades.js'
import BrushServiceSQLite from './extServices/brushServiceSQLite.js'
import { MaterialExtService } from './materialExtService.js'
import { DVPTableSchema, WardrobeDetailSchema, WardrobeFurnitureTableSchema, WardrobeTableSchema } from '../../types/schemas.js'
import { getDetails } from '../wardrobes/functions.js'
import { AppState } from '../../types/app.js'
import { newFasadFromState } from '../../functions/fasades.js'

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
  async getSpecData(data: WardrobeData): Promise<Result<SpecificationMultiResult>> {
    if(!this.matProvider) throw new Error('Material service provider not provided')
    const result: SpecificationMultiResult = []
    const details = await getDetails(data.wardKind, data.width, data.height, data.depth)
    const wardrobe = getWardrobe(data, details)
    const specList = (await this.provider.getSpecList()).data || []
    const coefList: Map<SpecificationItem, number> = new Map(specList.map((p: SpecificationData) => [p.name as SpecificationItem, p.coef as number]))
    const profiles = (await this.matProvider.getProfiles()).data
    const materialService = new MaterialExtService<Brush>(new BrushServiceSQLite(materialsPath))
    const brushes = (await materialService.getExtData()).data
    const profile: Profile | undefined = profiles?.find(p => p.name === data.profileName)
    const brush: Brush | undefined = brushes?.find(b => b.name === profile?.brush)
    const fasades = createFasades(data, profile?.type as ProfileType)
    const corpus = await getCorpusSpecification(wardrobe, data, profile?.type as ProfileType, coefList)
    const corpusConverted = flattenSpecification(filterEmptySpecification(corpus))
    result.push({ type: CORPUS_SPECS.CORPUS, spec: corpusConverted })
    for(let f of fasades){ 
      const fasadSpec = await getFasadSpecification(f, profile?.type as ProfileType, coefList)
      const fasadSpecConverted = flattenSpecification(filterEmptySpecification(fasadSpec))
      result.push({ type: f.Material, spec: fasadSpecConverted })
     }
    return {success: true, status: 200, data: result}
  }
  async getSpecCombiData(data: AppState): Promise<Result<(SpecificationResult[])[]>> {
    if(!this.matProvider) throw new Error('Material service provider not provided')
    const result: (SpecificationResult[])[] = []
    const specList = (await this.provider.getSpecList()).data || []
    const coefList: Map<SpecificationItem, number> = new Map(specList.map((p: SpecificationData) => [p.name as SpecificationItem, p.coef as number]))
    const profiles = (await this.matProvider.getProfiles()).data
    const profile: Profile | undefined = profiles?.find(p => p.name === data.profile.name)
    const fasades = data.rootFasadesState.map(r => newFasadFromState(r))
    for (let f of fasades) {
      const fasadSpec = await getFasadSpecification(f, profile?.type as ProfileType, coefList)
      const fasadSpecConverted = flattenSpecification(filterEmptySpecification(fasadSpec))
      result.push(fasadSpecConverted)
    }
    return {success: true, status: 200, data: result}
  }
  async getDetailTable({ kind, detailName }: { kind: WARDROBE_KIND, detailName?: DETAIL_NAME }): Promise<Result<WardrobeDetailTable[]>> {
    return await this.provider.getDetailTable({ kind, detailName })
  }
  async getDVPTemplates(): Promise<Result<DVPTableSchema[]>> {
    return await this.provider.getDVPTemplates()
  }
  async getDetailNames(): Promise<Result<WardrobeDetailSchema[]>> {
    return await this.provider.getDetailNames()
  }
  async getFurnitureTable({ kind, item }: { kind: WARDROBE_KIND, item?: SpecificationItem }): Promise<Result<WardrobeFurnitureTableSchema[]>>{
    return await this.provider.getFurnitureTable({ kind, item })
  }
  async getWardobeKinds(): Promise<Result<WardrobeTableSchema[]>>{
    return await this.provider.getWardobeKinds()
  }
}

