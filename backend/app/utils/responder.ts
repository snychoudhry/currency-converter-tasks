import { Request, Response, NextFunction } from "express";
import { constants } from "../config/constants";

export class Responder {
    constructor(request: Request, response: Response, next: NextFunction, status: boolean, code: number, data: object) {
        return response.status(200).json({
            status: status,
            code: code,
            message: constants[code],
            data: data
        })
    }
}