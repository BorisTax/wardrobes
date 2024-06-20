export enum PropertyType {
    NUMBER = 'NUMBER',
    POSITIVE_NUMBER = 'POSITIVE_NUMBER',
    INTEGER_POSITIVE_NUMBER = 'INTEGER_POSITIVE_NUMBER',
    BOOL = 'BOOL',
    STRING = 'STRING',
};
export enum InputType {
    TEXT = 'TEXT',
    CHECKBOX = 'CHECKBOX',
    LIST = 'LIST',
    FILE = 'FILE',
    IMAGE = 'IMAGE', 
};
export const RegExp = new Map<string, RegExp>()

RegExp.set(PropertyType.NUMBER, /^-?\d+\.?\d*$/)
RegExp.set(PropertyType.INTEGER_POSITIVE_NUMBER, /^[0-9]{1}\d*$/)
RegExp.set(PropertyType.POSITIVE_NUMBER, /^\d+\.?\d*$/)
RegExp.set(PropertyType.STRING, /.*/)