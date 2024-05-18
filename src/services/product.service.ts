import CustomException from "../utils/exceptions/custom.exception";
import ProductModel, {Product} from "../models/product";
import {User} from '../models/user.model';
import {DocumentType} from "@typegoose/typegoose";
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";

export const index = async (user: DocumentType<User>) => {
    return ProductModel
        .find({userId: user.id})
        .sort({createdAt: 'desc'});
}

export const create = async (payload: Product, user: DocumentType<User>) => {
    const {name, description, price} = payload;

    const productExists = await getProductByName(payload.name, user.id);

    if (productExists) {
        throw new CustomException('Product already added.');
    }

    return await ProductModel.create({userId: user.id, name, description, price});
}

export const update = async (id: string, payload: Product, user: DocumentType<User>) => {
    const {name, description, price} = payload;

    const getProduct = await getProductByName(payload.name, user.id, id, 'validate');

    if (getProduct === 0) {
        throw new CustomException('Product not found.', StatusCodesEnum.NOT_FOUND);
    }

    const productExists = await getProductByName(payload.name, user.id, id);

    if (productExists === 0) {
        throw new CustomException('Product already added.');
    }

    return ProductModel.findByIdAndUpdate(
        {_id: id},
        {name, description, price},
        {new: true}
    );
}

export const getProductByName = async (name: string, userId: string, id?: string|undefined, purpose?: string) => {
    if (id) {
        if (purpose === 'validate') {
            return ProductModel.countDocuments({_id: id, userId});
        }

        return ProductModel.countDocuments({"_id": {"$ne" : id}, name, userId})
    }

    return ProductModel.findOne({name, userId});
}

export const show = async (id: string) => {
    const getProduct = await ProductModel.countDocuments({_id: id});

    if (getProduct === 0) {
        throw new CustomException('Product not found.', StatusCodesEnum.NOT_FOUND);
    }

    return ProductModel.find({_id: id});
}