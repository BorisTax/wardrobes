
export type StolColorsTableSchema = {
    id: number
    name: string
}
export type StolTableSchema = {
    id: number
    length: number
    amount: number
}
export type IncomeStolTableSchema = StolTableSchema & {
    date: number
    user: string
}
export type OutcomeStolTableSchema = IncomeStolTableSchema

export type MatSkladColorsTableSchema = {
    id: number
    thickId: number
    name: string
}
export type MatSkladThicknessTableSchema = {
    id: number
    name: string
}
export type MatSkladDepartmentTableSchema = {
    id: number
    name: string
}
export type MatSkladTableSchema = {
    id: number
    length: number
    width: number
    count: number
    department: number
}
export type IncomeMatTableSchema = MatSkladTableSchema & {
    date: number
    user: string
}
export type OutcomeMatTableSchema = IncomeMatTableSchema

export enum SKLAD_STOL_TABLE_NAMES {
    STOL_SKLAD = 'stol_sklad',
    STOL_INCOME = 'stol_income',
    STOL_OUTCOME = 'stol_outcome',
    STOL_COLORS = 'stol_colors'
}
export enum SKLAD_TABLE_NAMES {
    MAT_SKLAD = 'mat_sklad',
    MAT_INCOME = 'mat_income',
    MAT_OUTCOME = 'mat_outcome',
    MAT_THICK = 'mat_thick',
    MAT_COLORS = 'materials',
    MAT_DEPART = 'department'
}

