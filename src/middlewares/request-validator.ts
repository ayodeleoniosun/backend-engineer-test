import {NextFunction, Request, Response} from "express";
import {AnyZodObject, ZodError} from "zod";
import * as HttpStatus from "http-status";
import {ResponseDto} from "../dtos/responses/response.dto";
import {ResponseStatus} from "../dtos/responses/response.interface";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            params: req.params,
            query: req.query,
            body: req.body,
        });

        next();
    } catch (err: any) {
        if (err instanceof ZodError) {
            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(
                new ResponseDto(ResponseStatus.ERROR, err.errors[0].message)
            )
        }

        next(err);
    }
};