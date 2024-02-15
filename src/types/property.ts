export enum PropertyType {
    NUMBER = 'NUMBER',
    POSITIVE_NUMBER = 'POSITIVE_NUMBER',
    INTEGER_POSITIVE_NUMBER = 'INTEGER_POSITIVE_NUMBER',
    BOOL = 'BOOL',
    STRING = 'STRING',
    INPUT = 'INPUT',
    LIST = 'LIST'
};
export const RegExp = new Map<string, RegExp>()

RegExp.set(PropertyType.NUMBER, /^-?\d+\.?\d*$/)
RegExp.set(PropertyType.INTEGER_POSITIVE_NUMBER, /^[1-9]{1}\d*$/)
RegExp.set(PropertyType.POSITIVE_NUMBER, /^\d+\.?\d*$/)
RegExp.set(PropertyType.STRING, /.*/)