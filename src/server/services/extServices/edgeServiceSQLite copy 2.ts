import { Brush, Edge, ExtMaterial, ExtNewMaterial, NewBrush, NewEdge, NewProfile, NewZaglushka, Profile, Zaglushka } from '../../types/materials.js';
import { Results } from '../../types/server.js';
import { IMaterialExtService, IMaterialService, IMaterialServiceProvider } from '../../types/services.js';
import { dataBaseQuery } from '../../functions/other.js';
import messages from '../../messages.js';
export default class EdgeServiceSQLite implements IMaterialExtService<Edge> {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtData(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'edge'`, {successStatusCode: 200})
    }
    async addExtData({ name, dsp, code }: Edge) {
        return dataBaseQuery(this.dbFile, `insert into edge (name, dsp, code) values('${name}', '${dsp}', '${code}');`, {successStatusCode: 201, successMessage: messages.EDGE_ADDED})
    }
    async deleteExtData(name: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM edge WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.EDGE_DELETED})
    }
    async updateExtData({ newName, dsp, code, name }: NewEdge) {
        return dataBaseQuery(this.dbFile, getEdgeQuery({ newName, dsp, code, name }), {successStatusCode: 200, successMessage: messages.EDGE_UPDATED})
    }
    async getZaglushkas(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'zaglushka'`, {successStatusCode: 200})
    }
    async addZaglushka({ name, dsp, code }: Zaglushka) {
        return dataBaseQuery(this.dbFile, `insert into zaglushka (name, dsp, code) values('${name}', '${dsp}', '${code}');`, {successStatusCode: 201, successMessage: messages.ZAGLUSHKA_ADDED})
    }
    async deleteZaglushka(name: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM zaglushka WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.ZAGLUSHKA_DELETED})
    }
    async updateZaglushka({ newName, dsp, code, name }: NewZaglushka) {
        return dataBaseQuery(this.dbFile, getZaglushkaQuery({ newName, dsp, code, name }), {successStatusCode: 200, successMessage: messages.ZAGLUSHKA_UPDATED})
    }
    async getBrushes(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'brush'`, {successStatusCode: 200})
    }
    async addBrush({ name, code }: Brush) {
        return dataBaseQuery(this.dbFile, `insert into brush (name, code) values('${name}', '${code}');`, {successStatusCode: 201, successMessage: messages.BRUSH_ADDED})
    }
    async deleteBrush(name: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM brush WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.BRUSH_DELETED})
    }
    async updateBrush({ newName, code, name }: NewBrush) {
        return dataBaseQuery(this.dbFile, getBrushQuery({ newName, code, name }), {successStatusCode: 200, successMessage: messages.BRUSH_UPDATED})
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