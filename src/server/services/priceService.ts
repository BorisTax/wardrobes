import { PriceListItem, Results } from '../types/server.js'
import { IPriceService, IPriceServiceProvider} from '../types/services.js'


export class PriceService implements IPriceService {
  provider: IPriceServiceProvider
  constructor(provider: IPriceServiceProvider) {
    this.provider = provider
  }
  async getPriceList(): Promise<Results> {
    return await this.provider.getPriceList()
  }
  async updatePriceList(item: PriceListItem) {
    return await this.provider.updatePriceList(item)
  }

}


