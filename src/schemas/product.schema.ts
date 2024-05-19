import {number, object, string} from "zod";
import {ErrorMessages} from "../utils/enums/error.messages";

export const createProductSchema = object({
    body: object({
        name: string({required_error: ErrorMessages.PRODUCT_NAME_REQUIRED})
            .min(8, ErrorMessages.PRODUCT_NAME_MIN_LEGNTH_ERROR)
            .max(100, ErrorMessages.PRODUCT_NAME_MAX_LEGNTH_ERROR)
            .trim(),

        description: string({required_error: ErrorMessages.PRODUCT_DESCRIPTION_REQUIRED})
            .trim()
            .min(100, ErrorMessages.PRODUCT_DESCRIPTION_MIN_LEGNTH_ERROR),

        price: number({
            required_error: ErrorMessages.PRODUCT_PRICE_REQUIRED,
            invalid_type_error: ErrorMessages.PRODUCT_PRICE_VALIDITY
        }).min(1, ErrorMessages.PRODUCT_PRICE_MIN_LEGNTH_ERROR),
    })
});