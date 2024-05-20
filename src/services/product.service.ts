import HttpException from "../utils/exceptions/http.exception";
import ProductModel, {Product} from "../models/product.model";
import {ErrorMessages} from "../utils/enums/error.messages";
import {ProductDto} from "../dtos/product.dto";
import * as HttpStatus from 'http-status';
import {CreateProductPayloadDto} from "../dtos/product/create.product.dto";

export const index = async () => {
    const products = await ProductModel.find().sort({createdAt: 'desc'});

    return products.map((product) => new ProductDto(product._id, product.name, product.description, product.price, product.createdAt));
}

export const myProducts = async (userId: string) => {
    const products = await ProductModel.find({userId}).sort({createdAt: 'desc'});

    return products.map((product) => new ProductDto(product._id, product.name, product.description, product.price, product.createdAt));
}

export const create = async (payload: CreateProductPayloadDto, userId: string) => {
    const {name, description, price} = payload;

    const product = await findProductByCriteria({name: payload.name, userId});

    if (product) {
        throw new HttpException(ErrorMessages.PRODUCT_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    const createdProduct = await ProductModel.create({userId, name, description, price});

    return new ProductDto(createdProduct._id, name, description, createdProduct.price, createdProduct.createdAt)
}

export const update = async (id: string, payload: Product, userId: string) => {
    const {name, description, price} = payload;

    const product = await findProductByCriteria({_id: id, userId});

    if (!product) {
        throw new HttpException(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const productExists = await findExistingProductByCriteria(id, {name: payload.name, userId});

    console.log(productExists);

    if (productExists) {
        throw new HttpException(ErrorMessages.PRODUCT_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    return ProductModel.findByIdAndUpdate(
        {_id: id},
        {name, description, price},
        {new: true}
    );
}

export const findProductByCriteria = async (criteria: object) => {
    return ProductModel.findOne(criteria);
}

export const findExistingProductByCriteria = async (id: string, criteria: object) => {
    console.log(criteria);
    return ProductModel.findOne({"_id": {"$ne": id}, criteria});
}

export const show = async (id: string) => {
    const product = await ProductModel.findById(id);

    if (!product) {
        throw new HttpException(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return new ProductDto(product._id, product.name, product.description, product.price, product.createdAt)
}

export const destroy = async (id: string, userId: string) => {
    const product = await findProductByCriteria({_id: id, userId});

    if (!product) {
        throw new HttpException(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return ProductModel.findByIdAndDelete(id);
}