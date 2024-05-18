import {createUser, loginUser} from '../services/auth.service';
import {Request, Response} from 'express';
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";

export const register = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.CREATED).json({
            success: true,
            message: 'Registration successful. You can login now',
            data: await createUser(req.body)
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        return res.status(StatusCodesEnum.CREATED).json({
            success: true,
            message: 'Login successful.',
            data: await loginUser(req.body.email, req.body.password),
        })
    } catch (error: any) {
        return res.status(error.statusCode ?? StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            message: error.message,
        })
    }
}