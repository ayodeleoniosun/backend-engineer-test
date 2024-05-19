import {object, string} from "zod";
import {ErrorMessages} from "../utils/enums/error.messages";

export const registrationSchema = object({
    body: object({
        firstname: string({required_error: ErrorMessages.FIRSTNAME_REQUIRED})
            .min(3, ErrorMessages.FIRSTNAME_MIN_LEGNTH_ERROR)
            .trim(),

        lastname: string({required_error: ErrorMessages.LASTNAME_REQUIRED})
            .min(3, ErrorMessages.LASTNAME_MIN_LEGNTH_ERROR)
            .trim(),

        email: string({required_error: ErrorMessages.EMAIL_REQUIRED})
            .email({message: ErrorMessages.INVALID_EMAIL_SUPPLIED})
            .trim(),

        password: string({required_error: ErrorMessages.PASSWORD_REQUIRED})
            .min(8, ErrorMessages.PASSWORD_MIN_LEGNTH_ERROR),

        password_confirmation: string({required_error: ErrorMessages.PASSWORD_CONFIRMATION_REQUIRED})

    }).refine(data => data.password === data.password_confirmation, {
        path: ['password_confirmation'],
        message: ErrorMessages.PASSWORDS_DO_NOT_MATCH
    })


});