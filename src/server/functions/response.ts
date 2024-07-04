import { StatusCodes } from "http-status-codes";

export function forbidResponse(message: string){
    return { success: false, status: StatusCodes.FORBIDDEN, message }
}
export function conflictResponse(message: string){
    return { success: false, status: StatusCodes.CONFLICT, message }
}
export function badRequestResponse(message: string){
    return { success: false, status: StatusCodes.BAD_REQUEST, message }
}