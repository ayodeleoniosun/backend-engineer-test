import CustomException from "../utils/exceptions/custom.exception";
import ProductModel, {Product} from "../models/product.model";
import {StatusCodesEnum} from "../utils/enums/status.codes.enum";

export const index = async () => {
    return ProductModel.find()
        .sort({createdAt: 'desc'});
}

export const myProducts = async (userId: string) => {
    return ProductModel
        .find({userId})
        .sort({createdAt: 'desc'});
}

export const create = async (payload: Product, userId: string) => {
    const {name, description, price} = payload;

    const productExists = await getProductByName(payload.name, userId);

    if (productExists) {
        throw new CustomException('Product already added.');
    }

    return await ProductModel.create({userId, name, description, price});
}

export const update = async (id: string, payload: Product, userId: string) => {
    const {name, description, price} = payload;

    const getProduct = await getProductByName(payload.name, userId, id, 'validate');

    if (getProduct === 0) {
        throw new CustomException('Product not found.', StatusCodesEnum.NOT_FOUND);
    }

    const productExists = await getProductByName(payload.name, userId, id);

    if (productExists) {
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

export const destroy = async (id: string, userId: string) => {
    const getProduct = await ProductModel.countDocuments({_id: id, userId});

    if (getProduct === 0) {
        throw new CustomException('Product not found.', StatusCodesEnum.NOT_FOUND);
    }

    return ProductModel.findByIdAndDelete({_id: id, userId});
}