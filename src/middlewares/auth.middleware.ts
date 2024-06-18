import {verifyToken} from "../utils/helpers/jwt";
import {ErrorMessages} from "../utils/enums/error.messages";
import UserModel from "../models/user.model";
import * as HttpStatus from 'http-status';
import {ResponseDto} from "../dtos/responses/response.dto";
import {ResponseStatus} from "../dtos/responses/response.interface";
import {ExpressMiddlewareInterface} from "routing-controllers";
import {Service} from "typedi";

@Service()
export class AuthenticateUser implements ExpressMiddlewareInterface {
    async use(req: any, res: any, next?: (err?: any) => any): Promise<any> {
        try {
            let accessToken;

            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                accessToken = req.headers.authorization.split(" ")[1];
            }

            if (!accessToken) {
                const errorResponse = new ResponseDto(ResponseStatus.ERROR, ErrorMessages.UNAUTHENTICATED_USER);

                return res.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
            }

            const userData = verifyToken(accessToken);

            if (typeof userData !== 'object') {
                const errorResponse = new ResponseDto(ResponseStatus.ERROR, ErrorMessages.INVALID_TOKEN);

                return res.status(HttpStatus.FORBIDDEN).json(errorResponse);
            }

            const isValidUser = await UserModel.findById(userData.id);

            if (!userData || !isValidUser) {
                const errorResponse = new ResponseDto(ResponseStatus.ERROR, ErrorMessages.INVALID_TOKEN);

                return res.status(HttpStatus.FORBIDDEN).json(errorResponse);
            }

            res.locals.user = userData;

            return next();
        } catch (err: any) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, err.message);

            return res.status(err.statusCode ?? HttpStatus.UNAUTHORIZED).json(errorResponse);
        }
    }
}