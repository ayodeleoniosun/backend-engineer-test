import {NextFunction, Request, Response} from "express";
import HttpException from "../utils/exceptions/http.exception";
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";
import {verifyToken} from "../utils/helpers/jwt";

export const validateUserToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        let accessToken;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            accessToken = req.headers.authorization.split(" ")[1];
        }

        if (!accessToken) {
            throw new HttpException("You must be logged in to perform this operation", StatusCodesEnum.UNAUTHORIZED);
        }

        const userData = verifyToken(accessToken);

        if (!userData) {
            throw new HttpException('Invalid token supplied.', StatusCodesEnum.FORBIDDEN);
        }

        res.locals.user = userData;

        return next();
    } catch (err: any) {
        return res.status(err.statusCode ?? StatusCodesEnum.UNAUTHORIZED).json({
            'success': false,
            'message': err.message ?? 'You are unauthorized to perform this operation. Kindly login.'
        });
    }
}