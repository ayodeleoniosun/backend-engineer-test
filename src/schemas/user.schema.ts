import {object, string} from "zod";

export const registrationSchema = object({
    body: object({
        firstname: string({required_error: 'Firstname is required'}).trim(),

        lastname: string({required_error: 'Lastname is required'}).trim(),

        email: string({required_error: 'Email is required'})
            .trim()
            .email({
                message: 'Invalid email supplied'
            })
            .refine(async (e) => {
                
            }),

        password: string({required_error: 'Password is required'})
            .min(8, 'Password cannot be less than 8 characters'),

        password_confirmation: string({required_error: 'Password is required'})
            .min(8, 'Password confirmation cannot be less than 8 characters')

    }).refine(data => data.password === data.password_confirmation, {
        path: ['password_confirmation'],
        message: 'Passwords do not match'
    })


});