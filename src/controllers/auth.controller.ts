import {Request, Response} from 'express';
import {login, register} from '../services/auth.service';
import * as HttpStatus from 'http-status';
import {SuccessMessages} from '../utils/enums/success.messages';
import {ResponseDto} from "../dtos/responses/response.dto";
import {ResponseStatus} from "../dtos/responses/response.interface";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const successResponse = new ResponseDto(
            ResponseStatus.SUCCESS,
            SuccessMessages.REGISTRATION_SUCCESSFUL,
            await register(req.body)
        );

        return res.status(HttpStatus.CREATED).json(successResponse);
    } catch (error: any) {
        const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

        return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const successResponse = new ResponseDto(
            ResponseStatus.SUCCESS,
            SuccessMessages.LOGIN_SUCCESSFUL,
            await login(req.body)
        );

        return res.status(HttpStatus.OK).json(successResponse);

    } catch (error: any) {
        const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

        return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
    }
}