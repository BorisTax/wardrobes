import { Edge, ExtMaterial, ExtNewMaterial, NewEdge, NewProfile, NewZaglushka, Profile, Zaglushka } from '../types/materials.js';
import { Results } from '../types/server.js';
import { IMaterialServiceProvider } from '../types/services.js';
import { dataBaseQuery } from '../functions/other.js';
import messages from '../messages.js';
export default class MaterialServiceSQLite implements IMaterialServiceProvider {
    dbFile: string;
    constructor(dbFile: string) {
        this.dbFile = dbFile
    }
    async getExtMaterials(): Promise<Results> {
        return dataBaseQuery(this.dbFile, "select * from 'extmaterials' order by material, name;", {successStatusCode: 200})
    }

    async addExtMaterial({ name, material, image, code }: ExtMaterial): Promise<Results> {
        return dataBaseQuery(this.dbFile, `insert into extmaterials (name, material, image, code) values('${name}', '${material}', '${image}', '${code}');`, {successStatusCode: 201, successMessage: messages.MATERIAL_ADDED})
    }

    async updateExtMaterial({ name, material, newName, image, code }: ExtNewMaterial): Promise<Results> {
        return dataBaseQuery(this.dbFile, getQuery({ newName, image, code, name, material }), {successStatusCode: 200, successMessage: messages.MATERIAL_UPDATED})
    }

    async deleteExtMaterial(name: string, material: string): Promise<Results> {
        return dataBaseQuery(this.dbFile, `DELETE FROM extmaterials WHERE name='${name}' and material='${material}';`, {successStatusCode: 200, successMessage: messages.MATERIAL_DELETED})
    }

    async getProfiles(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'profileColors'`, {successStatusCode: 200})
    }
    async addProfile({ name, code, type, brush }: Profile) {
        return dataBaseQuery(this.dbFile, `insert into profilecolors (name, type, code, brush) values('${name}', '${type}', '${code}', '${brush}');`, {successStatusCode: 201, successMessage: messages.PROFILE_ADDED})
    }
    async deleteProfile(name: string, type: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM profilecolors WHERE name='${name}' and type='${type}';`, {successStatusCode: 200, successMessage: messages.PROFILE_DELETED})
    }
    async updateProfile({ newName, code, type, name, brush }: NewProfile) {
        return dataBaseQuery(this.dbFile, getProfileQuery({ newName, code, name, type, brush }), {successStatusCode: 200, successMessage: messages.PROFILE_UPDATED})
    }
    async getEdges(): Promise<Results> {
        return dataBaseQuery(this.dbFile, `select * from 'edge'`, {successStatusCode: 200})
    }
    async addEdge({ name, dsp, code }: Edge) {
        return dataBaseQuery(this.dbFile, `insert into edge (name, dsp, code) values('${name}', '${dsp}', '${code}');`, {successStatusCode: 201, successMessage: messages.EDGE_ADDED})
    }
    async deleteEdge(name: string) {
        return dataBaseQuery(this.dbFile, `DELETE FROM edge WHERE name='${name}';`, {successStatusCode: 200, successMessage: messages.EDGE_DELETED})
    }
    async updateEdge({ newName, dsp, code, name }: NewEdge) {
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
}

function getQuery({ newName, image, code, name, material }: ExtNewMaterial) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (image) parts.push(`image='${image || ""}'`)
    if (code) parts.push(`code='${code}'`)
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

function getZaglushkaQuery({ newName, dsp, code, name }: NewEdge) {
    const parts = []
    if (newName) parts.push(`name='${newName}'`)
    if (code) parts.push(`code='${code}'`)
    if (dsp) parts.push(`dsp='${dsp}'`)
    const query = parts.length > 0 ? `update zaglushka set ${parts.join(', ')} where name='${name}';` : ""
    return query
}