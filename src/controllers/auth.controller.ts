import {createUser, loginUser} from '../services/auth.service';
import {Request, Response} from 'express';
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";

export const register = async (req: Request, res: Response) => {
    try {
        const user = await createUser(req.body);

        return res.status(StatusCodesEnum.CREATED).json({
            success: true,
            data: user
        })
    } catch (error: any) {
        return res.status(StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            error: error.message,
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const user = await loginUser(req.body.email, req.body.password);

        return res.status(StatusCodesEnum.CREATED).json({
            success: true,
            data: user
        })
    } catch (error: any) {
        return res.status(StatusCodesEnum.BAD_REQUEST).json({
            success: false,
            error: error.message,
        })
    }
}