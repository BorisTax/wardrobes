export type Template = {
    name: string
    data: string
}

export type NewTemplate = Template & {
    newName: string
}
