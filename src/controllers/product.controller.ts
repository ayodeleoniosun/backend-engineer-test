import {Request, Response} from 'express';
import {create, destroy, index, myProducts, show, update} from '../services/product.service';
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";
import {SuccessMessages} from "../utils/enums/success.messages";

export const allProducts = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.OK).json({
            success: true,
            message: SuccessMessages.PRODUCTS_RETRIEVED,
            data: await index()
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}

export const userProducts = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.OK).json({
            success: true,
            message: SuccessMessages.PRODUCTS_RETRIEVED,
            data: await myProducts(res.locals.user.id)
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}

export const store = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.CREATED).json({
            success: true,
            message: SuccessMessages.PRODUCT_CREATED,
            data: await create(req.body, res.locals.user.id),
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.OK).json({
            success: true,
            message: SuccessMessages.PRODUCT_UPDATED,
            data: await update(req.params.id, req.body, res.locals.user.id)
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}

export const showProduct = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.OK).json({
            success: true,
            message: SuccessMessages.PRODUCT_RETRIEVED,
            data: await show(req.params.id)
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await destroy(req.params.id, res.locals.user.id);

        return res.status(StatusCodesEnum.OK).json({
            success: true,
            message: SuccessMessages.PRODUCT_DELETED
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}