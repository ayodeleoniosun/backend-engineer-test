import {number, object, string} from "zod";

export const createProductSchema = object({
    body: object({
        name: string({required_error: 'Product name is required'})
            .min(8, 'Product name cannot be less than 8 characters')
            .max(100, 'Product name cannot be more than 100 characters')
            .trim(),

        description: string({required_error: 'Product description is required'})
            .trim()
            .min(8, 'Product description cannot be less than 20 characters'),

        price: number({
            required_error: 'Product price is required',
            invalid_type_error: "Product price must be a number"
        }).min(1, 'Product price must have a value.'),
    })
});