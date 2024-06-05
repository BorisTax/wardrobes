import { Brush, Edge, ExtMaterial, ExtNewMaterial, NewBrush, NewEdge, NewProfile, NewZaglushka, Profile, Zaglushka } from '../../types/materials.js';
import { Result, Results } from '../../types/server.js';
import { IMaterialService, IMaterialServiceProvider } from '../../types/services.js';
import { dataBaseQuery } from '../functions/other.js';
import messages from '../messages.js';
export default class MaterialServiceSQLite implements IMaterialService {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtMaterials(): Promise<Result<ExtMaterial[]>> {
        return dataBaseQuery(this.dbFile, "select * from 'extmaterials' order by material, name;", {successStatusCode: 200})
    }

    async addExtMaterial({ name, material, image, code, purpose }: ExtMaterial): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into extmaterials (name, material, image, code, purpose) values('${name}', '${material}', '${image}', '${code}', '${purpose}');`, {successStatusCode: 201, successMessage: messages.MATERIAL_ADDED})
    }

    async updateExtMaterial({ name, material, newName, image, code, purpose }: ExtNewMaterial): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getQuery({ newName, image, code, name, material, purpose }), {successStatusCode: 200, successMessage: messages.MATERIAL_UPDATED})
    }

    async deleteExtMaterial(name: string, material: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM extmaterials WHERE name='${name}' and material='${material}';`, {successStatusCode: 200, successMessage: messages.MATERIAL_DELETED})
    }

    async getProfiles(): Promise<Result<Profile[]>> {
        return dataBaseQuery(this.dbFile, `select * from 'profileColors'`, {successStatusCode: 200})
    }
    async addProfile({ name, code, type, brush }: Profile): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `insert into profilecolors (name, type, code, brush) values('${name}', '${type}', '${code}', '${brush}');`, {successStatusCode: 201, successMessage: messages.PROFILE_ADDED})
    }
    async deleteProfile(name: string, type: string): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, `DELETE FROM profilecolors WHERE name='${name}' and type='${type}';`, {successStatusCode: 200, successMessage: messages.PROFILE_DELETED})
    }
    async updateProfile({ newName, code, type, name, brush }: NewProfile): Promise<Result<null>> {
        return dataBaseQuery(this.dbFile, getProfileQuery({ newName, code, name, type, brush }), {successStatusCode: 200, successMessage: messages.PROFILE_UPDATED})
    }
}

function getQuery({ newName, image, code, name, material, purpose }: ExtNewMaterial) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (image) parts.push(`image='${image || ""}'`)
    if (code) parts.push(`code='${code}'`)
    if (purpose) parts.push(`purpose='${purpose}'`)
    const query = parts.length > 0 ? `update extmaterials set ${parts.join(', ')} where name='${name}' and material='${material}';` : ""
    return query
}

function getProfileQuery({ newName, code, name, type, brush }: NewProfile) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    if (type) parts.push(`type='${type}'`)
    if (brush) parts.push(`brush='${brush}'`)
    const query = parts.length > 0 ? `update profilecolors set ${parts.join(', ')} where name='${name}';` : ""
    return query
}

function getEdgeQuery({ newName, dsp, code, name }: NewEdge) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    if (dsp) parts.push(`dsp='${dsp}'`)
    const query = parts.length > 0 ? `update edge set ${parts.join(', ')} where name='${name}';` : ""
    return query
}

function getBrushQuery({ newName, code, name }: NewBrush) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    const query = parts.length > 0 ? `update brush set ${parts.join(', ')} where name='${name}';` : ""
    return query
}
function getZaglushkaQuery({ newName, dsp, code, name }: NewEdge) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    if (dsp) parts.push(`dsp='${dsp}'`)
    const query = parts.length > 0 ? `update zaglushka set ${parts.join(', ')} where name='${name}';` : ""
    return query
}