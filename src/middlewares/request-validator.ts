import {NextFunction, Request, Response} from "express";
import {AnyZodObject, ZodError} from "zod";
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";

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
            return res.status(StatusCodesEnum.UNPROCESSABLE_ENTITY).json({
                success: false,
                message: err.errors[0].message,
            });
        }

        next(err);
    }
};