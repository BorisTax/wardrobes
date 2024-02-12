export type ExtMaterial = {
    name: string
    material: string
    imageurl: string
    code: string 
}
export type ExtNewMaterial = ExtMaterial & {
    newName: string
}
export type Profile = {
    name: string
    type: ProfileType
    code: string
}

export enum ProfileType {
    STANDART = 'STANDART',
    BAVARIA = 'BAVARIA'
}