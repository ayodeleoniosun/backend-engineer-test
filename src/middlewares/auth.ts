import {NextFunction, Request, Response} from "express";
import HttpException from "../utils/exceptions/http.exception";
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";
import {verifyToken} from "../utils/helpers/jwt";
import {ErrorMessages} from "../utils/enums/error.messages";
import UserModel from "../models/user.model";

export const validateUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let accessToken;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            accessToken = req.headers.authorization.split(" ")[1];
        }

        if (!accessToken) {
            throw new HttpException(ErrorMessages.UNAUTHENTICATED_USER, StatusCodesEnum.UNAUTHORIZED);
        }

        const userData = verifyToken(accessToken);

        if (typeof userData !== 'object') {
            throw new HttpException(ErrorMessages.INVALID_TOKEN, StatusCodesEnum.FORBIDDEN);
        }

        const isValidUser = await UserModel.findById(userData.id);

        if (!userData || !isValidUser) {
            throw new HttpException(ErrorMessages.INVALID_TOKEN, StatusCodesEnum.FORBIDDEN);
        }

        res.locals.user = userData;

        return next();
    } catch (err: any) {
        return res.status(err.statusCode ?? StatusCodesEnum.UNAUTHORIZED).json({
            'success': false,
            'message': err.message ?? ErrorMessages.UNAUTHORIZED_ACCESS
        });
    }
}