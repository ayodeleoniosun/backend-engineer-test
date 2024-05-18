import {Request, Response} from 'express';
import {create, index, update, show} from '../services/product.service';
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";

export const allProducts = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.OK).json({
            success: true,
            data: await index(res.locals.user)
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            error: error.message,
        })
    }
}

export const store = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.CREATED).json({
            success: true,
            data: await create(req.body, res.locals.user)
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            error: error.message,
        })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.OK).json({
            success: true,
            data: await update(req.params.id, req.body, res.locals.user)
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            error: error.message,
        })
    }
}

export const showProduct = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.OK).json({
            success: true,
            data: await show(req.params.id)
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            error: error.message,
        })
    }
}