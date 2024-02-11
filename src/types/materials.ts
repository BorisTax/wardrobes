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
    profile: string
    code: string
}