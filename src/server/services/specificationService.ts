import { getFasadSpecification } from "../wardrobes/specifications/fasades.js"
import { CORPUS_SPECS } from "../../types/specification.js"
import { SpecificationItem } from "../../types/specification"
import { Profile, ProfileType } from '../../types/materials.js'
import { SpecificationData, Result } from '../../types/server.js'
import { IMaterialServiceProvider, ISpecificationService, ISpecificationServiceProvider } from '../../types/services.js'
import { DETAIL_NAME, SpecificationMultiResult, SpecificationResult, WARDROBE_KIND, WardrobeData, WardrobeDetailTable } from '../../types/wardrobe.js'
import { getCorpusSpecification} from '../wardrobes/specifications/corpus.js'
import { createFasades } from '../wardrobes/specifications/fasades.js'
import { DVPTableSchema, WardrobeDetailSchema, WardrobeFurnitureTableSchema, WardrobeTableSchema } from '../../types/schemas.js'
import { AppState } from '../../types/app.js'
import { newFasadFromState } from '../../functions/fasades.js'
import { StatusCodes } from 'http-status-codes'
import { getExtComplectSpecification } from "../wardrobes/specifications/extComplect/extComplect.js"
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
  async getSpecData(data: WardrobeData, verbose = false): Promise<Result<SpecificationMultiResult>> {
    if(!this.matProvider) throw new Error('Material service provider not provided')
    const result: SpecificationMultiResult = []
    const profiles = (await this.matProvider.getProfiles()).data
    const profile: Profile | undefined = profiles?.find(p => p.name === data.profileName)
    const fasades = createFasades(data, profile?.type as ProfileType)
    const corpus = await getCorpusSpecification(data, profile as Profile, verbose)
    result.push({ type: CORPUS_SPECS.CORPUS, spec: corpus })
    for(let f of fasades){ 
      const fasadSpec = await getFasadSpecification(f, profile as Profile, verbose)
      result.push({ type: f.Material, spec: fasadSpec })
     }
    const extSpec = await getExtComplectSpecification(data, verbose)
    for(let ext of extSpec){
      result.push(ext)
    }
    return {success: true, status: StatusCodes.OK, data: result}
  }
  async getSpecCombiData(data: AppState, verbose = false): Promise<Result<(SpecificationResult[])[]>> {
    if(!this.matProvider) throw new Error('Material service provider not provided')
    const result: (SpecificationResult[])[] = []
    const profiles = (await this.matProvider.getProfiles()).data
    const profile: Profile | undefined = profiles?.find(p => p.name === data.profile.name)
    if(!profile) return {success: false, status: StatusCodes.BAD_REQUEST, data: result}
    const fasades = data.rootFasadesState.map(r => newFasadFromState(r))
    for (let f of fasades) {
      const fasadSpec = await getFasadSpecification(f, profile  as Profile, verbose)
      //const fasadSpecConverted = flattenSpecification(filterEmptySpecification(fasadSpec))
      result.push(fasadSpec)
    }
    return {success: true, status: StatusCodes.OK, data: result}
  }
  async getDetailTable({ kind, detailName }: { kind: WARDROBE_KIND, detailName?: DETAIL_NAME }): Promise<Result<WardrobeDetailTable[]>> {
    return await this.provider.getDetailTable({ kind, detailName })
  }
  async getDetails(kind: WARDROBE_KIND, width: number, height: number): Promise<WardrobeDetailTable[]> {
    return await this.provider.getDetails(kind, width, height)
}
  async getFurniture(kind: WARDROBE_KIND, name: SpecificationItem, width: number, height: number, depth: number): Promise<WardrobeFurnitureTableSchema | null> {
    return await this.provider.getFurniture(kind, name, width, height, depth)
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

