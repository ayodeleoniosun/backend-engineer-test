import {faker} from "@faker-js/faker";
import mongoose from "mongoose";
import {Product} from "../../src/models/product.model";

export const getProduct = (overrides?: Partial<Product>): Partial<Product> => {
    const product = new Product();
    product._id = new mongoose.Types.ObjectId().toString();
    product.userId = new mongoose.Types.ObjectId().toString();
    product.name = faker.lorem.words(2);
    product.description = faker.lorem.words(100);
    product.price = faker.number.int(100);
    product.createdAt = new Date();
    return {...product, ...overrides};
};