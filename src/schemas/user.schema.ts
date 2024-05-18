import {object, string} from "zod";

export const registrationSchema = object({
    body: object({
        firstname: string({required_error: 'Firstname is required'})
            .min(5, 'Firstname cannot be less than 5 characters.')
            .trim(),

        lastname: string({required_error: 'Lastname is required'})
            .min(5, 'Lastname cannot be less than 5 characters.')
            .trim(),

        email: string({required_error: 'Email is required'})
            .email({message: 'Invalid email supplied'})
            .trim(),

        password: string({required_error: 'Password is required'})
            .min(8, 'Password cannot be less than 8 characters'),

        password_confirmation: string({required_error: 'Password confirmation is required'})

    }).refine(data => data.password === data.password_confirmation, {
        path: ['password_confirmation'],
        message: 'Passwords do not match'
    })


});