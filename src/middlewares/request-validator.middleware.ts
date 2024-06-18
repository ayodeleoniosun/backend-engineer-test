import {ExpressErrorMiddlewareInterface, Middleware} from 'routing-controllers';
import {Service} from "typedi";
import {ResponseDto} from "../dtos/responses/response.dto";
import {ResponseStatus} from "../dtos/responses/response.interface";
import * as HttpStatus from "http-status";

@Middleware({type: 'after'})
@Service()
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any) {
        if (error.errors === undefined) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, 'Internal server error. Try again later.');

            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
        }

        const constraints: object = error.errors[0].constraints;
        const errorMessage: string = Object.values(constraints)[0];

        const errorResponse = new ResponseDto(ResponseStatus.ERROR, errorMessage);

        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(errorResponse);
    }
}