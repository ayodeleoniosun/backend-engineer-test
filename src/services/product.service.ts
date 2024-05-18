import CustomException from "../utils/exceptions/custom.exception";
import ProductModel, {Product} from "../models/product";
import {User} from '../models/user.model';
import {DocumentType} from "@typegoose/typegoose";

export const index = async (user: DocumentType<User>) => {
    return await ProductModel
        .find({userId: user.id})
        .sort({createdAt: 'desc'});
}


export const create = async (payload: Product, user: DocumentType<User>) => {
    const {name, description, price} = payload;

    const productExists = await getProductByName(payload.name, user.id);

    if (productExists) {
        throw new CustomException('You have added this product before.');
    }

    return await ProductModel.create({userId: user.id, name, description, price});
}

export const getProductByName = async (name: string, userId: string) => {
    return ProductModel.findOne({name, userId});
}