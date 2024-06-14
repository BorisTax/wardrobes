import { WardrobeDetailSchema } from '../../types/schemas.js';
import { Result } from '../../types/server.js';
import { IWardrobeDetailTableService } from '../../types/services.js'
import { DETAIL_NAME, WARDROBE_KIND, WardrobeDetailTable } from '../../types/wardrobe.js'
import { dataBaseQuery } from '../functions/other.js'
import { WARDROBE_TABLE_NAMES } from '../functions/other.js';
const { DETAIL_TABLE, DVP_TEMPLATES, DETAILS } = WARDROBE_TABLE_NAMES

export class WardrobeDetailTableService implements IWardrobeDetailTableService {
  dbFile: string;
  constructor(dbFile: string) {
      this.dbFile = dbFile
  }
  async getDetailTable({ kind, detailName }: { kind: WARDROBE_KIND, detailName?: DETAIL_NAME }): Promise<Result<WardrobeDetailTable[]>> {
    const query = detailName !== undefined ? `select * from ${DETAIL_TABLE} where wardrobe='${kind}' and name='${detailName}';` : `select * from ${DETAIL_TABLE} where wardrobe='${kind}';`
    return dataBaseQuery<WardrobeDetailTable[]>(this.dbFile, query, { successStatusCode: 200 }) 
  }
  async getDVPTemplates(): Promise<Result<{width: number, length: number}[]>> {
    return dataBaseQuery(this.dbFile, `select * from ${DVP_TEMPLATES};` , { successStatusCode: 200 }) 
  }
  async getDetailNames(): Promise<Result<WardrobeDetailSchema[]>> {
    return dataBaseQuery(this.dbFile, `select * from ${DETAILS};`, { successStatusCode: 200 }) 
  }
}

