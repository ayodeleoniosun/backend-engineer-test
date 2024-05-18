import {Request, Response} from 'express';
import {createProduct} from '../services/product.service';
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";

export const store = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.CREATED).json({
            success: true,
            data: await createProduct(req.body, res.locals.user)
        })
    } catch (error: any) {
        return res.status(StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            error: error.message,
        })
    }
}