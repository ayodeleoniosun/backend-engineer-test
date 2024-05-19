import {Request, Response} from 'express';
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";
import {login, register} from '../services/auth.service';
import {SuccessMessages} from '../utils/enums/success.messages';

export const registerUser = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.CREATED).json({
            success: true,
            message: SuccessMessages.REGISTRATION_SUCCESSFUL,
            data: await register(req.body)
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.OK).json({
            success: true,
            message: SuccessMessages.LOGIN_SUCCESSFUL,
            data: await login(req.body.email, req.body.password),
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}