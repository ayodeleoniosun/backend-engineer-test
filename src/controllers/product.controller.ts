import {Request, Response} from 'express';
import {create, destroy, index, myProducts, show, update} from '../services/product.service';
import {SuccessMessages} from "../utils/enums/success.messages";
import {ResponseDto} from "../dtos/responses/response.dto";
import {ResponseStatus} from "../dtos/responses/response.interface";
import * as HttpStatus from 'http-status';

export const allProducts = async (req: Request, res: Response) => {
    try {
        const successResponse = new ResponseDto(
            ResponseStatus.SUCCESS,
            SuccessMessages.PRODUCTS_RETRIEVED,
            await index()
        );

        return res.status(HttpStatus.OK).json(successResponse)
    } catch (error: any) {
        const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

        return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse)
    }
}

export const userProducts = async (req: Request, res: Response) => {
    try {
        const successResponse = new ResponseDto(
            ResponseStatus.SUCCESS,
            SuccessMessages.PRODUCTS_RETRIEVED,
            await myProducts(res.locals.user.id)
        );

        return res.status(HttpStatus.OK).json(successResponse);
    } catch (error: any) {
        const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

        return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
    }
}

export const store = async (req: Request, res: Response) => {
    try {
        const successResponse = new ResponseDto(
            ResponseStatus.SUCCESS,
            SuccessMessages.PRODUCT_CREATED,
            await create(req.body, res.locals.user.id)
        );

        return res.status(HttpStatus.CREATED).json(successResponse)
    } catch (error: any) {
        const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

        return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const successResponse = new ResponseDto(
            ResponseStatus.SUCCESS,
            SuccessMessages.PRODUCT_UPDATED,
            await update(req.params.id, req.body, res.locals.user.id)
        );

        return res.status(HttpStatus.OK).json(successResponse);

    } catch (error: any) {
        const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

        return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
    }
}

export const showProduct = async (req: Request, res: Response) => {
    try {
        const successResponse = new ResponseDto(
            ResponseStatus.SUCCESS,
            SuccessMessages.PRODUCT_RETRIEVED,
            await show(req.params.id)
        );

        return res.status(HttpStatus.OK).json(successResponse);
    } catch (error: any) {
        const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

        return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await destroy(req.params.id, res.locals.user.id);

        const successResponse = new ResponseDto(
            ResponseStatus.SUCCESS,
            SuccessMessages.PRODUCT_DELETED,
        );

        return res.status(HttpStatus.OK).json(successResponse);

    } catch (error: any) {
        const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

        return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
    }
}