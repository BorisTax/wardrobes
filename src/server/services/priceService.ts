import { Result, PriceData } from '../../types/server.js'
import { IPriceService, IPriceServiceProvider} from '../../types/services.js'


export class PriceService implements IPriceService {
  provider: IPriceServiceProvider
  constructor(provider: IPriceServiceProvider) {
    this.provider = provider
  }
  async getPriceList(): Promise<Result<PriceData[]>> {
    return await this.provider.getPriceList()
  }
  async updatePriceList(item: PriceData): Promise<Result<null>> {
    return await this.provider.updatePriceList(item)
  }

}


